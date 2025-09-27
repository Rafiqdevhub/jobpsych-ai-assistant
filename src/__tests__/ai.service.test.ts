import * as aiService from "../services/ai.service";

// Mock the Google Generative AI to avoid actual API calls during tests
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue("Mocked AI response"),
        },
      }),
    }),
  })),
}));

describe("AI Service", () => {
  beforeAll(() => {
    // Set up environment variables for testing
    process.env.GEMINI_API_KEY = "test-api-key";
    process.env.AI_MODEL = "gemini-2.5-flash";

    // Initialize the service
    aiService.initializeAIService();
  });

  describe("initializeAIService", () => {
    it("should initialize without throwing errors", () => {
      expect(() => {
        aiService.initializeAIService();
      }).not.toThrow();
    });
  });

  describe("getStatus", () => {
    it("should return service status", async () => {
      const status = await aiService.getStatus();

      expect(status).toHaveProperty("status");
      expect(status).toHaveProperty("model");
      expect(status).toHaveProperty("lastChecked");
      expect(typeof status.status).toBe("string");
      expect(typeof status.model).toBe("string");
    });
  });

  describe("getAvailableModels", () => {
    it("should return available models", async () => {
      const models = await aiService.getAvailableModels();

      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      expect(models[0]).toHaveProperty("name");
      expect(models[0]).toHaveProperty("description");
    });
  });

  describe("chat", () => {
    it("should handle chat requests", async () => {
      const chatRequest = {
        message: "Hello, test message",
        sessionType: "general" as const,
      };

      const response = await aiService.chat(chatRequest);

      expect(response).toHaveProperty("response");
      expect(response).toHaveProperty("model");
      expect(response).toHaveProperty("sessionType");
      expect(typeof response.response).toBe("string");
      expect(response.response.length).toBeGreaterThan(0);
    });

    it("should handle chat requests with context", async () => {
      const chatRequest = {
        message: "Hello, test message",
        context: "This is test context",
        sessionType: "coaching" as const,
      };

      const response = await aiService.chat(chatRequest);

      expect(response).toHaveProperty("response");
      expect(response).toHaveProperty("model");
      expect(response).toHaveProperty("sessionType");
      expect(typeof response.response).toBe("string");
      expect(response.response.length).toBeGreaterThan(0);
    });
  });

  describe("analyzeText", () => {
    it("should analyze text for sentiment", async () => {
      const result = await aiService.analyzeText(
        "I love this product!",
        "sentiment"
      );

      expect(result).toHaveProperty("type", "sentiment");
      expect(result).toHaveProperty("result");
    });

    it("should analyze text for summary", async () => {
      const result = await aiService.analyzeText(
        "This is a long text that needs to be summarized for testing purposes.",
        "summary"
      );

      expect(result).toHaveProperty("type", "summary");
      expect(result).toHaveProperty("result");
    });

    it("should analyze text for keywords", async () => {
      const result = await aiService.analyzeText(
        "Machine learning and artificial intelligence are important technologies.",
        "keywords"
      );

      expect(result).toHaveProperty("type", "keywords");
      expect(result).toHaveProperty("result");
    });
  });

  describe("analyzeJobFit", () => {
    it("should analyze job fit", async () => {
      const request = {
        jobDescription:
          "Software Engineer position requiring JavaScript and React",
        userProfile: "Experienced JavaScript developer with React skills",
        analysisType: "fit" as const,
      };

      const result = await aiService.analyzeJobFit(request);

      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("result");
    });

    it("should handle missing job description", async () => {
      const request = {
        userProfile: "Experienced developer",
        analysisType: "fit" as const,
      };

      const result = await aiService.analyzeJobFit(request);

      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("result");
    });
  });
});
