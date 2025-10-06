import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { logger } from "../utils/logger";
import { config } from "../config/env";

export interface ChatRequest {
  message: string;
  context?: string;
  model?: string;
  sessionType?: "coaching" | "analysis" | "general";
}

export interface ChatResponse {
  response: string;
  model: string;
  tokens?: number;
  sessionType?: string;
}

export interface AnalysisResult {
  type: string;
  result: Record<string, unknown>;
  confidence?: number;
  insights?: string[];
  recommendations?: string[];
}

export interface JobAnalysisRequest {
  jobDescription?: string;
  userProfile?: string;
  analysisType: "fit" | "skills_gap" | "career_path" | "interview_prep";
}

export interface PsychologicalInsight {
  category: string;
  insight: string;
  confidence: number;
  actionable_advice: string;
}

// Shared state for AI service
let geminiApiKey: string;
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
let defaultModel: string;

// Initialize the AI service
export const initializeAIService = (): void => {
  geminiApiKey = config.geminiApiKey;
  defaultModel = config.aiModel;
  genAI = null;
  model = null;

  logger.info("Initializing AI Service...", {
    hasApiKey: !!geminiApiKey,
    apiKeyLength: geminiApiKey.length,
    model: defaultModel,
  });

  if (!geminiApiKey || geminiApiKey === "your-gemini-api-key-here") {
    logger.warn(
      "GEMINI_API_KEY not configured properly. AI features will be limited.",
      {
        envVarSet: !!config.geminiApiKey,
        envVarValue: config.geminiApiKey ? "SET" : "MISSING",
      }
    );
    return;
  }

  try {
    genAI = new GoogleGenerativeAI(geminiApiKey);
    model = genAI.getGenerativeModel({ model: defaultModel });
    logger.info("Google Gemini AI service initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize Google Gemini AI service", { error });
  }
};

