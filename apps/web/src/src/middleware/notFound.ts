/**
 * 404 Not Found middleware
 */

import { Request, Response } from 'express';
import { createErrorResponse } from '@aijobchommie/shared';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json(createErrorResponse({
    code: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404
  }));
};
