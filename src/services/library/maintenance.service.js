import { query } from "../../database/database.js";

// --------------------------------------------------
// Get database summary
// --------------------------------------------------

export async function getDatabaseSummary() {
  const result = await query(`
    SELECT
      (SELECT COUNT(*) FROM anime) AS anime_count,
      (SELECT COUNT(*) FROM seasons) AS season_count,
      (SELECT COUNT(*) FROM episodes) AS episode_count,
      (SELECT COUNT(*) FROM movies) AS movie_count,
      (SELECT COUNT(*) FROM video_sources) AS video_source_count,
      (SELECT COUNT(*) FROM watch_progress) AS watch_progress_count,
      (SELECT COUNT(*) FROM library) AS library_count,
      (SELECT COUNT(*) FROM favorites) AS favorite_count,
      (SELECT COUNT(*) FROM downloads) AS download_count
  `);

  const row = result.rows[0];

  return {
    anime: Number(row.anime_count),
    seasons: Number(row.season_count),
    episodes: Number(row.episode_count),
    movies: Number(row.movie_count),
    videoSources: Number(row.video_source_count),
    watchProgress: Number(row.watch_progress_count),
    library: Number(row.library_count),
    favorites: Number(row.favorite_count),
    downloads: Number(row.download_count)
  };
}


// --------------------------------------------------
// Find orphaned video sources
// --------------------------------------------------

export async function findOrphanedVideoSources() {
  const result = await query(`
    SELECT
      vs.*

    FROM video_sources vs

    LEFT JOIN episodes e
      ON e.id = vs.episode_id

    LEFT JOIN movies m
      ON m.id = vs.movie_id

    WHERE
      (
        vs.episode_id IS NOT NULL
        AND e.id IS NULL
      )
      OR
      (
        vs.movie_id IS NOT NULL
        AND m.id IS NULL
      )

    ORDER BY
      vs.id ASC
  `);

  return result.rows;
}


// --------------------------------------------------
// Find orphaned downloads
// --------------------------------------------------

export async function findOrphanedDownloads() {
  const result = await query(`
    SELECT
      d.*

    FROM downloads d

    LEFT JOIN episodes e
      ON e.id = d.episode_id

    LEFT JOIN movies m
      ON m.id = d.movie_id

    WHERE
      (
        d.episode_id IS NOT NULL
        AND e.id IS NULL
      )
      OR
      (
        d.movie_id IS NOT NULL
        AND m.id IS NULL
      )

    ORDER BY
      d.id ASC
  `);

  return result.rows;
}


// --------------------------------------------------
// Find invalid library records
// --------------------------------------------------

export async function findInvalidLibraryRecords() {
  const result = await query(`
    SELECT
      l.*

    FROM library l

    LEFT JOIN anime a
      ON a.id = l.anime_id

    LEFT JOIN movies m
      ON m.id = l.movie_id

    WHERE
      (
        l.anime_id IS NOT NULL
        AND a.id IS NULL
      )
      OR
      (
        l.movie_id IS NOT NULL
        AND m.id IS NULL
      )

    ORDER BY
      l.id ASC
  `);

  return result.rows;
}


// --------------------------------------------------
// Run maintenance report
// --------------------------------------------------

export async function runMaintenanceReport() {
  const [
    summary,
    orphanedVideoSources,
    orphanedDownloads,
    invalidLibraryRecords
  ] = await Promise.all([
    getDatabaseSummary(),
    findOrphanedVideoSources(),
    findOrphanedDownloads(),
    findInvalidLibraryRecords()
  ]);

  return {
    summary,

    issues: {
      orphanedVideoSources,
      orphanedDownloads,
      invalidLibraryRecords
    },

    issueCount:
      orphanedVideoSources.length +
      orphanedDownloads.length +
      invalidLibraryRecords.length
  };
}
