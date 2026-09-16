import { Router } from "express";

import {
  getNavigation
} from "../controllers/episode-navigation.controller.js";

const router = Router();

router.get(
  "/:episodeId",
  getNavigation
);

export default router;
