import { Router } from "express";

import {
  addMovie,
  getMovie,
  listAnimeMovies,
  editMovie,
  removeMovie
} from "../controllers/movie.controller.js";

const router = Router();

// --------------------------------------------------
// Create movie
// --------------------------------------------------

router.post(
  "/",
  addMovie
);

// --------------------------------------------------
// Movies belonging to anime
// --------------------------------------------------

router.get(
  "/anime/:animeId",
  listAnimeMovies
);

// --------------------------------------------------
// Individual movie
// --------------------------------------------------

router.get(
  "/:movieId",
  getMovie
);

router.patch(
  "/:movieId",
  editMovie
);

router.delete(
  "/:movieId",
  removeMovie
);

export default router;
