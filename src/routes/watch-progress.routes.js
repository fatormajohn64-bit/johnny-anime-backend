import { Router } from "express";

import {
  updateEpisodeProgress,
  updateMovieProgress,
  getEpisodeWatchProgress,
  getMovieWatchProgress,
  continueWatching,
  markEpisodeCompleted,
  markMovieCompleted
} from "../controllers/watch-progress.controller.js";

const router = Router();

// --------------------------------------------------
// Continue watching
// --------------------------------------------------

router.get(
  "/continue",
  continueWatching
);

// --------------------------------------------------
// Episodes
// --------------------------------------------------

router.get(
  "/episode/:episodeId",
  getEpisodeWatchProgress
);

router.put(
  "/episode/:episodeId",
  updateEpisodeProgress
);

router.post(
  "/episode/:episodeId/complete",
  markEpisodeCompleted
);

// --------------------------------------------------
// Movies
// --------------------------------------------------

router.get(
  "/movie/:movieId",
  getMovieWatchProgress
);

router.put(
  "/movie/:movieId",
  updateMovieProgress
);

router.post(
  "/movie/:movieId/complete",
  markMovieCompleted
);

export default router;
