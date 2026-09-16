import { Router } from "express";

import {
  getActivityFeed
} from "../controllers/activity.controller.js";

const router = Router();

router.get(
  "/",
  getActivityFeed
);

export default router;