export const chat = async (request: ChatRequest): Promise<ChatResponse> => {
  logger.info("Processing JobPsych chat request", {
    model: request.model,
    sessionType: request.sessionType,
  });

  if (!geminiApiKey || !model) {
    return {
      response:
        "I am a JobPsych AI assistant. Please configure GEMINI_API_KEY for full functionality.",
      model: request.model || "demo",
      sessionType: request.sessionType || "general",
    };
  }

  const systemPrompt = getSystemPrompt(request.sessionType);
  const enhancedPrompt = `${systemPrompt}\n\nUser Query: ${
    request.message
  }\n\nContext: ${request.context || "No additional context provided"}`;

  try {
    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    const responseText = response.text();

    return {
      response: responseText,
      model: request.model || defaultModel,
      tokens: estimateTokenCount(enhancedPrompt + responseText),
      sessionType: request.sessionType || "general",
    };
  } catch (error: unknown) {
    const errorObj = error as {
      message?: string;
      status?: number;
      statusText?: string;
      code?: string;
      details?: string;
    };
    logger.error("Gemini chat request failed", {
      error: {
        message: errorObj?.message,
        status: errorObj?.status,
        statusText: errorObj?.statusText,
        code: errorObj?.code,
        details: errorObj?.details,
      },
      prompt: enhancedPrompt.substring(0, 100) + "...",
      model: request.model || defaultModel,
    });

    // Provide more specific error messages based on the error type
    if (errorObj?.status === 503) {
      throw new Error(
        "Google Gemini service is temporarily unavailable. Please try again later."
      );
    } else if (errorObj?.status === 401) {
      throw new Error(
        "Invalid API key. Please check your GEMINI_API_KEY configuration."
      );
    } else if (errorObj?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else if (errorObj?.status === 400) {
      throw new Error(
        "Invalid request. Please check your input and try again."
      );
    } else {
      throw new Error(
        `Failed to process chat request with Gemini: ${
          errorObj?.message || "Unknown error"
        }`
      );
    }
  }
};

export const analyzeJobFit = async (
  request: JobAnalysisRequest
): Promise<AnalysisResult> => {
  logger.info("Analyzing job fit with JobPsych AI", {
    analysisType: request.analysisType,
  });

  if (!geminiApiKey || !model) {
    return getMockJobAnalysis(request.analysisType);
  }

  try {
    const prompt = getJobAnalysisPrompt(request);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return {
      type: request.analysisType,
      result: parseJobAnalysisResponse(responseText),
      confidence: 0.85,
      insights: extractInsights(responseText),
      recommendations: extractRecommendations(responseText),
    };
  } catch (error) {
    logger.error("Job analysis failed", { error });
    throw new Error("Failed to analyze job fit");
  }
};

export const analyzeText = async (
  text: string,
  analysisType: string
): Promise<AnalysisResult> => {
  logger.info("Analyzing text with JobPsych context", {
    type: analysisType,
    length: text.length,
  });

  if (!geminiApiKey || !model) {
    return getMockAnalysis(text, analysisType);
  }

  try {
    const prompt = getAnalysisPrompt(text, analysisType);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return {
      type: analysisType,
      result: parseAnalysisResponse(responseText, analysisType),
      confidence: 0.8,
      insights: extractInsights(responseText),
      recommendations: extractRecommendations(responseText),
    };
  } catch (error) {
    logger.error("Text analysis failed", { error, type: analysisType });
    throw new Error("Failed to analyze text");
  }
};

export const getAvailableModels = async (): Promise<string[]> => {
  return [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-2.5-flash",
  ];
};

export const getStatus = async (): Promise<any> => {
  return {
    status: geminiApiKey ? "connected" : "not_configured",
    models: await getAvailableModels(),
    provider: "Google Gemini",
    features: [
      "JobPsych Coaching",
      "Career Analysis",
      "Psychological Insights",
    ],
    lastCheck: new Date().toISOString(),
  };
};

const getSystemPrompt = (sessionType?: string): string => {
  const basePrompt = `You are JobPsych AI, a specialized AI assistant focused on career psychology, job analysis, and professional development. You provide evidence-based insights using psychological principles for career guidance.

RESPONSE GUIDELINES:
- Keep ALL responses under 20 words unless explicitly asked for longer answers
- Use simple, natural language (no buzzwords or filler)
- Sound confident, clear, and engaging
- Avoid long paragraphs; prefer short sentences or bullet points
- Provide direct value in as few words as possible
- Be concise, informative, and attractive`;

  switch (sessionType) {
    case "coaching":
      return `${basePrompt} You are in coaching mode. Provide supportive, encouraging guidance with actionable steps. Focus on motivation, goal-setting, and overcoming career challenges.`;

    case "analysis":
      return `${basePrompt} You are in analysis mode. Provide detailed, analytical insights about job fit, skills gaps, career trajectories, and market trends. Be objective and data-driven.`;

    case "general":
    default:
      return `${basePrompt} Provide balanced guidance that combines psychological insights with practical career advice. Be professional, empathetic, and solution-oriented.`;
  }
};

const getJobAnalysisPrompt = (request: JobAnalysisRequest): string => {
  const basePrompt = `As JobPsych AI, analyze the following for career psychology insights. Keep your response under 20 words unless specifically asked for details. Be direct and actionable.`;

  switch (request.analysisType) {
    case "fit":
      return `${basePrompt}\n\nJob Description: ${request.jobDescription}\nUser Profile: ${request.userProfile}\n\nAnalyze the psychological fit between this person and role. Consider personality traits, work style, growth potential, and potential challenges.`;

    case "skills_gap":
      return `${basePrompt}\n\nJob Description: ${request.jobDescription}\nUser Profile: ${request.userProfile}\n\nIdentify skills gaps and provide a development roadmap with psychological considerations for learning preferences and motivation.`;

    case "career_path":
      return `${basePrompt}\n\nCurrent Role/Interest: ${request.jobDescription}\nUser Background: ${request.userProfile}\n\nSuggest career progression paths considering psychological factors like personality type, values, and long-term satisfaction.`;

    case "interview_prep":
      return `${basePrompt}\n\nJob Description: ${request.jobDescription}\nUser Profile: ${request.userProfile}\n\nProvide interview preparation advice focusing on psychological strategies to reduce anxiety, present authentically, and demonstrate fit.`;

    default:
      return `${basePrompt}\n\nProvide general career guidance based on the provided information.`;
  }
};

const getAnalysisPrompt = (text: string, analysisType: string): string => {
  const basePrompt = `As JobPsych AI, analyze this career-related content. Keep your response under 20 words unless specifically asked for details. Be direct and insightful.`;

  switch (analysisType) {
    case "sentiment":
      return `${basePrompt}\n\n"${text}"\n\nAnalyze the emotional tone and psychological state reflected in this text. Consider stress levels, confidence, motivation, and career satisfaction.`;

    case "summary":
      return `${basePrompt}\n\n"${text}"\n\nSummarize the key career and psychological themes, highlighting important insights about the person's professional situation.`;

    case "keywords":
      return `${basePrompt}\n\n"${text}"\n\nExtract key career-related terms, psychological indicators, and professional themes. Focus on skills, motivations, concerns, and opportunities.`;

    default:
      return `${basePrompt}\n\n"${text}"\n\nProvide comprehensive analysis with career psychology insights.`;
  }
};

const estimateTokenCount = (text: string): number => {
  return Math.ceil(text.length / 4);
};

const parseJobAnalysisResponse = (response: string): any => {
  return {
    analysis: response,
    timestamp: new Date().toISOString(),
  };
};

const parseAnalysisResponse = (response: string, analysisType: string): any => {
  return {
    analysisType,
    content: response,
    timestamp: new Date().toISOString(),
  };
};

const extractInsights = (response: string): string[] => {
  const lines = response.split("\n");
  return lines
    .filter(
      (line) =>
        line.includes("insight") ||
        line.includes("important") ||
        line.includes("key")
    )
    .slice(0, 3);
};

const extractRecommendations = (response: string): string[] => {
  const lines = response.split("\n");
  return lines
    .filter(
      (line) =>
        line.includes("recommend") ||
        line.includes("suggest") ||
        line.includes("should")
    )
    .slice(0, 3);
};

const getMockJobAnalysis = (analysisType: string): AnalysisResult => {
  return {
    type: analysisType,
    result: {
      analysis: `Mock ${analysisType} analysis - Please configure GEMINI_API_KEY for real insights`,
      score: Math.random() * 100,
      factors: ["Communication", "Problem Solving", "Adaptability"],
    },
    confidence: 0.5,
    insights: ["This is a demo insight", "Configure API key for real analysis"],
    recommendations: [
      "Set up Gemini API key",
      "Provide more detailed information",
    ],
  };
};

const getMockAnalysis = (
  text: string,
  analysisType: string
): AnalysisResult => {
  return {
    type: analysisType,
    result: {
      content: `Mock ${analysisType} analysis of: ${text.substring(0, 50)}...`,
      timestamp: new Date().toISOString(),
    },
    confidence: 0.5,
    insights: ["Demo mode active"],
    recommendations: ["Configure GEMINI_API_KEY for full functionality"],
  };
};
