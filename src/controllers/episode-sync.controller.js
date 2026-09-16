import {
  syncEpisodesFromAniList,
  getEpisodeSyncSummary
} from "../services/library/episode-sync.service.js";

// --------------------------------------------------
// Synchronize episodes
// --------------------------------------------------

export async function syncEpisodes(
  req,
  res,
  next
) {
  try {
    const anilistId =
      Number(req.params.anilistId);

    if (!Number.isInteger(anilistId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid AniList ID"
      });
    }

    const result =
      await syncEpisodesFromAniList(
        anilistId
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Anime not found on AniList"
      });
    }

    res.json({
      success: true,
      message:
        "Episode structure synchronized",
      anime: result.anime,
      season: result.season,
      count: result.episodes.length,
      episodes: result.episodes
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Synchronization summary
// --------------------------------------------------

export async function getSyncSummary(
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

    const result =
      await getEpisodeSyncSummary(
        animeId
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Anime not found"
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
