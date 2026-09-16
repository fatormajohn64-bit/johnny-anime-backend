import {
  saveEpisodeProgress,
  saveMovieProgress,
  getEpisodeProgress,
  getMovieProgress,
  getContinueWatching,
  completeEpisode,
  completeMovie
} from "../services/library/watch-progress.service.js";

// --------------------------------------------------
// Save episode progress
// --------------------------------------------------

export async function updateEpisodeProgress(
  req,
  res,
  next
) {
  try {
    const episodeId = Number(
      req.params.episodeId
    );

    const {
      positionSeconds,
      durationSeconds,
      completed
    } = req.body;

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    if (
      typeof positionSeconds !== "number" ||
      typeof durationSeconds !== "number"
    ) {
      return res.status(400).json({
        success: false,
        error:
          "positionSeconds and durationSeconds must be numbers"
      });
    }

    const progress =
      await saveEpisodeProgress({
        episodeId,
        positionSeconds,
        durationSeconds,
        completed: completed === true
      });

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Save movie progress
// --------------------------------------------------

export async function updateMovieProgress(
  req,
  res,
  next
) {
  try {
    const movieId = Number(
      req.params.movieId
    );

    const {
      positionSeconds,
      durationSeconds,
      completed
    } = req.body;

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    if (
      typeof positionSeconds !== "number" ||
      typeof durationSeconds !== "number"
    ) {
      return res.status(400).json({
        success: false,
        error:
          "positionSeconds and durationSeconds must be numbers"
      });
    }

    const progress =
      await saveMovieProgress({
        movieId,
        positionSeconds,
        durationSeconds,
        completed: completed === true
      });

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get episode progress
// --------------------------------------------------

export async function getEpisodeWatchProgress(
  req,
  res,
  next
) {
  try {
    const episodeId = Number(
      req.params.episodeId
    );

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    const progress =
      await getEpisodeProgress(episodeId);

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get movie progress
// --------------------------------------------------

export async function getMovieWatchProgress(
  req,
  res,
  next
) {
  try {
    const movieId = Number(
      req.params.movieId
    );

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    const progress =
      await getMovieProgress(movieId);

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Continue watching
// --------------------------------------------------

export async function continueWatching(
  req,
  res,
  next
) {
  try {
    const items =
      await getContinueWatching();

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Complete episode
// --------------------------------------------------

export async function markEpisodeCompleted(
  req,
  res,
  next
) {
  try {
    const episodeId = Number(
      req.params.episodeId
    );

    const durationSeconds =
      Number(req.body.durationSeconds || 0);

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    const progress =
      await completeEpisode(
        episodeId,
        durationSeconds
      );

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Complete movie
// --------------------------------------------------

export async function markMovieCompleted(
  req,
  res,
  next
) {
  try {
    const movieId = Number(
      req.params.movieId
    );

    const durationSeconds =
      Number(req.body.durationSeconds || 0);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    const progress =
      await completeMovie(
        movieId,
        durationSeconds
      );

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
}
