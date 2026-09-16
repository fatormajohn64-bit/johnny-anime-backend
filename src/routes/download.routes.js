import { Router } from "express";

import {
  addDownload,
  listDownloads,
  listEpisodeDownloads,
  listMovieDownloads,
  getDownload,
  changeDownloadStatus,
  removeDownload
} from "../controllers/download.controller.js";

const router = Router();

// --------------------------------------------------
// All downloads
// --------------------------------------------------

router.get(
  "/",
  listDownloads
);

router.post(
  "/",
  addDownload
);

// --------------------------------------------------
// Episode downloads
// --------------------------------------------------

router.get(
  "/episode/:episodeId",
  listEpisodeDownloads
);

// --------------------------------------------------
// Movie downloads
// --------------------------------------------------

router.get(
  "/movie/:movieId",
  listMovieDownloads
);

// --------------------------------------------------
// Individual download
// --------------------------------------------------

router.get(
  "/:downloadId",
  getDownload
);

router.patch(
  "/:downloadId/status",
  changeDownloadStatus
);

router.delete(
  "/:downloadId",
  removeDownload
);

export default router;
