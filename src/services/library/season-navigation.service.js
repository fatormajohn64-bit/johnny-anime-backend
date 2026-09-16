import { query } from "../../database/database.js";

// --------------------------------------------------
// Get season navigation
// --------------------------------------------------

export async function getSeasonNavigation(
  seasonId
) {
  // ------------------------------------------------
  // Current season
  // ------------------------------------------------

  const seasonResult = await query(
    `
    SELECT
      s.id,
      s.anime_id,
      s.season_number,
      s.title,
      s.description,

      a.title_romaji,
      a.title_english,
      a.title_native,
      a.cover_image

    FROM seasons s

    JOIN anime a
      ON a.id = s.anime_id

    WHERE s.id = $1
    `,
    [seasonId]
  );

  if (!seasonResult.rows.length) {
    return null;
  }

  const current =
    seasonResult.rows[0];

  // ------------------------------------------------
  // Previous season
  // ------------------------------------------------

  const previousResult = await query(
    `
    SELECT
      s.id,
      s.season_number,
      s.title,
      s.description

    FROM seasons s

    WHERE
      s.anime_id = $1
      AND s.season_number < $2

    ORDER BY
      s.season_number DESC

    LIMIT 1
    `,
    [
      current.anime_id,
      current.season_number
    ]
  );

  // ------------------------------------------------
  // Next season
  // ------------------------------------------------

  const nextResult = await query(
    `
    SELECT
      s.id,
      s.season_number,
      s.title,
      s.description

    FROM seasons s

    WHERE
      s.anime_id = $1
      AND s.season_number > $2

    ORDER BY
      s.season_number ASC

    LIMIT 1
    `,
    [
      current.anime_id,
      current.season_number
    ]
  );

  // ------------------------------------------------
  // Episodes
  // ------------------------------------------------

  const episodesResult = await query(
    `
    SELECT
      e.id,
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

    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id

    WHERE e.season_id = $1

    ORDER BY
      e.episode_number ASC
    `,
    [seasonId]
  );

  return {
    anime: {
      id: current.anime_id,

      titleRomaji:
        current.title_romaji,

      titleEnglish:
        current.title_english,

      titleNative:
        current.title_native,

      coverImage:
        current.cover_image
    },

    current: {
      id: current.id,
      number: current.season_number,
      title: current.title,
      description: current.description
    },

    previous:
      previousResult.rows[0] || null,

    next:
      nextResult.rows[0] || null,

    episodes:
      episodesResult.rows
  };
}
