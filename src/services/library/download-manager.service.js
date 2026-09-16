import { query } from "../../database/database.js";

// --------------------------------------------------
// Create download
// --------------------------------------------------

export async function createDownload(
  data
) {
  const {
    episodeId = null,
    movieId = null,
    storageKey,
    fileName = null,
    mimeType = null,
    quality = null,
    format = null,
    sizeBytes = null,
    status = "ready"
  } = data;

  if (!storageKey) {
    throw new Error(
      "storageKey is required"
    );
  }

  if (
    (episodeId && movieId) ||
    (!episodeId && !movieId)
  ) {
    throw new Error(
      "Download must belong to either an episode or movie"
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
    ON CONFLICT (storage_key)
    DO UPDATE SET
      file_name = EXCLUDED.file_name,
      mime_type = EXCLUDED.mime_type,
      quality = EXCLUDED.quality,
      format = EXCLUDED.format,
      size_bytes = EXCLUDED.size_bytes,
      status = EXCLUDED.status,
      updated_at = CURRENT_TIMESTAMP
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
      status = $1,
      updated_at = CURRENT_TIMESTAMP

    WHERE id = $2

    RETURNING *
    `,
    [
      status,
      downloadId
    ]
  );

  return result.rows[0] || null;
}


// --------------------------------------------------
// Get download
// --------------------------------------------------

export async function getDownload(
  downloadId
) {
  const result = await query(
    `
    SELECT
      d.*,

      e.episode_number,
      e.title AS episode_title,

      s.season_number,

      m.title AS movie_title,

      a.id AS anime_id,
      a.title_romaji,
      a.title_english,
      a.cover_image

    FROM downloads d

    LEFT JOIN episodes e
      ON e.id = d.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN movies m
      ON m.id = d.movie_id

    LEFT JOIN anime a
      ON a.id = COALESCE(
        s.anime_id,
        m.anime_id
      )

    WHERE d.id = $1
    `,
    [downloadId]
  );

  return result.rows[0] || null;
}


// --------------------------------------------------
// Get all downloads
// --------------------------------------------------

export async function getDownloads(
  status = null
) {
  const values = [];
  let where = "";

  if (status) {
    values.push(status);
    where = `WHERE d.status = $1`;
  }

  const result = await query(
    `
    SELECT
      d.*,

      e.episode_number,
      e.title AS episode_title,

      s.season_number,

      m.title AS movie_title,

      a.id AS anime_id,
      a.title_romaji,
      a.title_english,
      a.cover_image

    FROM downloads d

    LEFT JOIN episodes e
      ON e.id = d.episode_id

    LEFT JOIN seasons s
      ON s.id = e.season_id

    LEFT JOIN movies m
      ON m.id = d.movie_id

    LEFT JOIN anime a
      ON a.id = COALESCE(
        s.anime_id,
        m.anime_id
      )

    ${where}

    ORDER BY
      d.updated_at DESC
    `,
    values
  );

  return result.rows;
}


// --------------------------------------------------
// Delete download metadata
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
