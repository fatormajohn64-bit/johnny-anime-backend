import { Router } from "express";

import {
  getSummary,
  getReport
} from "../controllers/maintenance.controller.js";

const router = Router();

router.get(
  "/summary",
  getSummary
);

router.get(
  "/report",
  getReport
);

export default router;
