import { Router } from "express";

import {
  listSettings,
  getOneSetting,
  setOneSetting,
  setSettings,
  resetAllSettings
} from "../controllers/settings.controller.js";

const router = Router();

// --------------------------------------------------
// All settings
// --------------------------------------------------

router.get(
  "/",
  listSettings
);

// --------------------------------------------------
// Update multiple settings
// --------------------------------------------------

router.patch(
  "/",
  setSettings
);

// --------------------------------------------------
// Reset
// --------------------------------------------------

router.post(
  "/reset",
  resetAllSettings
);

// --------------------------------------------------
// Single setting
// --------------------------------------------------

router.get(
  "/:key",
  getOneSetting
);

router.put(
  "/:key",
  setOneSetting
);

export default router;
