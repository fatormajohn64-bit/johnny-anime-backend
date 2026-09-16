import { Router } from "express";

import {
  getNavigation
} from "../controllers/season-navigation.controller.js";

const router = Router();

router.get(
  "/:seasonId",
  getNavigation
);

export default router;
