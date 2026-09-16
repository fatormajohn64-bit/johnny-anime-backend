import { Router } from "express";

import {
  getContinueWatchingList
} from "../controllers/continue-watching.controller.js";

const router = Router();

router.get(
  "/",
  getContinueWatchingList
);

export default router;
