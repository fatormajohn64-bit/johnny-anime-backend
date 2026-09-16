import {
  getAnimeDetails
} from "../services/library/anime-detail.service.js";

// --------------------------------------------------
// Anime details
// --------------------------------------------------

export async function getDetails(
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

    const details =
      await getAnimeDetails(
        animeId
      );

    if (!details) {
      return res.status(404).json({
        success: false,
        error: "Anime not found"
      });
    }

    res.json({
      success: true,
      ...details
    });
  } catch (error) {
    next(error);
  }
}
