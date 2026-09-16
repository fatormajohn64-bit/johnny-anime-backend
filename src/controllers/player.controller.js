import {
  getEpisodePlayerData,
  getMoviePlayerData
} from "../services/video/player.service.js";

// --------------------------------------------------
// Episode player
// --------------------------------------------------

export async function getEpisodePlayer(
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

    const player =
      await getEpisodePlayerData(
        episodeId
      );

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Episode not found"
      });
    }

    res.json({
      success: true,
      player
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Movie player
// --------------------------------------------------

export async function getMoviePlayer(
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

    const player =
      await getMoviePlayerData(
        movieId
      );

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Movie not found"
      });
    }

    res.json({
      success: true,
      player
    });
  } catch (error) {
    next(error);
  }
}
