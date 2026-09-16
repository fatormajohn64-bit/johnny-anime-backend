import { query } from "../../database/database.js";

// --------------------------------------------------
// Library Dashboard
// --------------------------------------------------

export async function getLibraryDashboard() {
  // ------------------------------------------------
  // Library
  // ------------------------------------------------

  const libraryResult = await query(`
    SELECT
      a.id,
      a.anilist_id,

      a.title_romaji,
      a.title_english,
      a.title_native,

      a.description,

      a.cover_image,
      a.banner_image,

      a.format,
      a.status,

      a.total_episodes,
      a.duration,

      a.season,
      a.season_year,

      l.added_at,

      COUNT(DISTINCT s.id)::INTEGER AS season_count,
      COUNT(DISTINCT e.id)::INTEGER AS episode_count,
      COUNT(DISTINCT m.id)::INTEGER AS movie_count

    FROM library l

    JOIN anime a
      ON a.id = l.anime_id

    LEFT JOIN seasons s
      ON s.anime_id = a.id

    LEFT JOIN episodes e
      ON e.season_id = s.id

    LEFT JOIN movies m
      ON m.anime_id = a.id

    GROUP BY
      a.id,
      l.added_at

    ORDER BY
      l.added_at DESC
  `);

  // ------------------------------------------------
  // Continue Watching
  // ------------------------------------------------

  const continueWatchingResult = await query(`
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

      -- Episode information

      e.episode_number,
      e.title AS episode_title,

      s.id AS season_id,
      s.season_number,

      -- Movie information

      m.title AS movie_title,
      m.release_year AS movie_release_year,
      m.poster AS movie_poster,

      -- Anime information

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

    -- Episode path

    LEFT JOIN episodes e
      ON e.id = wp.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN anime episode_anime
      ON episode_anime.id = s.anime_id

    -- Movie path

    LEFT JOIN movies m
      ON m.id = wp.movie_id

    LEFT JOIN anime movie_anime
      ON movie_anime.id = m.anime_id

    WHERE
      wp.completed = false
      AND wp.position_seconds > 0

    ORDER BY
      wp.updated_at DESC
  `);

  // ------------------------------------------------
  // Downloads
  // ------------------------------------------------

  const downloadsResult = await query(`
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

      -- Episode information

      e.episode_number,
      e.title AS episode_title,

      s.season_number,

      -- Movie information

      m.title AS movie_title,
      m.release_year AS movie_release_year,

      -- Anime information

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

    -- Episode path

    LEFT JOIN episodes e
      ON e.id = d.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN anime episode_anime
      ON episode_anime.id = s.anime_id

    -- Movie path

    LEFT JOIN movies m
      ON m.id = d.movie_id

    LEFT JOIN anime movie_anime
      ON movie_anime.id = m.anime_id

    ORDER BY
      d.updated_at DESC
  `);

  // ------------------------------------------------
  // Recent movies
  // ------------------------------------------------

  const moviesResult = await query(`
    SELECT
      m.id,
      m.anime_id,

      m.title,
      m.description,

      m.release_year,
      m.duration,

      m.poster,

      m.created_at,

      a.title_romaji,
      a.title_english,
      a.title_native,

      a.cover_image

    FROM movies m

    LEFT JOIN anime a
      ON a.id = m.anime_id

    ORDER BY
      m.created_at DESC

    LIMIT 20
  `);

  // ------------------------------------------------
  // Dashboard
  // ------------------------------------------------

  const library = libraryResult.rows;
  const continueWatching =
    continueWatchingResult.rows;
  const downloads = downloadsResult.rows;
  const movies = moviesResult.rows;

  return {
    library,

    continueWatching,

    downloads,

    movies,

    stats: {
      libraryCount: library.length,

      continueWatchingCount:
        continueWatching.length,

      downloadCount:
        downloads.length,

      movieCount:
        movies.length
    }
  };
}
