import { query } from "../../database/database.js";

// --------------------------------------------------
// Create download record
// --------------------------------------------------

export async function createDownload({
  episodeId = null,
  movieId = null,
  storageKey,
  fileName = null,
  mimeType = null,
  quality = null,
  format = null,
  sizeBytes = null,
  status = "ready"
}) {
  if (!episodeId && !movieId) {
    throw new Error(
      "A download must belong to an episode or movie"
    );
  }

  if (episodeId && movieId) {
    throw new Error(
      "A download cannot belong to both an episode and movie"
    );
  }

  const result = await query(
    `
    INSERT INTO downloads (
      episode_id,
      movie_id,
      storage_key,
      file_name,
      mime_type,
      quality,
      format,
      size_bytes,
      status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9
    )
    RETURNING *
    `,
    [
      episodeId,
      movieId,
      storageKey,
      fileName,
      mimeType,
      quality,
      format,
      sizeBytes,
      status
    ]
  );

  return result.rows[0];
}

// --------------------------------------------------
// Get episode downloads
// --------------------------------------------------

export async function getEpisodeDownloads(
  episodeId
) {
  const result = await query(
    `
    SELECT *
    FROM downloads
    WHERE episode_id = $1
    ORDER BY created_at DESC
    `,
    [episodeId]
  );

  return result.rows;
}

// --------------------------------------------------
// Get movie downloads
// --------------------------------------------------

export async function getMovieDownloads(
  movieId
) {
  const result = await query(
    `
    SELECT *
    FROM downloads
    WHERE movie_id = $1
    ORDER BY created_at DESC
    `,
    [movieId]
  );

  return result.rows;
}

// --------------------------------------------------
// Get all downloads
// --------------------------------------------------

export async function getDownloads() {
  const result = await query(
    `
    SELECT
      d.*,

      e.episode_number,
      e.title AS episode_title,

      s.season_number,
      s.anime_id,

      a.title_romaji,
      a.title_english,
      a.cover_image

    FROM downloads d

    LEFT JOIN episodes e
      ON e.id = d.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN anime a
      ON a.id = s.anime_id

    ORDER BY d.updated_at DESC
    `
  );

  return result.rows;
}

// --------------------------------------------------
// Get download by ID
// --------------------------------------------------

export async function getDownloadById(
  downloadId
) {
  const result = await query(
    `
    SELECT *
    FROM downloads
    WHERE id = $1
    `,
    [downloadId]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Update download status
// --------------------------------------------------

export async function updateDownloadStatus(
  downloadId,
  status
) {
  const result = await query(
    `
    UPDATE downloads
    SET
      status = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    [downloadId, status]
  );

  return result.rows[0] || null;
}

// --------------------------------------------------
// Delete download record
// --------------------------------------------------

export async function deleteDownload(
  downloadId
) {
  const result = await query(
    `
    DELETE FROM downloads
    WHERE id = $1
    RETURNING *
    `,
    [downloadId]
  );

  return result.rows[0] || null;
}
