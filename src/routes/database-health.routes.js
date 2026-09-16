import { Router } from "express";

import {
  getHealth,
  getStats
} from "../controllers/database-health.controller.js";

const router = Router();

router.get(
  "/",
  getHealth
);

router.get(
  "/stats",
  getStats
);

export default router;
