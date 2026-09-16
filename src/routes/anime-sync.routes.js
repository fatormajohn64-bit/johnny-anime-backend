import { Router } from "express";

import {
  syncAnime,
  syncToLibrary,
  getSynced
} from "../controllers/anime-sync.controller.js";

const router = Router();

// --------------------------------------------------
// Synchronize anime metadata
// --------------------------------------------------

router.post(
  "/:anilistId",
  syncAnime
);

// --------------------------------------------------
// Synchronize and add to library
// --------------------------------------------------

router.post(
  "/:anilistId/library",
  syncToLibrary
);

// --------------------------------------------------
// Get synchronized anime
// --------------------------------------------------

router.get(
  "/:anilistId",
  getSynced
);

export default router;
