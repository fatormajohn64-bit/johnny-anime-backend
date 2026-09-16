import "dotenv/config";

// --------------------------------------------------
// Environment
// --------------------------------------------------

const nodeEnv =
  process.env.NODE_ENV ||
  "development";


// --------------------------------------------------
// Server
// --------------------------------------------------

const port =
  Number(process.env.PORT) || 10000;

const frontendUrl =
  process.env.FRONTEND_URL ||
  "http://localhost:5500";


// --------------------------------------------------
// AniList
// --------------------------------------------------

const anilistApiUrl =
  process.env.ANILIST_API_URL ||
  "https://graphql.anilist.co";


// --------------------------------------------------
// Database
// --------------------------------------------------

const databaseUrl =
  process.env.DATABASE_URL ||
  null;


// --------------------------------------------------
// Environment object
// --------------------------------------------------

export const env = {
  nodeEnv,

  port,

  frontendUrl,

  anilistApiUrl,

  databaseUrl
};


// --------------------------------------------------
// Environment helpers
// --------------------------------------------------

export function isProduction() {
  return env.nodeEnv === "production";
}

export function isDevelopment() {
  return env.nodeEnv === "development";
}

export function hasDatabase() {
  return Boolean(
    env.databaseUrl
  );
}


export default env;
