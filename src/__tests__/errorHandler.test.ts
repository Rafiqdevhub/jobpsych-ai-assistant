import { createError, asyncHandler } from "../middleware/errorHandler";
import { Request, Response, NextFunction } from "express";

describe("Error Handler Middleware", () => {
  describe("createError", () => {
    it("should create an error with default status code 500", () => {
      const error = createError("Test error");

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it("should create an error with custom status code", () => {
      const error = createError("Test error", 400);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });
  });

  describe("asyncHandler", () => {
    it("should handle successful async functions", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");
      const mockReq = {} as Request;
      const mockRes = {} as Response;
      const mockNext = jest.fn() as NextFunction;

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle rejected async functions", async () => {
      const error = new Error("Test error");
      const mockFn = jest.fn().mockRejectedValue(error);
      const mockReq = {} as Request;
      const mockRes = {} as Response;
      const mockNext = jest.fn() as NextFunction;

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
