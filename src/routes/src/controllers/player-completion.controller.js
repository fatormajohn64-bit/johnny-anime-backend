import {
  completeEpisode
} from "../services/video/player-completion.service.js";


// --------------------------------------------------
// Complete episode
// --------------------------------------------------

export async function complete(
  req,
  res,
  next
) {
  try {
    const episodeId =
      Number(
        req.params.episodeId
      );

    if (
      !Number.isInteger(episodeId) ||
      episodeId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid episode ID"
      });
    }

    const result =
      await completeEpisode(
        episodeId
      );

    res.json({
      success: true,
      result
    });

  } catch (error) {
    next(error);
  }
}
