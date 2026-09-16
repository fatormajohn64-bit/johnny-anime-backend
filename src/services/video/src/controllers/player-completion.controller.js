import {
  completeEpisodeAndGetNext
} from "../services/video/player-completion.service.js";

// --------------------------------------------------
// Complete episode
// --------------------------------------------------

export async function completeEpisode(
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

    const result =
      await completeEpisodeAndGetNext(
        episodeId
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Episode not found"
      });
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}
