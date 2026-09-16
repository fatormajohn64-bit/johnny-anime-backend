import { Router } from "express";

import {
  getDetails
} from "../controllers/anime-detail.controller.js";

const router = Router();

router.get(
  "/:animeId",
  getDetails
);

export default router;
