import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  updateStatus,
  remove
} from "../controllers/download-manager.controller.js";

const router = Router();

router.get(
  "/",
  getAll
);

router.post(
  "/",
  create
);

router.get(
  "/:downloadId",
  getOne
);

router.patch(
  "/:downloadId/status",
  updateStatus
);

router.delete(
  "/:downloadId",
  remove
);

export default router;
