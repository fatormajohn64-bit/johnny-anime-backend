import {
  syncEpisodesFromAniList,
  getEpisodesForAnime
} from "../services/library/episode-sync.service.js";

export async function syncEpisodes(
  req,
  res,
  next
) {
  try {
    const anilistId =
      Number(
        req.params.anilistId
      );

    if (
      !Number.isInteger(anilistId) ||
      anilistId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid AniList ID"
      });
    }

    const result =
      await syncEpisodesFromAniList(
        anilistId
      );

    return res.json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
}

export async function getEpisodes(
  req,
  res,
  next
) {
  try {
    const animeId =
      Number(
        req.params.animeId
      );

    if (
      !Number.isInteger(animeId) ||
      animeId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID"
      });
    }

    const result =
      await getEpisodesForAnime(
        animeId
      );

    return res.json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
}
