import { Router } from "express";

import {
  getEpisodePlayer,
  getMoviePlayer
} from "../controllers/player.controller.js";

const router = Router();

// --------------------------------------------------
// Episode player
// --------------------------------------------------

router.get(
  "/episode/:episodeId",
  getEpisodePlayer
);

// --------------------------------------------------
// Movie player
// --------------------------------------------------

router.get(
  "/movie/:movieId",
  getMoviePlayer
);

export default router;
