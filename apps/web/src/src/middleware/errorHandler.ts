/**
 * Global error handler middleware
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createErrorResponse } from '@aijobchommie/shared';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'UnauthorizedError' || error.message === 'Unauthorized') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (error.name === 'ForbiddenError' || error.message === 'Forbidden') {
    statusCode = 403;
    message = 'Access forbidden';
  } else if (error.name === 'NotFoundError' || error.statusCode === 404) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (error.statusCode && error.statusCode < 500) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json(createErrorResponse({
    code: error.code || 'INTERNAL_ERROR',
    message: message,
    statusCode: statusCode
  }));
};
