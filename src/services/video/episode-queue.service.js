import { query } from "../../database/database.js";

// --------------------------------------------------
// Get episode queue
// --------------------------------------------------

export async function getEpisodeQueue(
  episodeId,
  limit = 5
) {
  const currentResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.description,
      e.duration,
      e.thumbnail,

      s.id AS season_id,
      s.season_number,
      s.title AS season_title,

      a.id AS anime_id,
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

  const current = currentResult.rows[0];

  const previousResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.thumbnail

    FROM episodes e

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

  const nextResult = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.thumbnail

    FROM episodes e

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

  const upcomingResult = await query(
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

    WHERE
      e.season_id = $1
      AND e.episode_number > $2

    ORDER BY
      e.episode_number ASC

    LIMIT $3
    `,
    [
      current.season_id,
      current.episode_number,
      limit
    ]
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

      number:
        current.season_number,

      title:
        current.season_title
    },

    current: {
      id: current.id,

      episodeNumber:
        current.episode_number,

      title:
        current.title,

      description:
        current.description,

      duration:
        current.duration,

      thumbnail:
        current.thumbnail
    },

    previous:
      previousResult.rows[0] || null,

    next:
      nextResult.rows[0] || null,

    upcoming:
      upcomingResult.rows
  };
}
