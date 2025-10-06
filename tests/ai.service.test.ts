import * as aiService from "../src/services/ai.service";

// Mock Google Generative AI
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue("Mocked response"),
        },
      }),
    }),
  })),
}));

describe("AI Service", () => {
  beforeAll(() => {
    process.env.GEMINI_API_KEY = "test-key";
    aiService.initializeAIService();
  });

  it("should initialize service", () => {
    expect(() => aiService.initializeAIService()).not.toThrow();
  });

  it("should return status", async () => {
    const status = await aiService.getStatus();
    expect(status).toHaveProperty("status");
  });
});
