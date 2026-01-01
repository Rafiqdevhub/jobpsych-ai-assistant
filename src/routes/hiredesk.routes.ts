import { Router } from "express";
import Joi from "joi";
import { asyncHandler } from "../middleware/errorHandler";
import * as hireDeskController from "../controllers/hiredesk.controller";
import { validateRequest } from "../middleware/validation";

const router = Router();

// Validation schema for HireDesk query
const hireDeskQuerySchema = Joi.object({
  query: Joi.string().required().min(1).max(2000).messages({
    "string.empty": "Query is required",
    "string.min": "Query must not be empty",
    "string.max": "Query must not exceed 2000 characters",
  }),
  jobRole: Joi.string().optional().max(200).messages({
    "string.max": "Job role must not exceed 200 characters",
  }),
  candidateInfo: Joi.string().optional().max(3000).messages({
    "string.max": "Candidate information must not exceed 3000 characters",
  }),
  queryType: Joi.string()
    .valid("screening", "interview_questions", "job_posting", "candidate_match")
    .required()
    .messages({
      "any.only":
        "Query type must be one of: screening, interview_questions, job_posting, candidate_match",
      "any.required": "Query type is required",
    }),
  context: Joi.string().optional().max(1000).messages({
    "string.max": "Context must not exceed 1000 characters",
  }),
});

/**
 * POST /api/hiredesk/query
 * Main endpoint for HireDesk AI assistant queries
 * Helps recruiters with screening, interviews, job postings, and candidate matching
 */
router.post(
  "/query",
  validateRequest(hireDeskQuerySchema),
  asyncHandler(hireDeskController.answerQuery)
);

/**
 * GET /api/hiredesk/status
 * Get HireDesk service status and supported query types
 */
router.get("/status", asyncHandler(hireDeskController.getStatus));

export { router as hireDeskRoutes };
