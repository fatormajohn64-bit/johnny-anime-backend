import { query } from "../../database/database.js";

// --------------------------------------------------
// Save episode progress
// --------------------------------------------------

export async function saveEpisodeProgress({
  episodeId,
  positionSeconds = 0,
  durationSeconds = 0,
  completed = false
}) {
  const result = await query(
    `
    INSERT INTO watch_progress (
      episode_id,
      position_seconds,
      duration_seconds,
      completed,
      updated_at
    )
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)

    ON CONFLICT (episode_id)
    DO UPDATE SET
      position_seconds = EXCLUDED.position_seconds,
      duration_seconds = EXCLUDED.duration_seconds,
      completed = EXCLUDED.completed,
      updated_at = CURRENT_TIMESTAMP

    RETURNING *
    `,
    [
      episodeId,
      positionSeconds,
      durationSeconds,
      completed
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Save movie progress
// --------------------------------------------------

export async function saveMovieProgress({
  movieId,
  positionSeconds = 0,
  durationSeconds = 0,
  completed = false
}) {
  const result = await query(
    `
    INSERT INTO watch_progress (
      movie_id,
      position_seconds,
      duration_seconds,
      completed,
      updated_at
    )
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)

    ON CONFLICT (movie_id)
    DO UPDATE SET
      position_seconds = EXCLUDED.position_seconds,
      duration_seconds = EXCLUDED.duration_seconds,
      completed = EXCLUDED.completed,
      updated_at = CURRENT_TIMESTAMP

    RETURNING *
    `,
    [
      movieId,
      positionSeconds,
      durationSeconds,
      completed
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Get episode progress
// --------------------------------------------------

export async function getEpisodeProgress(episodeId) {
  const result = await query(
    `
    SELECT
      wp.*,
      e.episode_number,
      e.title,
      s.season_number,
      s.anime_id
    FROM watch_progress wp
    JOIN episodes e
      ON e.id = wp.episode_id
    JOIN seasons s
      ON s.id = e.season_id
    WHERE wp.episode_id = $1
    `,
    [episodeId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Get movie progress
// --------------------------------------------------

export async function getMovieProgress(movieId) {
  const result = await query(
    `
    SELECT
      wp.*,
      m.title,
      m.anime_id
    FROM watch_progress wp
    JOIN movies m
      ON m.id = wp.movie_id
    WHERE wp.movie_id = $1
    `,
    [movieId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Continue watching
// --------------------------------------------------

export async function getContinueWatching() {
  const result = await query(
    `
    SELECT
      wp.id,
      wp.episode_id,
      wp.movie_id,
      wp.position_seconds,
      wp.duration_seconds,
      wp.completed,
      wp.updated_at,

      e.episode_number,
      e.title AS episode_title,

      s.season_number,
      s.anime_id,

      a.title_romaji,
      a.title_english,
      a.title_native,
      a.cover_image

    FROM watch_progress wp

    LEFT JOIN episodes e
      ON e.id = wp.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN anime a
      ON a.id = s.anime_id

    WHERE
      wp.completed = false
      AND wp.position_seconds > 0

    ORDER BY wp.updated_at DESC
    `
  );

  return result.rows;
}

// --------------------------------------------------
// Mark episode completed
// --------------------------------------------------

export async function completeEpisode(
  episodeId,
  durationSeconds = 0
) {
  return saveEpisodeProgress({
    episodeId,
    positionSeconds: durationSeconds,
    durationSeconds,
    completed: true
  });
}

// --------------------------------------------------
// Mark movie completed
// --------------------------------------------------

export async function completeMovie(
  movieId,
  durationSeconds = 0
) {
  return saveMovieProgress({
    movieId,
    positionSeconds: durationSeconds,
    durationSeconds,
    completed: true
  });
}
