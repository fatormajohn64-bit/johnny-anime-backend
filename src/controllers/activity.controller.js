import {
  getActivity as getActivityService
} from "../services/library/activity.service.js";

export async function getActivity(
  req,
  res,
  next
) {
  try {
    const limit =
      Number(
        req.query.limit || 20
      );

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

    const result =
      await getActivityService(
        limit
      );

    return res.json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
}
