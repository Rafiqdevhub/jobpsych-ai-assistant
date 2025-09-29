import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  apiPrefix: process.env.API_PREFIX || "/api",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  corsOrigin: process.env.CORS_ORIGIN || "",
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["https://jobpsych.vercel.app", "http://localhost:3000"],
  nodeEnv: process.env.NODE_ENV || "development",
  aiModel: process.env.AI_MODEL || "gemini-2.5-flash",
  logLevel: process.env.LOG_LEVEL || "info",
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  },
} as const;
