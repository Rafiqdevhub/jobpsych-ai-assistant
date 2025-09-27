import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { healthRoutes } from "./routes/health.routes";
import { aiRoutes } from "./routes/ai.routes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || "/api";

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing and compression
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

app.get("/", (_req, res) => {
  res.send("Welcome to the AI Assistant API. Visit /api for endpoints.");
});

// Routes
app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 AI Assistant server running on http://localhost:${PORT}`);
  logger.info(`📡 API available at http://localhost:${PORT}${API_PREFIX}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
