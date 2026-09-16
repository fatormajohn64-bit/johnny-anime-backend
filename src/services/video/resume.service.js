import { query } from "../../database/database.js";

// --------------------------------------------------
// Get resume information for an episode
// --------------------------------------------------

export async function getEpisodeResume(
  episodeId
) {
  const result = await query(
    `
    SELECT
      e.id,
      e.episode_number,
      e.title,
      e.duration,

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

    LEFT JOIN watch_progress wp
      ON wp.episode_id = e.id

    WHERE e.id = $1
    `,
    [episodeId]
  );

  if (!result.rows.length) {
    return null;
  }

  const episode =
    result.rows[0];

  return buildResumeResult(
    episode
  );
}


// --------------------------------------------------
// Get resume information for a movie
// --------------------------------------------------

export async function getMovieResume(
  movieId
) {
  const result = await query(
    `
    SELECT
      m.id,
      m.title,
      m.duration,

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

    LEFT JOIN watch_progress wp
      ON wp.movie_id = m.id

    WHERE m.id = $1
    `,
    [movieId]
  );

  if (!result.rows.length) {
    return null;
  }

  const movie =
    result.rows[0];

  return buildResumeResult(
    movie
  );
}


// --------------------------------------------------
// Build resume result
// --------------------------------------------------

function buildResumeResult(
  media
) {
  const position =
    Number(
      media.position_seconds || 0
    );

  const duration =
    Number(
      media.duration_seconds ||
      media.duration ||
      0
    );

  const completed =
    Boolean(media.completed);

  const hasProgress =
    position > 0;

  let action = "start";

  let startPosition = 0;

  if (completed) {
    action = "restart";
    startPosition = 0;
  } else if (hasProgress) {
    action = "resume";
    startPosition = position;
  }

  return {
    action,

    startPosition,

    positionSeconds:
      position,

    durationSeconds:
      duration,

    completed,

    hasProgress,

    progressPercent:
      calculateProgress(
        position,
        duration
      )
  };
}


// --------------------------------------------------
// Progress percentage
// --------------------------------------------------

function calculateProgress(
  position,
  duration
) {
  if (
    duration <= 0 ||
    position <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (position / duration) *
        100 *
        100
    ) / 100
  );
}
