import {
  createVideoSource,
  getEpisodeVideoSources,
  getMovieVideoSources,
  getVideoSourceById,
  deleteVideoSource
} from "../services/video/video-source.service.js";

// --------------------------------------------------
// Create
// --------------------------------------------------

export async function addVideoSource(req, res, next) {
  try {
    const {
      episodeId,
      movieId,
      sourceType,
      sourceUrl,
      quality,
      format,
      sizeBytes
    } = req.body;

    if (!sourceType) {
      return res.status(400).json({
        success: false,
        error: "sourceType is required"
      });
    }

    const source = await createVideoSource({
      episodeId,
      movieId,
      sourceType,
      sourceUrl,
      quality,
      format,
      sizeBytes
    });

    res.status(201).json({
      success: true,
      source
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Episode sources
// --------------------------------------------------

export async function getEpisodeSources(req, res, next) {
  try {
    const episodeId = Number(req.params.episodeId);

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    const sources =
      await getEpisodeVideoSources(episodeId);

    res.json({
      success: true,
      count: sources.length,
      sources
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Movie sources
// --------------------------------------------------

export async function getMovieSources(req, res, next) {
  try {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    const sources =
      await getMovieVideoSources(movieId);

    res.json({
      success: true,
      count: sources.length,
      sources
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get source
// --------------------------------------------------

export async function getSource(req, res, next) {
  try {
    const sourceId = Number(req.params.sourceId);

    if (!Number.isInteger(sourceId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid source ID"
      });
    }

    const source =
      await getVideoSourceById(sourceId);

    if (!source) {
      return res.status(404).json({
        success: false,
        error: "Video source not found"
      });
    }

    res.json({
      success: true,
      source
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Delete
// --------------------------------------------------

export async function removeSource(req, res, next) {
  try {
    const sourceId = Number(req.params.sourceId);

    if (!Number.isInteger(sourceId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid source ID"
      });
    }

    const source =
      await deleteVideoSource(sourceId);

    if (!source) {
      return res.status(404).json({
        success: false,
        error: "Video source not found"
      });
    }

    res.json({
      success: true,
      message: "Video source deleted"
    });
  } catch (error) {
    next(error);
  }
}
