import { query } from "../../database/database.js";

// --------------------------------------------------
// Get episode navigation
// --------------------------------------------------

export async function getEpisodeNavigation(
  episodeId
) {
  const currentResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.duration,
      e.thumbnail,

      s.id AS season_id,
      s.season_number,
      s.anime_id,

      a.title_romaji,
      a.title_english,
      a.title_native,
      a.cover_image

    FROM episodes e

    JOIN seasons s
      ON s.id = e.season_id

    JOIN anime a
      ON a.id = s.anime_id

    WHERE e.id = $1
    `,
    [episodeId]
  );

  if (!currentResult.rows.length) {
    return null;
  }

  const current =
    currentResult.rows[0];

  // ------------------------------------------------
  // Previous episode
  // ------------------------------------------------

  const previousResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.duration,
      e.thumbnail,

      COALESCE(
        wp.position_seconds,
        0
      ) AS position_seconds,

      COALESCE(
        wp.completed,
        false
      ) AS completed

    FROM episodes e

    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id

    WHERE
      e.season_id = $1
      AND e.episode_number < $2

    ORDER BY
      e.episode_number DESC

    LIMIT 1
    `,
    [
      current.season_id,
      current.episode_number
    ]
  );

  // ------------------------------------------------
  // Next episode
  // ------------------------------------------------

  const nextResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.duration,
      e.thumbnail,

      COALESCE(
        wp.position_seconds,
        0
      ) AS position_seconds,

      COALESCE(
        wp.completed,
        false
      ) AS completed

    FROM episodes e

    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id

    WHERE
      e.season_id = $1
      AND e.episode_number > $2

    ORDER BY
      e.episode_number ASC

    LIMIT 1
    `,
    [
      current.season_id,
      current.episode_number
    ]
  );

  // ------------------------------------------------
  // Current progress
  // ------------------------------------------------

  const progressResult = await query(
    `
    SELECT
      position_seconds,
      duration_seconds,
      completed

    FROM watch_progress

    WHERE episode_id = $1
    `,
    [episodeId]
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

    season: {
      id: current.season_id,
      number: current.season_number
    },

    current: {
      id: current.id,
      episodeNumber:
        current.episode_number,
      title: current.title,
      duration: current.duration,
      thumbnail: current.thumbnail,

      progress:
        progressResult.rows[0] || {
          position_seconds: 0,
          duration_seconds: 0,
          completed: false
        }
    },

    previous:
      previousResult.rows[0] || null,

    next:
      nextResult.rows[0] || null
  };
}
