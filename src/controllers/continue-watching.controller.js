import {
  getContinueWatching
} from "../services/library/continue-watching.service.js";

// --------------------------------------------------
// Continue watching
// --------------------------------------------------

export async function getContinueWatchingList(
  req,
  res,
  next
) {
  try {
    const limit =
      Number(req.query.limit || 20);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 50
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Limit must be between 1 and 50"
      });
    }

    const items =
      await getContinueWatching(limit);

    res.json({
      success: true,

      count:
        items.length,

      items
    });
  } catch (error) {
    next(error);
  }
}
