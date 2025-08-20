/**
 *  COMPREHENSIVE LOGGING UTILITY
 * 
 * Enterprise-grade logging with Winston, including:
 * - Structured logging with metadata
 * - Multiple transports (console, file, external)
 * - Log rotation and compression
 * - Performance metrics
 * - Error tracking integration
 */

import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Import environment configuration
try {
  // Try to import from env-validation if it exists
  const envConfig = require('../config/env-validation');
  var env = envConfig.env;
  var isDevelopment = envConfig.isDevelopment;
  var isProduction = envConfig.isProduction;
} catch {
  // Fallback to process.env if env-validation doesn't exist
  var env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
  };
  var isDevelopment = env.NODE_ENV === 'development';
  var isProduction = env.NODE_ENV === 'production';
}

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, requestId, userId, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}] [${service || 'api'}]`;
    
    if (requestId) log += ` [${requestId}]`;
    if (userId) log += ` [user:${userId}]`;
    
    log += ` ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, service, requestId, ...meta }) => {
    let log = `${timestamp} ${level} [${service || 'api'}]`;
    
    if (requestId) log += ` [${requestId}]`;
    
    log += ` ${message}`;
    
    return log;
  })
);

// Create base logger configuration
const transports: winston.transport[] = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    level: isDevelopment ? 'debug' : 'info',
    format: isDevelopment ? consoleFormat : logFormat
  })
);

// File transports for production
if (isProduction || process.env.ENABLE_FILE_LOGGING === 'true') {
  // Error log file
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat
    })
  );

  // Access log file for HTTP requests
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'access-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'http',
      format: logFormat
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'aijobchommie-api',
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  },
  transports,
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ],
  exitOnError: false
});

// Enhanced logging methods
export const logWithContext = {
  // HTTP request logging
  request: (req: any, message?: string, meta?: object) => {
    logger.http(message || 'HTTP Request', {
      method: req.method,
      url: req.url,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      requestId: req.id,
      userId: req.user?.id,
      ...meta
    });
  },

  // Database operation logging
  database: (operation: string, table: string, meta?: object) => {
    logger.debug(`Database ${operation}`, {
      operation,
      table,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  // Authentication logging
  auth: (action: string, userId?: string, meta?: object) => {
    logger.info(`Auth ${action}`, {
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  // Payment logging
  payment: (action: string, amount?: number, currency?: string, meta?: object) => {
    logger.info(`Payment ${action}`, {
      action,
      amount,
      currency,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  // Job application logging
  application: (action: string, jobId?: string, userId?: string, meta?: object) => {
    logger.info(`Application ${action}`, {
      action,
      jobId,
      userId,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  // AI service logging
  ai: (service: string, operation: string, meta?: object) => {
    logger.info(`AI ${service} ${operation}`, {
      service,
      operation,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  // Security logging
  security: (event: string, level: 'info' | 'warn' | 'error', meta?: object) => {
    logger[level](`Security ${event}`, {
      event,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  // Performance logging
  performance: (operation: string, duration: number, meta?: object) => {
    logger.info(`Performance ${operation}`, {
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...meta
    });
  }
};

// Performance timer utility
export const createTimer = (operation: string) => {
  const start = process.hrtime.bigint();
  
  return {
    end: (meta?: object) => {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1000000; // Convert to ms
      logWithContext.performance(operation, duration, meta);
      return duration;
    }
  };
};

// Log startup information
logger.info('Logger initialized', {
  level: env.LOG_LEVEL || 'info',
  environment: env.NODE_ENV,
  logsDirectory: logsDir,
  transportsCount: transports.length
});

export default logger;
