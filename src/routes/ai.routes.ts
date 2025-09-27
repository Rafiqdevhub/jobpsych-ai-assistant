import { Router, Request, Response } from "express";
import Joi from "joi";
import { asyncHandler, createError } from "../middleware/errorHandler";
import { AIService } from "../services/ai.service";
import { validateRequest } from "../middleware/validation";

const router = Router();
const aiService = new AIService();

// Validation schemas
const chatSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000),
  context: Joi.string().optional(),
  model: Joi.string().optional(),
});

const analyzeSchema = Joi.object({
  text: Joi.string().required().min(1).max(5000),
  analysisType: Joi.string()
    .valid("sentiment", "summary", "keywords")
    .required(),
});

// Chat with AI
router.post(
  "/chat",
  validateRequest(chatSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { message, context, model } = req.body;

    try {
      const response = await aiService.chat({
        message,
        context,
        model: model || process.env.AI_MODEL || "gpt-3.5-turbo",
      });

      res.status(200).json({
        success: true,
        data: {
          response,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      throw createError("Failed to process AI request", 500);
    }
  })
);

// Analyze text
router.post(
  "/analyze",
  validateRequest(analyzeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { text, analysisType } = req.body;

    try {
      const result = await aiService.analyzeText(text, analysisType);

      res.status(200).json({
        success: true,
        data: {
          result,
          analysisType,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      throw createError("Failed to analyze text", 500);
    }
  })
);

// Get available models
router.get(
  "/models",
  asyncHandler(async (_req: Request, res: Response) => {
    const models = await aiService.getAvailableModels();

    res.status(200).json({
      success: true,
      data: {
        models,
        default: process.env.AI_MODEL || "gpt-3.5-turbo",
      },
    });
  })
);

// AI status
router.get(
  "/status",
  asyncHandler(async (_req: Request, res: Response) => {
    const status = await aiService.getStatus();

    res.status(200).json({
      success: true,
      data: status,
    });
  })
);

export { router as aiRoutes };
