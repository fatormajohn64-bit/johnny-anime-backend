import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import animeRoutes from "./routes/anime.routes.js";
import { initializeDatabase } from "./database/schema.js";

const app = express();

const PORT = process.env.PORT || 10000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5500";

// --------------------------------------------------
// Security
// --------------------------------------------------

app.use(helmet());

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
  cors({
    origin: FRONTEND_URL
  })
);

// --------------------------------------------------
// Body parser
// --------------------------------------------------

app.use(
  express.json({
    limit: "10mb"
  })
);

// --------------------------------------------------
// Root
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "Johnny Anime Vault Backend",
    message: "Backend is running"
  });
});

// --------------------------------------------------
// Health
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "johnny-anime-backend",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// --------------------------------------------------
// Anime
// --------------------------------------------------

app.use("/api/anime", animeRoutes);

// --------------------------------------------------
// 404
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
});

// --------------------------------------------------
// Error handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(
        `Johnny Anime Vault Backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to initialize database:",
      error
    );

    process.exit(1);
  }
}

startServer();
