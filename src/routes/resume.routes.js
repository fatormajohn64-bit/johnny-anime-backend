import { Router } from "express";

import {
  getEpisodeResumeData,
  getMovieResumeData
} from "../controllers/resume.controller.js";

const router = Router();

router.get(
  "/episode/:episodeId",
  getEpisodeResumeData
);

router.get(
  "/movie/:movieId",
  getMovieResumeData
);

export default router;
