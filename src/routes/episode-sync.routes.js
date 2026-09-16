import { Router } from "express";

import {
  syncEpisodesController,
  getEpisodesController
} from "../controllers/episode-sync.controller.js";

const router = Router();

router.post(
  "/anilist/:anilistId",
  syncEpisodesController
);

router.get(
  "/anime/:animeId",
  getEpisodesController
);

export default router;
