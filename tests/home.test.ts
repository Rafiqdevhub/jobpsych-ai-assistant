import request from "supertest";
import app from "../src/index";

describe("Home Route", () => {
  it("GET / should return metadata", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    const data = res.body.data;
    expect(data.name).toBeDefined();
    expect(data.version).toBeDefined();
    expect(data.environment).toBeDefined();
    expect(data.apiPrefix).toBeDefined();
    expect(data.routes).toBeDefined();
    expect(Array.isArray(data.routes)).toBe(true);
    expect(data.routes.length).toBeGreaterThan(0);
    expect(data.workflow).toBeDefined();
    expect(data.workflow.description).toBeDefined();
    expect(data.workflow.steps).toBeDefined();
    expect(Array.isArray(data.workflow.steps)).toBe(true);
    expect(data.docs).toHaveProperty("health");
    expect(data.docs).toHaveProperty("ai");
  });
});
