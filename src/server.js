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


const app = express();


// --------------------------------------------------
// Server configuration
// --------------------------------------------------

const PORT = env.port;

const HOST = "0.0.0.0";

const FRONTEND_URL =
  env.frontendUrl;


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
    origin: FRONTEND_URL
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
// Root
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
// Health
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
// API routes
// --------------------------------------------------

app.use(
  "/api/anime",
  animeRoutes
);

app.use(
  "/api/library",
  libraryRoutes
);

app.use(
  "/api",
  episodesRoutes
);

app.use(
  "/api/video-sources",
  videoSourceRoutes
);

app.use(
  "/api/watch-progress",
  watchProgressRoutes
);

app.use(
  "/api/player",
  playerRoutes
);

app.use(
  "/api/anime-sync",
  animeSyncRoutes
);

app.use(
  "/api/episode-sync",
  episodeSyncRoutes
);

app.use(
  "/api/downloads",
  downloadRoutes
);

app.use(
  "/api/movies",
  movieRoutes
);

app.use(
  "/api/dashboard",
  libraryDashboardRoutes
);

app.use(
  "/api/discovery",
  discoveryRoutes
);

app.use(
  "/api/favorites",
  favoritesRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/activity",
  activityRoutes
);

app.use(
  "/api/anime-details",
  animeDetailRoutes
);

app.use(
  "/api/episode-navigation",
  episodeNavigationRoutes
);

app.use(
  "/api/season-navigation",
  seasonNavigationRoutes
);

app.use(
  "/api/episode-queue",
  episodeQueueRoutes
);

app.use(
  "/api/continue-watching",
  continueWatchingRoutes
);

app.use(
  "/api/watch-history",
  watchHistoryRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/player-completion",
  playerCompletionRoutes
);

app.use(
  "/api/source-selection",
  sourceSelectionRoutes
);

app.use(
  "/api/download-manager",
  downloadManagerRoutes
);

app.use(
  "/api/database",
  databaseHealthRoutes
);

app.use(
  "/api/maintenance",
  maintenanceRoutes
);


// --------------------------------------------------
// 404
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

That's the Render-ready "server.js". The important change is:

const HOST = "0.0.0.0";

and:

app.listen(PORT, HOST, ...)

Now save the file and push it to GitHub. Don't deploy manually yet—we'll set up the Render PostgreSQL database and environment variables first.
