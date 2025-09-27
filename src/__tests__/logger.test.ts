import { logger } from "../utils/logger";

describe("Logger", () => {
  it("should have required methods", () => {
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
  });
});
