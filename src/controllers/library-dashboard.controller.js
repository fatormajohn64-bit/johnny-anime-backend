import {
  getLibraryDashboard
} from "../services/library/library-dashboard.service.js";

// --------------------------------------------------
// Get dashboard
// --------------------------------------------------

export async function getDashboard(
  req,
  res,
  next
) {
  try {
    const dashboard =
      await getLibraryDashboard();

    res.json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(error);
  }
}
