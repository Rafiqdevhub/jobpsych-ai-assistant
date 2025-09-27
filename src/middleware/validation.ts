import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createError } from "./errorHandler";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      throw createError(`Validation error: ${errorMessage}`, 400);
    }

    next();
  };
};
