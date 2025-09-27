import request from "supertest";
import app from "../src/index";

describe("Health Routes", () => {
  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("OK");
      expect(response.body.data).toHaveProperty("timestamp");
      expect(response.body.data).toHaveProperty("uptime");
    });
  });

  describe("GET /api/health/detailed", () => {
    it("should return detailed health information", async () => {
      const response = await request(app)
        .get("/api/health/detailed")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("OK");
      expect(response.body.data).toHaveProperty("system");
      expect(response.body.data).toHaveProperty("services");
    });
  });
});
