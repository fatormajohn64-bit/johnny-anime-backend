import { Router } from "express";

import {
  completeEpisode
} from "../controllers/player-completion.controller.js";

const router = Router();

router.post(
  "/episode/:episodeId/complete",
  completeEpisode
);

export default router;
