import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

const PORT = process.env.PORT || 10000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5500";

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL
  })
);

app.use(
  express.json({
    limit: "10mb"
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "Johnny Anime Vault Backend",
    message: "Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "johnny-anime-backend",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(
    `Johnny Anime Vault Backend running on port ${PORT}`
  );
});
