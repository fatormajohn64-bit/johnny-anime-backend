import {
  getEpisodeNavigation
} from "../services/library/episode-navigation.service.js";

// --------------------------------------------------
// Episode navigation
// --------------------------------------------------

export async function getNavigation(
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

    const navigation =
      await getEpisodeNavigation(
        episodeId
      );

    if (!navigation) {
      return res.status(404).json({
        success: false,
        error: "Episode not found"
      });
    }

    res.json({
      success: true,
      navigation
    });
  } catch (error) {
    next(error);
  }
}
