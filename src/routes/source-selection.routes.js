import { Router } from "express";

import {
  getEpisodeSource,
  getMovieSource
} from "../controllers/source-selection.controller.js";

const router = Router();

router.get(
  "/episode/:episodeId",
  getEpisodeSource
);

router.get(
  "/movie/:movieId",
  getMovieSource
);

export default router;
