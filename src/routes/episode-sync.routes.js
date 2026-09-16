import { Router } from "express";

import {
  syncEpisodes,
  getEpisodes
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
// Get synced episodes for an anime
// --------------------------------------------------

router.get(
  "/anime/:animeId",
  getEpisodes
);


export default router;
