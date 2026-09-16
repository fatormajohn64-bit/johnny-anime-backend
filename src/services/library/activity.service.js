import { query } from "../../database/database.js";

// --------------------------------------------------
// Recently watched
// --------------------------------------------------

export async function getRecentlyWatched(
  limit = 20
) {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  const result = await query(
    `
    SELECT
      wp.id,

      CASE
        WHEN wp.episode_id IS NOT NULL
          THEN 'episode'
        WHEN wp.movie_id IS NOT NULL
          THEN 'movie'
      END AS media_type,

      wp.episode_id,
      wp.movie_id,

      wp.position_seconds,
      wp.duration_seconds,
      wp.completed,

      wp.updated_at,

      -- Episode

      e.episode_number,
      e.title AS episode_title,

      s.season_number,

      -- Movie

      m.title AS movie_title,
      m.release_year AS movie_release_year,

      -- Anime

      COALESCE(
        episode_anime.id,
        movie_anime.id
      ) AS anime_id,

      COALESCE(
        episode_anime.title_romaji,
        movie_anime.title_romaji
      ) AS title_romaji,

      COALESCE(
        episode_anime.title_english,
        movie_anime.title_english
      ) AS title_english,

      COALESCE(
        episode_anime.title_native,
        movie_anime.title_native
      ) AS title_native,

      COALESCE(
        episode_anime.cover_image,
        movie_anime.cover_image
      ) AS cover_image

    FROM watch_progress wp

    LEFT JOIN episodes e
      ON e.id = wp.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN anime episode_anime
      ON episode_anime.id = s.anime_id

    LEFT JOIN movies m
      ON m.id = wp.movie_id

    LEFT JOIN anime movie_anime
      ON movie_anime.id = m.anime_id

    ORDER BY
      wp.updated_at DESC

    LIMIT $1
    `,
    [safeLimit]
  );

  return result.rows;
}

// --------------------------------------------------
// Recently added to library
// --------------------------------------------------

export async function getRecentlyAdded(
  limit = 20
) {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  const result = await query(
    `
    SELECT
      a.id,
      a.anilist_id,

      a.title_romaji,
      a.title_english,
      a.title_native,

      a.cover_image,
      a.banner_image,

      a.format,
      a.status,

      a.total_episodes,
      a.duration,

      a.season,
      a.season_year,

      l.added_at

    FROM library l

    JOIN anime a
      ON a.id = l.anime_id

    ORDER BY
      l.added_at DESC

    LIMIT $1
    `,
    [safeLimit]
  );

  return result.rows;
}

// --------------------------------------------------
// Recently downloaded
// --------------------------------------------------

export async function getRecentlyDownloaded(
  limit = 20
) {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  const result = await query(
    `
    SELECT
      d.id,

      CASE
        WHEN d.episode_id IS NOT NULL
          THEN 'episode'
        WHEN d.movie_id IS NOT NULL
          THEN 'movie'
      END AS media_type,

      d.episode_id,
      d.movie_id,

      d.storage_key,
      d.file_name,
      d.mime_type,

      d.quality,
      d.format,
      d.size_bytes,

      d.status,

      d.created_at,
      d.updated_at,

      -- Episode

      e.episode_number,
      e.title AS episode_title,

      s.season_number,

      -- Movie

      m.title AS movie_title,
      m.release_year AS movie_release_year,

      -- Anime

      COALESCE(
        episode_anime.id,
        movie_anime.id
      ) AS anime_id,

      COALESCE(
        episode_anime.title_romaji,
        movie_anime.title_romaji
      ) AS title_romaji,

      COALESCE(
        episode_anime.title_english,
        movie_anime.title_english
      ) AS title_english,

      COALESCE(
        episode_anime.title_native,
        movie_anime.title_native
      ) AS title_native,

      COALESCE(
        episode_anime.cover_image,
        movie_anime.cover_image
      ) AS cover_image

    FROM downloads d

    LEFT JOIN episodes e
      ON e.id = d.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN anime episode_anime
      ON episode_anime.id = s.anime_id

    LEFT JOIN movies m
      ON m.id = d.movie_id

    LEFT JOIN anime movie_anime
      ON movie_anime.id = m.anime_id

    ORDER BY
      d.updated_at DESC

    LIMIT $1
    `,
    [safeLimit]
  );

  return result.rows;
}

// --------------------------------------------------
// Favorites
// --------------------------------------------------

export async function getFavoriteActivity(
  limit = 20
) {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  const result = await query(
    `
    SELECT
      f.id,

      CASE
        WHEN f.anime_id IS NOT NULL
          THEN 'anime'
        WHEN f.movie_id IS NOT NULL
          THEN 'movie'
      END AS media_type,

      f.anime_id,
      f.movie_id,

      f.created_at,

      -- Anime

      a.title_romaji,
      a.title_english,
      a.title_native,

      a.cover_image,

      -- Movie

      m.title AS movie_title,
      m.poster AS movie_poster,
      m.release_year AS movie_release_year

    FROM favorites f

    LEFT JOIN anime a
      ON a.id = f.anime_id

    LEFT JOIN movies m
      ON m.id = f.movie_id

    ORDER BY
      f.created_at DESC

    LIMIT $1
    `,
    [safeLimit]
  );

  return result.rows;
}

// --------------------------------------------------
// Full activity
// --------------------------------------------------

export async function getActivity(
  limit = 20
) {
  const [
    recentlyWatched,
    recentlyAdded,
    recentlyDownloaded,
    favorites
  ] = await Promise.all([
    getRecentlyWatched(limit),
    getRecentlyAdded(limit),
    getRecentlyDownloaded(limit),
    getFavoriteActivity(limit)
  ]);

  return {
    recentlyWatched,
    recentlyAdded,
    recentlyDownloaded,
    favorites
  };
}
