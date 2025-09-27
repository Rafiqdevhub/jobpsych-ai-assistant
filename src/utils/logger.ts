import winston from "winston";

const logLevel = process.env.LOG_LEVEL || "info";

// Simple console-only logger for production compatibility
export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === "production"
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
  ),
  defaultMeta: { service: "ai-assistant" },
  transports: [new winston.transports.Console()],
});

export default logger;
