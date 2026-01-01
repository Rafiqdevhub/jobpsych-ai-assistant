import request from "supertest";
import express from "express";
import { hireDeskRoutes } from "../src/routes/hiredesk.routes";
import * as hireDeskService from "../src/services/hiredesk.service";
import { errorHandler } from "../src/middleware/errorHandler";

// Mock the hiredesk service
jest.mock("../src/services/hiredesk.service");

// Mock the AI service
jest.mock("../src/services/ai.service", () => ({
  chat: jest.fn().mockResolvedValue({
    response: "Mocked AI response",
    model: "gemini-2.5-flash",
  }),
}));

describe("HireDesk Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/hiredesk", hireDeskRoutes);
    app.use(errorHandler);
    jest.clearAllMocks();
  });

  describe("POST /api/hiredesk/query", () => {
    const validPayload = {
      query: "What are good screening questions for a React developer?",
      jobRole: "Senior React Developer",
      queryType: "screening",
    };

    it("should successfully process a valid screening query", async () => {
      const mockResponse = {
        answer: "Here are key screening questions for React developers...",
        queryType: "screening",
      };

      (hireDeskService.validateQueryContext as jest.Mock).mockReturnValue({
        isValid: true,
      });
      (hireDeskService.processQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(validPayload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("answer");
      expect(response.body.data).toHaveProperty("timestamp");
      expect(response.body.data.queryType).toBe("screening");
    });

    it("should successfully process interview questions query", async () => {
      const payload = {
        query: "Generate interview questions for a Python backend engineer",
        jobRole: "Python Backend Engineer",
        queryType: "interview_questions",
        context: "5+ years experience, microservices architecture",
      };

      const mockResponse = {
        answer: "1. Explain Python decorators... 2. Describe microservices...",
        queryType: "interview_questions",
      };

      (hireDeskService.validateQueryContext as jest.Mock).mockReturnValue({
        isValid: true,
      });
      (hireDeskService.processQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.queryType).toBe("interview_questions");
    });

    it("should successfully process job posting query", async () => {
      const payload = {
        query: "Improve this job description to attract top talent",
        jobRole: "DevOps Engineer",
        queryType: "job_posting",
      };

      const mockResponse = {
        answer: "Consider these improvements to your job posting...",
        queryType: "job_posting",
      };

      (hireDeskService.validateQueryContext as jest.Mock).mockReturnValue({
        isValid: true,
      });
      (hireDeskService.processQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.queryType).toBe("job_posting");
    });

    it("should successfully process candidate match query", async () => {
      const payload = {
        query: "Does this candidate fit the role?",
        jobRole: "Full Stack Developer",
        candidateInfo:
          "5 years experience with React, Node.js, MongoDB. Built 3 SaaS products.",
        queryType: "candidate_match",
      };

      const mockResponse = {
        answer: "This candidate shows strong alignment with the role...",
        queryType: "candidate_match",
      };

      (hireDeskService.validateQueryContext as jest.Mock).mockReturnValue({
        isValid: true,
      });
      (hireDeskService.processQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.queryType).toBe("candidate_match");
    });

    it("should reject request without query", async () => {
      const payload = {
        queryType: "screening",
      };

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation error");
    });

    it("should reject request without queryType", async () => {
      const payload = {
        query: "What are good questions?",
      };

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation error");
    });

    it("should reject request with invalid queryType", async () => {
      const payload = {
        query: "What are good questions?",
        queryType: "invalid_type",
      };

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation error");
    });

    it("should reject query exceeding max length", async () => {
      const payload = {
        query: "a".repeat(2001),
        queryType: "screening",
      };

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation error");
    });

    it("should reject candidateInfo exceeding max length", async () => {
      const payload = {
        query: "Evaluate this candidate",
        candidateInfo: "a".repeat(3001),
        queryType: "candidate_match",
      };

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation error");
    });

    it("should handle validation failure from service", async () => {
      (hireDeskService.validateQueryContext as jest.Mock).mockReturnValue({
        isValid: false,
        message:
          "Candidate matching requires either job role or candidate information",
      });

      const payload = {
        query: "Is this a good match?",
        queryType: "candidate_match",
      };

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should handle service errors gracefully", async () => {
      (hireDeskService.validateQueryContext as jest.Mock).mockReturnValue({
        isValid: true,
      });
      (hireDeskService.processQuery as jest.Mock).mockRejectedValue(
        new Error("AI service unavailable")
      );

      const response = await request(app)
        .post("/api/hiredesk/query")
        .send(validPayload)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Failed to process HireDesk query"
      );
    });
  });

  describe("GET /api/hiredesk/status", () => {
    it("should return HireDesk service status", async () => {
      const response = await request(app)
        .get("/api/hiredesk/status")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("service");
      expect(response.body.data.service).toBe("HireDesk AI Assistant");
      expect(response.body.data).toHaveProperty("status");
      expect(response.body.data.status).toBe("operational");
      expect(response.body.data).toHaveProperty("supportedQueryTypes");
      expect(response.body.data.supportedQueryTypes).toEqual([
        "screening",
        "interview_questions",
        "job_posting",
        "candidate_match",
      ]);
      expect(response.body.data).toHaveProperty("version");
      expect(response.body.data).toHaveProperty("timestamp");
    });
  });
});

describe("HireDesk Service", () => {
  // Get the actual service implementation, not the mock
  const actualHireDeskService = jest.requireActual(
    "../src/services/hiredesk.service"
  );
  describe("validateQueryContext", () => {
    it("should validate successfully for screening queries", () => {
      const result = actualHireDeskService.validateQueryContext({
        query: "What questions should I ask?",
        queryType: "screening",
      });

      expect(result.isValid).toBe(true);
    });

    it("should reject candidate_match without job role or candidate info", () => {
      const result = actualHireDeskService.validateQueryContext({
        query: "Is this a match?",
        queryType: "candidate_match",
      });

      expect(result.isValid).toBe(false);
      expect(result.message).toContain(
        "requires either job role or candidate information"
      );
    });

    it("should accept candidate_match with job role", () => {
      const result = actualHireDeskService.validateQueryContext({
        query: "Is this a match?",
        jobRole: "Software Engineer",
        queryType: "candidate_match",
      });

      expect(result.isValid).toBe(true);
    });

    it("should accept candidate_match with candidate info", () => {
      const result = actualHireDeskService.validateQueryContext({
        query: "Is this a match?",
        candidateInfo: "5 years experience in React",
        queryType: "candidate_match",
      });

      expect(result.isValid).toBe(true);
    });
  });
});
