import request from "supertest";
import app from "../index";

describe("Health Check Routes", () => {
  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("status", "OK");
      expect(response.body.data).toHaveProperty("timestamp");
      expect(response.body.data).toHaveProperty("uptime");
      expect(response.body.data).toHaveProperty("environment");
      expect(response.body.data).toHaveProperty("version");
      expect(response.body.data).toHaveProperty("memory");
    });
  });

  describe("GET /api/health/detailed", () => {
    it("should return detailed health information", async () => {
      const response = await request(app).get("/api/health/detailed");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("status", "OK");
      expect(response.body.data).toHaveProperty("system");
      expect(response.body.data.system).toHaveProperty("platform");
      expect(response.body.data.system).toHaveProperty("nodeVersion");
      expect(response.body.data.system).toHaveProperty("arch");
      expect(response.body.data).toHaveProperty("services");
    });
  });
});

describe("Application Routes", () => {
  describe("GET /", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.text).toContain("Welcome to the AI Assistant API");
    });
  });

  describe("GET /invalid-route", () => {
    it("should return 404 for invalid routes", async () => {
      const response = await request(app).get("/invalid-route");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Route not found");
      expect(response.body).toHaveProperty("timestamp");
    });
  });
});
