import {
  addAnimeFavorite,
  addMovieFavorite,
  removeAnimeFavorite,
  removeMovieFavorite,
  getFavorites,
  isAnimeFavorite,
  isMovieFavorite
} from "../services/library/favorites.service.js";

// --------------------------------------------------
// Add anime favorite
// --------------------------------------------------

export async function favoriteAnime(
  req,
  res,
  next
) {
  try {
    const animeId =
      Number(req.params.animeId);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const favorite =
      await addAnimeFavorite(
        animeId
      );

    res.status(201).json({
      success: true,
      favorite
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Remove anime favorite
// --------------------------------------------------

export async function unfavoriteAnime(
  req,
  res,
  next
) {
  try {
    const animeId =
      Number(req.params.animeId);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const removed =
      await removeAnimeFavorite(
        animeId
      );

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: "Anime is not a favorite"
      });
    }

    res.json({
      success: true,
      message: "Anime removed from favorites"
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Add movie favorite
// --------------------------------------------------

export async function favoriteMovie(
  req,
  res,
  next
) {
  try {
    const movieId =
      Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    const favorite =
      await addMovieFavorite(
        movieId
      );

    res.status(201).json({
      success: true,
      favorite
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Remove movie favorite
// --------------------------------------------------

export async function unfavoriteMovie(
  req,
  res,
  next
) {
  try {
    const movieId =
      Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    const removed =
      await removeMovieFavorite(
        movieId
      );

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: "Movie is not a favorite"
      });
    }

    res.json({
      success: true,
      message: "Movie removed from favorites"
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get favorites
// --------------------------------------------------

export async function listFavorites(
  req,
  res,
  next
) {
  try {
    const favorites =
      await getFavorites();

    res.json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Check anime favorite
// --------------------------------------------------

export async function checkAnimeFavorite(
  req,
  res,
  next
) {
  try {
    const animeId =
      Number(req.params.animeId);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const favorite =
      await isAnimeFavorite(
        animeId
      );

    res.json({
      success: true,
      favorite
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Check movie favorite
// --------------------------------------------------

export async function checkMovieFavorite(
  req,
  res,
  next
) {
  try {
    const movieId =
      Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID"
      });
    }

    const favorite =
      await isMovieFavorite(
        movieId
      );

    res.json({
      success: true,
      favorite
    });
  } catch (error) {
    next(error);
  }
}
