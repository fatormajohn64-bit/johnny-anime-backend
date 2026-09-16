import { query } from "../../database/database.js";

// --------------------------------------------------
// Seasons
// --------------------------------------------------

export async function createSeason(
  animeId,
  seasonNumber,
  title = null,
  description = null
) {
  const result = await query(
    `
    INSERT INTO seasons (
      anime_id,
      season_number,
      title,
      description
    )
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (anime_id, season_number)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description
    RETURNING *
    `,
    [animeId, seasonNumber, title, description]
  );

  return result.rows[0];
}

export async function getSeasons(animeId) {
  const result = await query(
    `
    SELECT *
    FROM seasons
    WHERE anime_id = $1
    ORDER BY season_number ASC
    `,
    [animeId]
  );

  return result.rows;
}

// --------------------------------------------------
// Episodes
// --------------------------------------------------

export async function createEpisode(
  seasonId,
  episodeNumber,
  title = null,
  description = null,
  duration = null,
  thumbnail = null
) {
  const result = await query(
    `
    INSERT INTO episodes (
      season_id,
      episode_number,
      title,
      description,
      duration,
      thumbnail
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (season_id, episode_number)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      duration = EXCLUDED.duration,
      thumbnail = EXCLUDED.thumbnail
    RETURNING *
    `,
    [
      seasonId,
      episodeNumber,
      title,
      description,
      duration,
      thumbnail
    ]
  );

  return result.rows[0];
}

export async function getEpisodes(seasonId) {
  const result = await query(
    `
    SELECT
      e.*,
      COALESCE(wp.position_seconds, 0) AS position_seconds,
      COALESCE(wp.duration_seconds, 0) AS duration_seconds,
      COALESCE(wp.completed, false) AS completed
    FROM episodes e
    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id
    WHERE e.season_id = $1
    ORDER BY e.episode_number ASC
    `,
    [seasonId]
  );

  return result.rows;
}

export async function getEpisodeById(episodeId) {
  const result = await query(
    `
    SELECT
      e.*,
      s.season_number,
      s.anime_id,
      COALESCE(wp.position_seconds, 0) AS position_seconds,
      COALESCE(wp.duration_seconds, 0) AS duration_seconds,
      COALESCE(wp.completed, false) AS completed
    FROM episodes e
    JOIN seasons s
      ON s.id = e.season_id
    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id
    WHERE e.id = $1
    `,
    [episodeId]
  );

  return result.rows[0] || null;
}
