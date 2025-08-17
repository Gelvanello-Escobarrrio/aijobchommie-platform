/**
 * Logger utility using Winston
 */

import winston from 'winston';
import { config } from '../config';

// Create logger instance
export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'aijobchommie-api'
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add file transport in production
if (config.isProduction && config.logFile) {
  logger.add(new winston.transports.File({
    filename: config.logFile,
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }));
}

export default logger;
