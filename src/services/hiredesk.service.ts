import * as aiService from "./ai.service";
import { logger } from "../utils/logger";

export interface HireDeskQuery {
  query: string;
  jobRole?: string;
  candidateInfo?: string;
  queryType:
    | "screening"
    | "interview_questions"
    | "job_posting"
    | "candidate_match";
  context?: string;
}

export interface HireDeskResponse {
  answer: string;
  queryType: string;
  suggestions?: string[];
}

/**
 * Process a HireDesk query using AI assistance
 * @param request - The HireDesk query request
 * @returns AI-generated response for recruiters
 */
export const processQuery = async (
  request: HireDeskQuery
): Promise<HireDeskResponse> => {
  logger.info("Processing HireDesk query", { queryType: request.queryType });

  try {
    const systemPrompt = getHireDeskPrompt(request.queryType);
    const enhancedMessage = buildQueryMessage(request);

    const response = await aiService.chat({
      message: enhancedMessage,
      context: systemPrompt,
      sessionType: "analysis",
    });

    return {
      answer: response.response,
      queryType: request.queryType,
    };
  } catch (error) {
    logger.error("HireDesk query processing failed", {
      error,
      queryType: request.queryType,
    });
    throw error;
  }
};

/**
 * Get recruiter-specific system prompt based on query type
 * @param queryType - Type of recruiter query
 * @returns System prompt for AI
 */
const getHireDeskPrompt = (queryType: string): string => {
  const basePrompt = `You are HireDesk AI, a professional assistant for recruiters and hiring managers. 
Provide clear, actionable, and objective insights to help with hiring decisions. 
Focus on practical advice that can be immediately applied in recruitment processes.`;

  switch (queryType) {
    case "screening":
      return `${basePrompt}

Your task: Help recruiters screen candidates effectively.
- Suggest relevant screening questions
- Identify key qualifications to look for
- Highlight red flags or positive indicators
- Provide objective evaluation criteria
Be concise and data-driven.`;

    case "interview_questions":
      return `${basePrompt}

Your task: Generate relevant interview questions for the role.
- Create role-specific technical and behavioral questions
- Include questions to assess cultural fit
- Suggest follow-up questions for deeper insights
- Balance technical skills with soft skills assessment
Provide 5-7 well-structured questions with brief explanations.`;

    case "job_posting":
      return `${basePrompt}

Your task: Optimize job postings for clarity and appeal.
- Improve job descriptions for better candidate engagement
- Suggest compelling language that attracts top talent
- Ensure clarity on requirements and responsibilities
- Optimize for inclusivity and accessibility
- Balance being comprehensive with being concise
Provide specific, actionable recommendations.`;

    case "candidate_match":
      return `${basePrompt}

Your task: Analyze candidate-role fit.
- Evaluate how well candidate qualifications match role requirements
- Identify strengths and potential gaps
- Assess experience relevance
- Provide objective scoring or rating if possible
- Suggest areas for further evaluation in interviews
Be balanced and evidence-based in your assessment.`;

    default:
      return basePrompt;
  }
};

/**
 * Build enhanced message with context for AI processing
 * @param request - HireDesk query request
 * @returns Formatted message string
 */
const buildQueryMessage = (request: HireDeskQuery): string => {
  let message = `Query: ${request.query}\n\n`;

  if (request.jobRole) {
    message += `Job Role: ${request.jobRole}\n`;
  }

  if (request.candidateInfo) {
    message += `Candidate Information:\n${request.candidateInfo}\n\n`;
  }

  if (request.context) {
    message += `Additional Context: ${request.context}\n`;
  }

  message += `\nPlease provide a detailed, actionable response for this ${request.queryType} query.`;

  return message;
};

/**
 * Validate that the HireDesk query has required information
 * @param request - HireDesk query request
 * @returns Validation result
 */
export const validateQueryContext = (
  request: HireDeskQuery
): {
  isValid: boolean;
  message?: string;
} => {
  // For candidate matching, we need either job role or candidate info
  if (request.queryType === "candidate_match") {
    if (!request.jobRole && !request.candidateInfo) {
      return {
        isValid: false,
        message:
          "Candidate matching requires either job role or candidate information",
      };
    }
  }

  // For interview questions and job posting, job role is helpful
  if (
    (request.queryType === "interview_questions" ||
      request.queryType === "job_posting") &&
    !request.jobRole
  ) {
    logger.warn("Job role not provided for query type", {
      queryType: request.queryType,
    });
    // Not blocking, just a warning
  }

  return { isValid: true };
};
