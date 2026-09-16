import { Router } from "express";

import {
  getDashboard
} from "../controllers/library-dashboard.controller.js";

const router = Router();

router.get(
  "/",
  getDashboard
);

export default router;
