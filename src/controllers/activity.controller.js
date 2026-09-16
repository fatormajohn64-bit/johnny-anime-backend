import {
  getActivity
} from "../services/library/activity.service.js";

// --------------------------------------------------
// Activity
// --------------------------------------------------

export async function getActivityFeed(
  req,
  res,
  next
) {
  try {
    const limit =
      Number(req.query.limit || 20);

    const activity =
      await getActivity(limit);

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
}
