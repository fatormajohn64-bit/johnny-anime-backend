import { query } from "../../database/database.js";

// --------------------------------------------------
// Create video source
// --------------------------------------------------

export async function createVideoSource({
  episodeId = null,
  movieId = null,
  sourceType,
  sourceUrl = null,
  quality = null,
  format = null,
  sizeBytes = null
}) {
  if (!episodeId && !movieId) {
    throw new Error(
      "A video source must belong to an episode or movie"
    );
  }

  if (episodeId && movieId) {
    throw new Error(
      "A video source cannot belong to both an episode and movie"
    );
  }

  const result = await query(
    `
    INSERT INTO video_sources (
      episode_id,
      movie_id,
      source_type,
      source_url,
      quality,
      format,
      size_bytes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      episodeId,
      movieId,
      sourceType,
      sourceUrl,
      quality,
      format,
      sizeBytes
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Get episode video sources
// --------------------------------------------------

export async function getEpisodeVideoSources(episodeId) {
  const result = await query(
    `
    SELECT *
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

  return result.rows;
}

// --------------------------------------------------
// Get movie video sources
// --------------------------------------------------

export async function getMovieVideoSources(movieId) {
  const result = await query(
    `
    SELECT *
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

  return result.rows;
}

// --------------------------------------------------
// Get source by ID
// --------------------------------------------------

export async function getVideoSourceById(sourceId) {
  const result = await query(
    `
    SELECT *
    FROM video_sources
    WHERE id = $1
    `,
    [sourceId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Delete source
// --------------------------------------------------

export async function deleteVideoSource(sourceId) {
  const result = await query(
    `
    DELETE FROM video_sources
    WHERE id = $1
    RETURNING *
    `,
    [sourceId]
  );

  return result.rows[0] || null;
}
