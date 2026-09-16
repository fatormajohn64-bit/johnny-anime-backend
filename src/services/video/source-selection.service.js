import { query } from "../../database/database.js";

// --------------------------------------------------
// Quality ranking
// --------------------------------------------------

const QUALITY_RANK = {
  "2160p": 4,
  "1440p": 3,
  "1080p": 2,
  "720p": 1,
  "480p": 0
};


// --------------------------------------------------
// Get episode sources
// --------------------------------------------------

export async function getEpisodeSources(
  episodeId
) {
  const result = await query(
    `
    SELECT
      vs.id,
      vs.source_type,
      vs.source_url,
      vs.quality,
      vs.format,
      vs.size_bytes,
      vs.created_at

    FROM video_sources vs

    WHERE vs.episode_id = $1

    ORDER BY
      vs.created_at ASC
    `,
    [episodeId]
  );

  return result.rows;
}


// --------------------------------------------------
// Get movie sources
// --------------------------------------------------

export async function getMovieSources(
  movieId
) {
  const result = await query(
    `
    SELECT
      vs.id,
      vs.source_type,
      vs.source_url,
      vs.quality,
      vs.format,
      vs.size_bytes,
      vs.created_at

    FROM video_sources vs

    WHERE vs.movie_id = $1

    ORDER BY
      vs.created_at ASC
    `,
    [movieId]
  );

  return result.rows;
}


// --------------------------------------------------
// Select source
// --------------------------------------------------

export function selectBestSource(
  sources,
  requestedQuality = null
) {
  if (!sources.length) {
    return null;
  }

  if (requestedQuality) {
    const exactMatch =
      sources.find(
        (source) =>
          source.quality ===
          requestedQuality
      );

    if (exactMatch) {
      return exactMatch;
    }
  }

  return [...sources].sort(
    (a, b) =>
      getQualityRank(
        b.quality
      ) -
      getQualityRank(
        a.quality
      )
  )[0];
}


// --------------------------------------------------
// Episode player source
// --------------------------------------------------

export async function getEpisodeSelectedSource(
  episodeId,
  requestedQuality = null
) {
  const sources =
    await getEpisodeSources(
      episodeId
    );

  return {
    requestedQuality,

    available:
      sources,

    selected:
      selectBestSource(
        sources,
        requestedQuality
      )
  };
}


// --------------------------------------------------
// Movie player source
// --------------------------------------------------

export async function getMovieSelectedSource(
  movieId,
  requestedQuality = null
) {
  const sources =
    await getMovieSources(
      movieId
    );

  return {
    requestedQuality,

    available:
      sources,

    selected:
      selectBestSource(
        sources,
        requestedQuality
      )
  };
}


// --------------------------------------------------
// Quality ranking helper
// --------------------------------------------------

function getQualityRank(
  quality
) {
  return (
    QUALITY_RANK[
      String(quality || "")
        .toLowerCase()
    ] ?? -1
  );
}
