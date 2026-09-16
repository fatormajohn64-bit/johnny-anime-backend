import { Router } from "express";

import {
  getHistory
} from "../controllers/watch-history.controller.js";

const router = Router();

router.get(
  "/",
  getHistory
);

export default router;
