import { Router } from "express";

import {
  syncEpisodes,
  getSyncSummary
} from "../controllers/episode-sync.controller.js";

const router = Router();

// --------------------------------------------------
// Sync episodes from AniList
// --------------------------------------------------

router.post(
  "/anilist/:anilistId",
  syncEpisodes
);

// --------------------------------------------------
// Get local sync summary
// --------------------------------------------------

router.get(
  "/anime/:animeId",
  getSyncSummary
);

export default router;
