import {
  checkDatabaseHealth,
  getDatabaseStats
} from "../services/database/database-health.service.js";

// --------------------------------------------------
// Database health
// --------------------------------------------------

export async function getHealth(
  req,
  res,
  next
) {
  try {
    const health =
      await checkDatabaseHealth();

    const status =
      health.healthy
        ? 200
        : 503;

    res.status(status).json({
      success:
        health.healthy,

      database:
        health
    });
  } catch (error) {
    next(error);
  }
}


// --------------------------------------------------
// Database statistics
// --------------------------------------------------

export async function getStats(
  req,
  res,
  next
) {
  try {
    const stats =
      await getDatabaseStats();

    res.json({
      success: true,

      database:
        stats
    });
  } catch (error) {
    next(error);
  }
}
