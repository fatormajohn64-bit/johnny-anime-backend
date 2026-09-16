import {
  syncAnimeFromAniList,
  syncAndAddToLibrary,
  getSyncedAnime
} from "../services/library/anime-sync.service.js";

// --------------------------------------------------
// Sync anime
// --------------------------------------------------

export async function syncAnime(
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

    const anime =
      await syncAnimeFromAniList(
        anilistId
      );

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: "Anime not found on AniList"
      });
    }

    res.json({
      success: true,
      message: "Anime synchronized",
      anime
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Sync and add to library
// --------------------------------------------------

export async function syncToLibrary(
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

    const anime =
      await syncAndAddToLibrary(
        anilistId
      );

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: "Anime not found on AniList"
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Anime synchronized and added to library",
      anime
    });
  } catch (error) {
    next(error);
  }
}

// --------------------------------------------------
// Get synced anime
// --------------------------------------------------

export async function getSynced(
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

    const anime =
      await getSyncedAnime(
        anilistId
      );

    if (!anime) {
      return res.status(404).json({
        success: false,
        error:
          "Anime has not been synchronized yet"
      });
    }

    res.json({
      success: true,
      anime
    });
  } catch (error) {
    next(error);
  }
}
