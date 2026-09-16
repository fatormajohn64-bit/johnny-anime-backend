import env from "./env.js";

// --------------------------------------------------
// AniList
// --------------------------------------------------

export const anilistConfig = {
  baseUrl:
    env.anilistApiUrl
};


// --------------------------------------------------
// Database
// --------------------------------------------------

export const databaseConfig = {
  url:
    env.databaseUrl
};


// --------------------------------------------------
// Server
// --------------------------------------------------

export const serverConfig = {
  port:
    env.port,

  frontendUrl:
    env.frontendUrl,

  nodeEnv:
    env.nodeEnv
};


// --------------------------------------------------
// Combined configuration
// --------------------------------------------------

export const apiConfig = {
  anilist:
    anilistConfig,

  database:
    databaseConfig,

  server:
    serverConfig
};


export default apiConfig;
