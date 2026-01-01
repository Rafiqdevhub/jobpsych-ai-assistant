import { Request, Response } from "express";
import * as hireDeskService from "../services/hiredesk.service";
import { createError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

/**
 * Handle HireDesk query requests for recruiters
 * @route POST /api/hiredesk/query
 */
export const answerQuery = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query, jobRole, candidateInfo, queryType, context } = req.body;

  logger.info("HireDesk query received", {
    queryType,
    hasJobRole: !!jobRole,
    hasCandidateInfo: !!candidateInfo,
  });

  try {
    // Validate query context
    const validation = hireDeskService.validateQueryContext({
      query,
      jobRole,
      candidateInfo,
      queryType,
      context,
    });

    if (!validation.isValid) {
      throw createError(validation.message || "Invalid query context", 400);
    }

    // Process the query
    const response = await hireDeskService.processQuery({
      query,
      jobRole,
      candidateInfo,
      queryType,
      context,
    });

    res.status(200).json({
      success: true,
      data: {
        ...response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("HireDesk query failed in controller", {
      error,
      queryType,
    });

    // Re-throw if already an operational error
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    throw createError("Failed to process HireDesk query", 500);
  }
};

/**
 * Get HireDesk service status
 * @route GET /api/hiredesk/status
 */
export const getStatus = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: {
        service: "HireDesk AI Assistant",
        status: "operational",
        supportedQueryTypes: [
          "screening",
          "interview_questions",
          "job_posting",
          "candidate_match",
        ],
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Failed to get HireDesk status", { error });
    throw createError("Failed to retrieve service status", 500);
  }
};
