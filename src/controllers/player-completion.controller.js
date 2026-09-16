import {
  completeEpisode as completeEpisodeService
} from "../services/video/player-completion.service.js";

export async function completeEpisode(
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
        error: "Invalid episode ID"
      });
    }

    const result =
      await completeEpisodeService(
        episodeId
      );

    return res.json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
}
