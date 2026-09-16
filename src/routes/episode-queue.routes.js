import { Router } from "express";

import {
  getQueue
} from "../controllers/episode-queue.controller.js";

const router = Router();

router.get(
  "/:episodeId",
  getQueue
);

export default router;
