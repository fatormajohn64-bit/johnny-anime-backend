import {
  searchDiscovery
} from "../services/library/discovery.service.js";

// --------------------------------------------------
// Search
// --------------------------------------------------

export async function search(
  req,
  res,
  next
) {
  try {
    const searchQuery =
      req.query.q?.trim();

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }

    const results =
      await searchDiscovery(
        searchQuery
      );

    res.json({
      success: true,
      ...results
    });
  } catch (error) {
    next(error);
  }
}
