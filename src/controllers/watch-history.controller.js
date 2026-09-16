import {
  getWatchHistory
} from "../services/library/watch-history.service.js";

// --------------------------------------------------
// Watch history
// --------------------------------------------------

export async function getHistory(
  req,
  res,
  next
) {
  try {
    const limit =
      Number(req.query.limit || 50);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Limit must be between 1 and 100"
      });
    }

    const history =
      await getWatchHistory(limit);

    res.json({
      success: true,

      count:
        history.length,

      history
    });
  } catch (error) {
    next(error);
  }
}
