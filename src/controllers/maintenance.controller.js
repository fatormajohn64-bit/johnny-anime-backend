import {
  getDatabaseSummary,
  runMaintenanceReport
} from "../services/library/maintenance.service.js";

// --------------------------------------------------
// Database summary
// --------------------------------------------------

export async function getSummary(
  req,
  res,
  next
) {
  try {
    const summary =
      await getDatabaseSummary();

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    next(error);
  }
}


// --------------------------------------------------
// Maintenance report
// --------------------------------------------------

export async function getReport(
  req,
  res,
  next
) {
  try {
    const report =
      await runMaintenanceReport();

    res.json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
}
