import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { config } from "../config/env";

/**
 * Diagnostic endpoint to test Google Gemini API connection
 */
export const diagnoseAPI = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    apiKey: {
      exists: !!config.geminiApiKey,
      length: config.geminiApiKey?.length || 0,
      firstChars: config.geminiApiKey?.substring(0, 10) + "..." || "Not set",
    },
    model: config.aiModel,
    suggestions: [] as string[],
  };

  // Add suggestions based on diagnostics
  if (!diagnostics.apiKey.exists) {
    diagnostics.suggestions.push(
      "❌ GEMINI_API_KEY environment variable is not set"
    );
  } else if (diagnostics.apiKey.length < 30) {
    diagnostics.suggestions.push(
      "⚠️ GEMINI_API_KEY seems too short, please verify"
    );
  } else {
    diagnostics.suggestions.push(
      "✅ GEMINI_API_KEY is set and has reasonable length"
    );
  }

  // Test API connectivity (simple check)
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    if (config.geminiApiKey) {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: diagnostics.model });

      // Try a simple test request
      const result = await model.generateContent("Hello");
      const response = result.response.text();

      diagnostics.suggestions.push("✅ API connection successful");
      diagnostics.suggestions.push(
        `✅ Test response: ${response.substring(0, 50)}...`
      );
    } else {
      diagnostics.suggestions.push("❌ Cannot test API - no API key provided");
    }
  } catch (error: unknown) {
    const errorObj = error as {
      message?: string;
      status?: number;
      statusText?: string;
    };

    logger.error("API diagnosis failed", { error: errorObj });

    if (errorObj?.status === 401) {
      diagnostics.suggestions.push(
        "❌ API Key is invalid - please check your GEMINI_API_KEY"
      );
    } else if (errorObj?.status === 403) {
      diagnostics.suggestions.push(
        "❌ API Key doesn't have permission - check your Google AI Studio settings"
      );
    } else if (errorObj?.status === 503) {
      diagnostics.suggestions.push(
        "❌ Google Gemini service is temporarily unavailable"
      );
    } else if (errorObj?.status === 429) {
      diagnostics.suggestions.push(
        "❌ Rate limit exceeded - please wait before trying again"
      );
    } else {
      diagnostics.suggestions.push(
        `❌ API test failed: ${errorObj?.message || "Unknown error"}`
      );
    }
  }

  res.status(200).json({
    success: true,
    data: diagnostics,
  });
};
