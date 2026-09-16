import { query } from "../../database/database.js";

// --------------------------------------------------
// Get complete anime details
// --------------------------------------------------

export async function getAnimeDetails(
  animeId
) {
  const animeResult = await query(
    `
    SELECT
      a.*,

      EXISTS (
        SELECT 1
        FROM library l
        WHERE l.anime_id = a.id
      ) AS in_library,

      EXISTS (
        SELECT 1
        FROM favorites f
        WHERE f.anime_id = a.id
      ) AS is_favorite

    FROM anime a

    WHERE a.id = $1
    `,
    [animeId]
  );

  if (!animeResult.rows.length) {
    return null;
  }

  const anime =
    animeResult.rows[0];

  // ------------------------------------------------
  // Seasons
  // ------------------------------------------------

  const seasonsResult = await query(
    `
    SELECT
      s.id,
      s.season_number,
      s.title,
      s.description,
      s.created_at,

      COUNT(e.id)::INTEGER AS episode_count

    FROM seasons s

    LEFT JOIN episodes e
      ON e.season_id = s.id

    WHERE s.anime_id = $1

    GROUP BY
      s.id

    ORDER BY
      s.season_number ASC
    `,
    [animeId]
  );

  // ------------------------------------------------
  // Episodes
  // ------------------------------------------------

  const episodesResult = await query(
    `
    SELECT
      e.id,

      e.season_id,
      e.episode_number,

      e.title,
      e.description,

      e.duration,
      e.thumbnail,

      COALESCE(
        wp.position_seconds,
        0
      ) AS position_seconds,

      COALESCE(
        wp.duration_seconds,
        0
      ) AS duration_seconds,

      COALESCE(
        wp.completed,
        false
      ) AS completed,

      EXISTS (
        SELECT 1
        FROM video_sources vs
        WHERE vs.episode_id = e.id
      ) AS has_video_source,

      EXISTS (
        SELECT 1
        FROM downloads d
        WHERE d.episode_id = e.id
      ) AS downloaded

    FROM episodes e

    JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id

    WHERE s.anime_id = $1

    ORDER BY
      s.season_number ASC,
      e.episode_number ASC
    `,
    [animeId]
  );

  // ------------------------------------------------
  // Movies
  // ------------------------------------------------

  const moviesResult = await query(
    `
    SELECT
      m.*,

      COALESCE(
        wp.position_seconds,
        0
      ) AS position_seconds,

      COALESCE(
        wp.duration_seconds,
        0
      ) AS duration_seconds,

      COALESCE(
        wp.completed,
        false
      ) AS completed,

      EXISTS (
        SELECT 1
        FROM video_sources vs
        WHERE vs.movie_id = m.id
      ) AS has_video_source,

      EXISTS (
        SELECT 1
        FROM downloads d
        WHERE d.movie_id = m.id
      ) AS downloaded,

      EXISTS (
        SELECT 1
        FROM favorites f
        WHERE f.movie_id = m.id
      ) AS is_favorite

    FROM movies m

    LEFT JOIN watch_progress wp
      ON wp.movie_id = m.id

    WHERE m.anime_id = $1

    ORDER BY
      m.release_year ASC NULLS LAST,
      m.id ASC
    `,
    [animeId]
  );

  // ------------------------------------------------
  // Download count
  // ------------------------------------------------

  const downloadCountResult =
    await query(
      `
      SELECT
        COUNT(*)::INTEGER AS count

      FROM downloads d

      JOIN episodes e
        ON e.id = d.episode_id

      JOIN seasons s
        ON s.id = e.season_id

      WHERE s.anime_id = $1

      OR d.movie_id IN (
        SELECT id
        FROM movies
        WHERE anime_id = $1
      )
      `,
      [animeId]
    );

  // ------------------------------------------------
  // Return
  // ------------------------------------------------

  return {
    anime,

    seasons:
      seasonsResult.rows,

    episodes:
      episodesResult.rows,

    movies:
      moviesResult.rows,

    stats: {
      seasonCount:
        seasonsResult.rows.length,

      episodeCount:
        episodesResult.rows.length,

      movieCount:
        moviesResult.rows.length,

      downloadCount:
        downloadCountResult.rows[0]?.count || 0
    }
  };
}
