import request from "supertest";
import app from "../src/index";

describe("Essential App Tests", () => {
  it("should return health status", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should return 404 for invalid routes", async () => {
    const response = await request(app).get("/invalid-route");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
