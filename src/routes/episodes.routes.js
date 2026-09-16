import { Router } from "express";

import {
  addSeason,
  listSeasons,
  addEpisode,
  listEpisodes,
  getEpisode
} from "../controllers/episodes.controller.js";

const router = Router();

// --------------------------------------------------
// Seasons
// --------------------------------------------------

router.get(
  "/anime/:animeId/seasons",
  listSeasons
);

router.post(
  "/anime/:animeId/seasons",
  addSeason
);

// --------------------------------------------------
// Episodes
// --------------------------------------------------

router.get(
  "/season/:seasonId/episodes",
  listEpisodes
);

router.post(
  "/season/:seasonId/episodes",
  addEpisode
);

router.get(
  "/episode/:episodeId",
  getEpisode
);

export default router;
