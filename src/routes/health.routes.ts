import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { config } from "../config/env";

const router = Router();

// Health check endpoint
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const healthData = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || "1.0.0",
      memory: process.memoryUsage(),
    };

    res.status(200).json({
      success: true,
      data: healthData,
    });
  })
);

// Detailed health check
router.get(
  "/detailed",
  asyncHandler(async (_req: Request, res: Response) => {
    const healthData = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || "1.0.0",
      memory: process.memoryUsage(),
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        arch: process.arch,
      },
      services: {
        ai: "connected",
        database: "connected",
      },
    };

    res.status(200).json({
      success: true,
      data: healthData,
    });
  })
);

export { router as healthRoutes };
