import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "DATABASE_URL is not configured. Database features will be unavailable."
  );
}

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              rejectUnauthorized: false
            }
          : false
    })
  : null;

export async function query(text, params = []) {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }

  return pool.query(text, params);
}

export async function getClient() {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }

  return pool.connect();
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
  }
}

export default pool;
