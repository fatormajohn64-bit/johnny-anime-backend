import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import env from "./config/env.js";

import { initializeDatabase } from "./database/schema.js";
import { closeDatabase } from "./database/database.js";

import animeRoutes from "./routes/anime.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import episodesRoutes from "./routes/episodes.routes.js";
import videoSourceRoutes from "./routes/video-source.routes.js";
import watchProgressRoutes from "./routes/watch-progress.routes.js";
import playerRoutes from "./routes/player.routes.js";
import animeSyncRoutes from "./routes/anime-sync.routes.js";
import episodeSyncRoutes from "./routes/episode-sync.routes.js";
import downloadRoutes from "./routes/download.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import libraryDashboardRoutes from "./routes/library-dashboard.routes.js";
import discoveryRoutes from "./routes/discovery.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import animeDetailRoutes from "./routes/anime-detail.routes.js";
import episodeNavigationRoutes from "./routes/episode-navigation.routes.js";
import seasonNavigationRoutes from "./routes/season-navigation.routes.js";
import episodeQueueRoutes from "./routes/episode-queue.routes.js";
import continueWatchingRoutes from "./routes/continue-watching.routes.js";
import watchHistoryRoutes from "./routes/watch-history.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import playerCompletionRoutes from "./routes/player-completion.routes.js";
import sourceSelectionRoutes from "./routes/source-selection.routes.js";
import downloadManagerRoutes from "./routes/download-manager.routes.js";
import databaseHealthRoutes from "./routes/database-health.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";

import {
  notFoundHandler,
  errorHandler
} from "./middleware/error-handler.js";


// --------------------------------------------------
// App
// --------------------------------------------------

const app = express();


// --------------------------------------------------
// Server configuration
// --------------------------------------------------

const PORT = env.port;
const HOST = "0.0.0.0";


// --------------------------------------------------
// Security
// --------------------------------------------------

app.use(
  helmet()
);


// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
  cors({
    origin: env.frontendUrl
  })
);


// --------------------------------------------------
// JSON body parser
// --------------------------------------------------

app.use(
  express.json({
    limit: "10mb"
  })
);


// --------------------------------------------------
// Root route
// --------------------------------------------------

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      name:
        "Johnny Anime Vault Backend",
      message:
        "Backend is running"
    });
  }
);


// --------------------------------------------------
// Health route
// --------------------------------------------------

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      service:
        "johnny-anime-backend",
      status:
        "healthy",
      timestamp:
        new Date().toISOString()
    });
  }
);


// --------------------------------------------------
// Anime
// --------------------------------------------------

app.use(
  "/api/anime",
  animeRoutes
);


// --------------------------------------------------
// Library
// --------------------------------------------------

app.use(
  "/api/library",
  libraryRoutes
);


// --------------------------------------------------
// Seasons and episodes
// --------------------------------------------------

app.use(
  "/api",
  episodesRoutes
);


// --------------------------------------------------
// Video sources
// --------------------------------------------------

app.use(
  "/api/video-sources",
  videoSourceRoutes
);


// --------------------------------------------------
// Watch progress
// --------------------------------------------------

app.use(
  "/api/watch-progress",
  watchProgressRoutes
);


// --------------------------------------------------
// Player
// --------------------------------------------------

app.use(
  "/api/player",
  playerRoutes
);


// --------------------------------------------------
// Anime sync
// --------------------------------------------------

app.use(
  "/api/anime-sync",
  animeSyncRoutes
);


// --------------------------------------------------
// Episode sync
// --------------------------------------------------

app.use(
  "/api/episode-sync",
  episodeSyncRoutes
);


// --------------------------------------------------
// Downloads
// --------------------------------------------------

app.use(
  "/api/downloads",
  downloadRoutes
);


// --------------------------------------------------
// Movies
// --------------------------------------------------

app.use(
  "/api/movies",
  movieRoutes
);


// --------------------------------------------------
// Dashboard
// --------------------------------------------------

app.use(
  "/api/dashboard",
  libraryDashboardRoutes
);


// --------------------------------------------------
// Discovery
// --------------------------------------------------

app.use(
  "/api/discovery",
  discoveryRoutes
);


// --------------------------------------------------
// Favorites
// --------------------------------------------------

app.use(
  "/api/favorites",
  favoritesRoutes
);


// --------------------------------------------------
// Settings
// --------------------------------------------------

app.use(
  "/api/settings",
  settingsRoutes
);


// --------------------------------------------------
// Activity
// --------------------------------------------------

app.use(
  "/api/activity",
  activityRoutes
);


// --------------------------------------------------
// Anime details
// --------------------------------------------------

app.use(
  "/api/anime-details",
  animeDetailRoutes
);


// --------------------------------------------------
// Episode navigation
// --------------------------------------------------

app.use(
  "/api/episode-navigation",
  episodeNavigationRoutes
);


// --------------------------------------------------
// Season navigation
// --------------------------------------------------

app.use(
  "/api/season-navigation",
  seasonNavigationRoutes
);


// --------------------------------------------------
// Episode queue
// --------------------------------------------------

app.use(
  "/api/episode-queue",
  episodeQueueRoutes
);


// --------------------------------------------------
// Continue watching
// --------------------------------------------------

app.use(
  "/api/continue-watching",
  continueWatchingRoutes
);


// --------------------------------------------------
// Watch history
// --------------------------------------------------

app.use(
  "/api/watch-history",
  watchHistoryRoutes
);


// --------------------------------------------------
// Resume
// --------------------------------------------------

app.use(
  "/api/resume",
  resumeRoutes
);


// --------------------------------------------------
// Player completion
// --------------------------------------------------

app.use(
  "/api/player-completion",
  playerCompletionRoutes
);


// --------------------------------------------------
// Source selection
// --------------------------------------------------

app.use(
  "/api/source-selection",
  sourceSelectionRoutes
);


// --------------------------------------------------
// Download manager
// --------------------------------------------------

app.use(
  "/api/download-manager",
  downloadManagerRoutes
);


// --------------------------------------------------
// Database health
// --------------------------------------------------

app.use(
  "/api/database",
  databaseHealthRoutes
);


// --------------------------------------------------
// Maintenance
// --------------------------------------------------

app.use(
  "/api/maintenance",
  maintenanceRoutes
);


// --------------------------------------------------
// 404 handler
// --------------------------------------------------

app.use(
  notFoundHandler
);


// --------------------------------------------------
// Error handler
// --------------------------------------------------

app.use(
  errorHandler
);


// --------------------------------------------------
// Start server
// --------------------------------------------------

async function startServer() {
  try {
    await initializeDatabase();

    const server =
      app.listen(
        PORT,
        HOST,
        () => {
          console.log(
            `Johnny Anime Vault Backend running on ${HOST}:${PORT}`
          );
        }
      );


    // ----------------------------------------------
    // Graceful shutdown
    // ----------------------------------------------

    const shutdown =
      async (signal) => {
        console.log(
          `${signal} received. Shutting down...`
        );

        server.close(
          async () => {
            try {
              await closeDatabase();

              console.log(
                "Database connection closed"
              );

              process.exit(0);

            } catch (error) {
              console.error(
                "Error closing database:",
                error
              );

              process.exit(1);
            }
          }
        );
      };


    process.on(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );

    process.on(
      "SIGINT",
      () => shutdown("SIGINT")
    );

  } catch (error) {
    console.error(
      "Failed to start Johnny Anime Vault Backend:",
      error
    );

    process.exit(1);
  }
}


startServer();

export default app;
