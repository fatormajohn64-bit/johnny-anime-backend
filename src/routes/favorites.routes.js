import { Router } from "express";

import {
  favoriteAnime,
  unfavoriteAnime,
  favoriteMovie,
  unfavoriteMovie,
  listFavorites,
  checkAnimeFavorite,
  checkMovieFavorite
} from "../controllers/favorites.controller.js";

const router = Router();

// --------------------------------------------------
// All favorites
// --------------------------------------------------

router.get(
  "/",
  listFavorites
);

// --------------------------------------------------
// Anime favorites
// --------------------------------------------------

router.post(
  "/anime/:animeId",
  favoriteAnime
);

router.delete(
  "/anime/:animeId",
  unfavoriteAnime
);

router.get(
  "/anime/:animeId/check",
  checkAnimeFavorite
);

// --------------------------------------------------
// Movie favorites
// --------------------------------------------------

router.post(
  "/movie/:movieId",
  favoriteMovie
);

router.delete(
  "/movie/:movieId",
  unfavoriteMovie
);

router.get(
  "/movie/:movieId/check",
  checkMovieFavorite
);

export default router;
