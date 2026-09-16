import {
  createMovie,
  getMovieById,
  getMoviesByAnime,
  updateMovie,
  deleteMovie
} from "../services/library/movie.service.js";

// --------------------------------------------------
// Create
// --------------------------------------------------

export async function addMovie(
  req,
  res,
  next
) {
  try {
    const {
      animeId,
      title,
      description,
      releaseYear,
      duration,
      poster
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Movie title is required"
      });
    }

    const movie =
      await createMovie({
        animeId,
        title,
        description,
        releaseYear,
        duration,
        poster
      });

    res.status(201).json({
      success: true,
      movie
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get movie
// --------------------------------------------------

export async function getMovie(
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

    const movie =
      await getMovieById(
        movieId
      );

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found"
      });
    }

    res.json({
      success: true,
      movie
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get movies for anime
// --------------------------------------------------

export async function listAnimeMovies(
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

    const movies =
      await getMoviesByAnime(
        animeId
      );

    res.json({
      success: true,
      count: movies.length,
      movies
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Update
// --------------------------------------------------

export async function editMovie(
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

    const movie =
      await updateMovie(
        movieId,
        req.body
      );

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found"
      });
    }

    res.json({
      success: true,
      movie
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Delete
// --------------------------------------------------

export async function removeMovie(
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

    const movie =
      await deleteMovie(
        movieId
      );

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found"
      });
    }

    res.json({
      success: true,
      message: "Movie deleted"
    });
  } catch (error) {
    next(error);
  }
}
