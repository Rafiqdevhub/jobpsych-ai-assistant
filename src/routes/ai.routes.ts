import { Router } from "express";
import Joi from "joi";
import { asyncHandler } from "../middleware/errorHandler";
import * as aiController from "../controllers/ai.controller";
import { validateRequest } from "../middleware/validation";

const router = Router();

// Validation schemas
const chatSchema = Joi.object({
  message: Joi.string().required().min(1).max(2000),
  context: Joi.string().optional(),
  model: Joi.string().optional(),
  sessionType: Joi.string().valid("coaching", "analysis", "general").optional(),
});

const analyzeSchema = Joi.object({
  text: Joi.string().required().min(1).max(5000),
  analysisType: Joi.string()
    .valid("sentiment", "summary", "keywords")
    .required(),
});

const jobAnalysisSchema = Joi.object({
  jobDescription: Joi.string().optional().max(3000),
  userProfile: Joi.string().optional().max(2000),
  analysisType: Joi.string()
    .valid("fit", "skills_gap", "career_path", "interview_prep")
    .required(),
});

const coachingSessionSchema = Joi.object({
  query: Joi.string().required().min(1).max(1000),
  sessionType: Joi.string()
    .valid("goal_setting", "problem_solving", "motivation", "career_change")
    .optional(),
  userContext: Joi.string().optional().max(1000),
});

const careerPathSchema = Joi.object({
  currentRole: Joi.string().required().min(1).max(200),
  experience: Joi.string().required().min(1).max(1000),
  interests: Joi.string().required().min(1).max(1000),
  goals: Joi.string().required().min(1).max(1000),
});

const interviewPrepSchema = Joi.object({
  jobDescription: Joi.string().required().min(1).max(3000),
  userProfile: Joi.string().required().min(1).max(2000),
  interviewType: Joi.string()
    .valid("technical", "behavioral", "case_study", "general")
    .optional(),
});

const skillGapSchema = Joi.object({
  targetRole: Joi.string().required().min(1).max(200),
  currentSkills: Joi.string().required().min(1).max(1000),
  desiredSkills: Joi.string().required().min(1).max(1000),
});

// Chat with JobPsych AI
router.post(
  "/chat",
  validateRequest(chatSchema),
  asyncHandler(aiController.chat)
);

// JobPsych Career Coaching
router.post(
  "/coaching",
  validateRequest(coachingSessionSchema),
  asyncHandler(aiController.coaching)
);

// Job Analysis and Career Fit
router.post(
  "/analyze-job",
  validateRequest(jobAnalysisSchema),
  asyncHandler(aiController.analyzeJob)
);

// Analyze text
router.post(
  "/analyze",
  validateRequest(analyzeSchema),
  asyncHandler(aiController.analyzeText)
);

// Get available models
router.get("/models", asyncHandler(aiController.getModels));

// AI status
router.get("/status", asyncHandler(aiController.getStatus));

// Career path recommendations
router.post(
  "/career-path",
  validateRequest(careerPathSchema),
  asyncHandler(aiController.getCareerPath)
);

// Interview preparation
router.post(
  "/interview-prep",
  validateRequest(interviewPrepSchema),
  asyncHandler(aiController.prepareInterview)
);

// Skill gap analysis
router.post(
  "/skill-gap",
  validateRequest(skillGapSchema),
  asyncHandler(aiController.analyzeSkillGap)
);

export { router as aiRoutes };
