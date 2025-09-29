import { Request, Response } from "express";
import * as aiService from "../services/ai.service";
import { createError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { config } from "../config/env";

/**
 * Handle general chat requests with JobPsych AI
 */
export const chat = async (req: Request, res: Response): Promise<void> => {
  const { message, context, model, sessionType } = req.body;

  try {
    const response = await aiService.chat({
      message,
      context,
      model: model || config.aiModel,
      sessionType: sessionType || "general",
    });

    res.status(200).json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("AI chat request failed in controller", {
      error,
      message,
      context,
      model,
      sessionType,
    });
    throw createError("Failed to process JobPsych AI request", 500);
  }
};

/**
 * Handle career coaching sessions
 */
export const coaching = async (req: Request, res: Response): Promise<void> => {
  const { query, sessionType, userContext } = req.body;

  try {
    const response = await aiService.chat({
      message: query,
      context: `Coaching Session Type: ${
        sessionType || "general"
      }\nUser Context: ${userContext || "No additional context"}`,
      sessionType: "coaching",
    });

    res.status(200).json({
      success: true,
      data: {
        response,
        coachingType: sessionType || "general",
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    throw createError("Failed to process coaching request", 500);
  }
};

/**
 * Handle job analysis and career fit assessment
 */
export const analyzeJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { jobDescription, userProfile, analysisType } = req.body;

  try {
    const result = await aiService.analyzeJobFit({
      jobDescription,
      userProfile,
      analysisType,
    });

    res.status(200).json({
      success: true,
      data: {
        analysis: result,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    throw createError("Failed to analyze job fit", 500);
  }
};

/**
 * Handle text analysis (sentiment, summary, keywords)
 */
export const analyzeText = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch {
    throw createError("Failed to analyze text", 500);
  }
};

/**
 * Get available AI models
 */
export const getModels = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const models = await aiService.getAvailableModels();

    res.status(200).json({
      success: true,
      data: {
        models,
        default: config.aiModel,
      },
    });
  } catch {
    throw createError("Failed to get available models", 500);
  }
};

/**
 * Get AI service status
 */
export const getStatus = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = await aiService.getStatus();

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch {
    throw createError("Failed to get AI service status", 500);
  }
};

/**
 * Handle career path recommendations
 */
export const getCareerPath = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { currentRole, experience, interests, goals } = req.body;

  try {
    const response = await aiService.chat({
      message: `I need career path recommendations based on my profile:
      Current Role: ${currentRole}
      Experience: ${experience}
      Interests: ${interests}
      Goals: ${goals}`,
      sessionType: "analysis",
    });

    res.status(200).json({
      success: true,
      data: {
        recommendations: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    throw createError("Failed to generate career path recommendations", 500);
  }
};

/**
 * Handle interview preparation
 */
export const prepareInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { jobDescription, userProfile, interviewType } = req.body;

  try {
    const result = await aiService.analyzeJobFit({
      jobDescription,
      userProfile,
      analysisType: "interview_prep",
    });

    res.status(200).json({
      success: true,
      data: {
        preparation: result,
        interviewType: interviewType || "general",
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    throw createError("Failed to prepare interview guidance", 500);
  }
};

/**
 * Handle skill gap analysis
 */
export const analyzeSkillGap = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { targetRole, currentSkills, desiredSkills } = req.body;

  try {
    const result = await aiService.analyzeJobFit({
      jobDescription: `Target Role: ${targetRole}\nRequired Skills: ${desiredSkills}`,
      userProfile: `Current Skills: ${currentSkills}`,
      analysisType: "skills_gap",
    });

    res.status(200).json({
      success: true,
      data: {
        skillGapAnalysis: result,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    throw createError("Failed to analyze skill gap", 500);
  }
};
