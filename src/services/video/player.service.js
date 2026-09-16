import { query } from "../../database/database.js";

// --------------------------------------------------
// Get episode player data
// --------------------------------------------------

export async function getEpisodePlayerData(
  episodeId
) {
  const result = await query(
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

      a.id AS anime_id,
      a.title_romaji,
      a.title_english,
      a.title_native,
      a.cover_image,

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
      ) AS completed

    FROM episodes e

    JOIN seasons s
      ON s.id = e.season_id

    JOIN anime a
      ON a.id = s.anime_id

    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id

    WHERE e.id = $1
    `,
    [episodeId]
  );

  if (!result.rows.length) {
    return null;
  }

  const episode = result.rows[0];

  const sources = await query(
    `
    SELECT
      id,
      source_type,
      source_url,
      quality,
      format,
      size_bytes
    FROM video_sources
    WHERE episode_id = $1
    ORDER BY
      CASE quality
        WHEN '2160p' THEN 1
        WHEN '1440p' THEN 2
        WHEN '1080p' THEN 3
        WHEN '720p' THEN 4
        WHEN '480p' THEN 5
        ELSE 6
      END,
      id ASC
    `,
    [episodeId]
  );

  return {
    type: "episode",

    anime: {
      id: episode.anime_id,
      titleRomaji: episode.title_romaji,
      titleEnglish: episode.title_english,
      titleNative: episode.title_native,
      coverImage: episode.cover_image
    },

    season: {
      id: episode.season_id,
      number: episode.season_number
    },

    episode: {
      id: episode.id,
      number: episode.episode_number,
      title: episode.title,
      description: episode.description,
      duration: episode.duration,
      thumbnail: episode.thumbnail
    },

    progress: {
      positionSeconds: Number(
        episode.position_seconds
      ),
      durationSeconds: Number(
        episode.duration_seconds
      ),
      completed: episode.completed
    },

    sources: sources.rows
  };
}

// --------------------------------------------------
// Get movie player data
// --------------------------------------------------

export async function getMoviePlayerData(
  movieId
) {
  const result = await query(
    `
    SELECT
      m.id,
      m.title,
      m.description,
      m.release_year,
      m.duration,
      m.poster,

      a.id AS anime_id,
      a.title_romaji,
      a.title_english,
      a.title_native,
      a.cover_image,

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
      ) AS completed

    FROM movies m

    LEFT JOIN anime a
      ON a.id = m.anime_id

    LEFT JOIN watch_progress wp
      ON wp.movie_id = m.id

    WHERE m.id = $1
    `,
    [movieId]
  );

  if (!result.rows.length) {
    return null;
  }

  const movie = result.rows[0];

  const sources = await query(
    `
    SELECT
      id,
      source_type,
      source_url,
      quality,
      format,
      size_bytes
    FROM video_sources
    WHERE movie_id = $1
    ORDER BY
      CASE quality
        WHEN '2160p' THEN 1
        WHEN '1440p' THEN 2
        WHEN '1080p' THEN 3
        WHEN '720p' THEN 4
        WHEN '480p' THEN 5
        ELSE 6
      END,
      id ASC
    `,
    [movieId]
  );

  return {
    type: "movie",

    anime: movie.anime_id
      ? {
          id: movie.anime_id,
          titleRomaji: movie.title_romaji,
          titleEnglish: movie.title_english,
          titleNative: movie.title_native,
          coverImage: movie.cover_image
        }
      : null,

    movie: {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      releaseYear: movie.release_year,
      duration: movie.duration,
      poster: movie.poster
    },

    progress: {
      positionSeconds: Number(
        movie.position_seconds
      ),
      durationSeconds: Number(
        movie.duration_seconds
      ),
      completed: movie.completed
    },

    sources: sources.rows
  };
}
