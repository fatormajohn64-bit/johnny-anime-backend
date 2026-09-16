import { query } from "../../database/database.js";

// --------------------------------------------------
// Get continue watching
// --------------------------------------------------

export async function getContinueWatching(
  limit = 20
) {
  const result = await query(
    `
    SELECT
      wp.id,

      wp.position_seconds,
      wp.duration_seconds,
      wp.completed,
      wp.updated_at,

      CASE
        WHEN wp.episode_id IS NOT NULL
        THEN 'episode'

        WHEN wp.movie_id IS NOT NULL
        THEN 'movie'

        ELSE 'unknown'
      END AS media_type,

      -- Episode information
      e.id AS episode_id,
      e.episode_number,
      e.title AS episode_title,
      e.thumbnail AS episode_thumbnail,

      s.id AS season_id,
      s.season_number,
      s.title AS season_title,

      -- Movie information
      m.id AS movie_id,
      m.title AS movie_title,
      m.poster AS movie_poster,
      m.release_year,
      m.duration AS movie_duration,

      -- Anime information
      a.id AS anime_id,
      a.anilist_id,
      a.title_romaji,
      a.title_english,
      a.title_native,
      a.cover_image

    FROM watch_progress wp

    LEFT JOIN episodes e
      ON e.id = wp.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN movies m
      ON m.id = wp.movie_id

    LEFT JOIN anime a
      ON a.id = COALESCE(
        s.anime_id,
        m.anime_id
      )

    WHERE
      wp.completed = false
      AND (
        wp.position_seconds > 0
        OR wp.duration_seconds > 0
      )

    ORDER BY
      wp.updated_at DESC

    LIMIT $1
    `,
    [limit]
  );

  return result.rows.map((item) => ({
    id: item.id,

    mediaType:
      item.media_type,

    positionSeconds:
      Number(item.position_seconds || 0),

    durationSeconds:
      Number(item.duration_seconds || 0),

    progressPercent:
      calculateProgress(
        item.position_seconds,
        item.duration_seconds
      ),

    updatedAt:
      item.updated_at,

    anime: item.anime_id
      ? {
          id: item.anime_id,

          anilistId:
            item.anilist_id,

          titleRomaji:
            item.title_romaji,

          titleEnglish:
            item.title_english,

          titleNative:
            item.title_native,

          coverImage:
            item.cover_image
        }
      : null,

    episode:
      item.episode_id
        ? {
            id: item.episode_id,

            number:
              item.episode_number,

            title:
              item.episode_title,

            thumbnail:
              item.episode_thumbnail,

            seasonId:
              item.season_id,

            seasonNumber:
              item.season_number,

            seasonTitle:
              item.season_title
          }
        : null,

    movie:
      item.movie_id
        ? {
            id: item.movie_id,

            title:
              item.movie_title,

            poster:
              item.movie_poster,

            releaseYear:
              item.release_year,

            duration:
              item.movie_duration
          }
        : null
  }));
}


// --------------------------------------------------
// Calculate progress percentage
// --------------------------------------------------

function calculateProgress(
  position,
  duration
) {
  const current =
    Number(position || 0);

  const total =
    Number(duration || 0);

  if (
    total <= 0 ||
    current <= 0
  ) {
    return 0;
  }

  const percentage =
    (current / total) * 100;

  return Math.min(
    100,
    Math.round(
      percentage * 100
    ) / 100
  );
}
