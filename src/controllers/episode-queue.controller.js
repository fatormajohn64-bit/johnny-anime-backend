import {
  getEpisodeQueue
} from "../services/video/episode-queue.service.js";

// --------------------------------------------------
// Get episode queue
// --------------------------------------------------

export async function getQueue(
  req,
  res,
  next
) {
  try {
    const episodeId =
      Number(req.params.episodeId);

    const limit =
      Number(req.query.limit || 5);

    if (!Number.isInteger(episodeId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid episode ID"
      });
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 20
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Limit must be between 1 and 20"
      });
    }

    const queue =
      await getEpisodeQueue(
        episodeId,
        limit
      );

    if (!queue) {
      return res.status(404).json({
        success: false,
        error: "Episode not found"
      });
    }

    res.json({
      success: true,
      queue
    });
  } catch (error) {
    next(error);
  }
}
