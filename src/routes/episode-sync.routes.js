import { Router } from "express";

import {
  syncEpisodes,
  getEpisodes
} from "../controllers/episode-sync.controller.js";

const router = Router();

router.post(
  "/anilist/:anilistId",
  syncEpisodes
);

router.get(
  "/anime/:animeId",
  getEpisodes
);

export default router;
