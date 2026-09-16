import {
  getEpisodeResume,
  getMovieResume
} from "../services/video/resume.service.js";

// --------------------------------------------------
// Episode resume
// --------------------------------------------------

export async function getEpisodeResumeData(
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

    const resume =
      await getEpisodeResume(
        episodeId
      );

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Episode not found"
      });
    }

    res.json({
      success: true,
      resume
    });
  } catch (error) {
    next(error);
  }
}


// --------------------------------------------------
// Movie resume
// --------------------------------------------------

export async function getMovieResumeData(
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

    const resume =
      await getMovieResume(
        movieId
      );

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Movie not found"
      });
    }

    res.json({
      success: true,
      resume
    });
  } catch (error) {
    next(error);
  }
}
