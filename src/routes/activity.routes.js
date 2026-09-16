import { Router } from "express";

import {
  getActivity
} from "../controllers/activity.controller.js";

const router = Router();


// --------------------------------------------------
// Get activity
// --------------------------------------------------

router.get(
  "/",
  getActivity
);


export default router;
