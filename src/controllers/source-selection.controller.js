import {
  getEpisodeSelectedSource,
  getMovieSelectedSource
} from "../services/video/source-selection.service.js";

// --------------------------------------------------
// Episode source
// --------------------------------------------------

export async function getEpisodeSource(
  req,
  res,
  next
) {
  try {
    const episodeId =
      Number(req.params.episodeId);

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    const quality =
      req.query.quality?.trim() ||
      null;

    const result =
      await getEpisodeSelectedSource(
        episodeId,
        quality
      );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}


// --------------------------------------------------
// Movie source
// --------------------------------------------------

export async function getMovieSource(
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

    const quality =
      req.query.quality?.trim() ||
      null;

    const result =
      await getMovieSelectedSource(
        movieId,
        quality
      );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}
