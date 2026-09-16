import {
  getSeasonNavigation
} from "../services/library/season-navigation.service.js";

// --------------------------------------------------
// Season navigation
// --------------------------------------------------

export async function getNavigation(
  req,
  res,
  next
) {
  try {
    const seasonId =
      Number(req.params.seasonId);

    if (!Number.isInteger(seasonId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid season ID"
      });
    }

    const navigation =
      await getSeasonNavigation(
        seasonId
      );

    if (!navigation) {
      return res.status(404).json({
        success: false,
        error: "Season not found"
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
