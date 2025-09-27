import { logger } from "../utils/logger";

describe("Logger Utility", () => {
  beforeEach(() => {
    // Mock console methods to avoid actual logging during tests
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe("logger methods", () => {
    it("should have info method", () => {
      expect(typeof logger.info).toBe("function");

      logger.info("Test info message");
      expect(console.log).toHaveBeenCalled();
    });

    it("should have error method", () => {
      expect(typeof logger.error).toBe("function");

      logger.error("Test error message");
      expect(console.error).toHaveBeenCalled();
    });

    it("should have warn method", () => {
      expect(typeof logger.warn).toBe("function");

      logger.warn("Test warn message");
      expect(console.warn).toHaveBeenCalled();
    });

    it("should handle logging with metadata", () => {
      const metadata = { userId: "123", action: "test" };

      logger.info("Test message with metadata", metadata);
      expect(console.log).toHaveBeenCalled();
    });
  });
});
