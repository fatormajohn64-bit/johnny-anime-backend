import pool from "../../database/database.js";

// --------------------------------------------------
// Check database health
// --------------------------------------------------

export async function checkDatabaseHealth() {
  if (!pool) {
    return {
      healthy: false,
      configured: false,
      message:
        "DATABASE_URL is not configured"
    };
  }

  const startedAt =
    Date.now();

  try {
    const result =
      await pool.query(
        "SELECT NOW() AS current_time"
      );

    const responseTime =
      Date.now() - startedAt;

    return {
      healthy: true,
      configured: true,

      responseTimeMs:
        responseTime,

      databaseTime:
        result.rows[0].current_time
    };
  } catch (error) {
    return {
      healthy: false,
      configured: true,

      responseTimeMs:
        Date.now() - startedAt,

      message:
        error.message
    };
  }
}


// --------------------------------------------------
// Get database statistics
// --------------------------------------------------

export async function getDatabaseStats() {
  if (!pool) {
    return {
      configured: false
    };
  }

  const result =
    await pool.query(`
      SELECT
        COUNT(*) FILTER (
          WHERE table_type = 'BASE TABLE'
        ) AS table_count

      FROM information_schema.tables

      WHERE table_schema = 'public'
    `);

  return {
    configured: true,

    tableCount:
      Number(
        result.rows[0].table_count
      )
  };
}
