import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  (res as any).status(status).json({
    success: false,
    error: message,
  });
};
