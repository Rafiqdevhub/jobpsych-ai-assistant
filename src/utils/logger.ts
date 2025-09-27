import winston from "winston";
import path from "path";
import fs from "fs";

const logLevel = process.env.LOG_LEVEL || "info";

// Create logs directory if it doesn't exist (only in development)
const logsDir = path.join(process.cwd(), "logs");
if (process.env.NODE_ENV !== "production") {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  } catch (error) {
    // Ignore errors, fallback to console only
  }
}

// Configure transports based on environment
const transports: winston.transport[] = [];

// In production, use console transport only (for cloud logging)
if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
} else {
  // In development, use file transports if logs directory exists
  try {
    if (fs.existsSync(logsDir)) {
      transports.push(
        new winston.transports.File({
          filename: path.join(logsDir, "error.log"),
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join(logsDir, "combined.log"),
        })
      );
    }
  } catch (error) {
    // Fallback to console only if file transport fails
  }

  // Always add console transport in development
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: "ai-assistant" },
  transports,
});

export default logger;
