import { Router } from "express";

import {
  addVideoSource,
  getEpisodeSources,
  getMovieSources,
  getSource,
  removeSource
} from "../controllers/video-source.controller.js";

const router = Router();

// --------------------------------------------------
// Video sources
// --------------------------------------------------

router.post(
  "/",
  addVideoSource
);

router.get(
  "/episode/:episodeId",
  getEpisodeSources
);

router.get(
  "/movie/:movieId",
  getMovieSources
);

router.get(
  "/:sourceId",
  getSource
);

router.delete(
  "/:sourceId",
  removeSource
);

export default router;
