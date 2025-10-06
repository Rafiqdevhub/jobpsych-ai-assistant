import { createError } from "../src/middleware/errorHandler";

describe("Error Handler", () => {
  it("should create error with status code", () => {
    const error = createError("Test error", 400);
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
  });
});
