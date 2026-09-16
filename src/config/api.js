import "dotenv/config";

// --------------------------------------------------
// AniList
// --------------------------------------------------

export const anilistConfig = {
  baseUrl:
    process.env.ANILIST_API_URL ||
    "https://graphql.anilist.co"
};


// --------------------------------------------------
// Database
// --------------------------------------------------

export const databaseConfig = {
  url:
    process.env.DATABASE_URL || null
};


// --------------------------------------------------
// Server
// --------------------------------------------------

export const serverConfig = {
  port:
    Number(process.env.PORT) || 10000,

  frontendUrl:
    process.env.FRONTEND_URL ||
    "http://localhost:5500",

  nodeEnv:
    process.env.NODE_ENV ||
    "development"
};


// --------------------------------------------------
// Combined configuration
// --------------------------------------------------

export const apiConfig = {
  anilist: anilistConfig,
  database: databaseConfig,
  server: serverConfig
};

export default apiConfig;
