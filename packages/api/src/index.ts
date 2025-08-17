/**
 * AI Job Chommie API
 * Main entry point - Express server focused on entry-level job opportunities
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import 'express-async-errors';

import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import uploadRoutes from './routes/upload';
import searchRoutes from './routes/search';
import notificationRoutes from './routes/notifications';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import healthRoutes from './routes/health';

// Priority routes for entry-level jobs
import entryLevelRoutes from './routes/entry-level';
import quickApplyRoutes from './routes/quick-apply';
import smsRoutes from './routes/sms';

const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan(config.isDevelopment ? 'dev' : 'combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Rate limiting - more lenient for entry-level job seekers
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.isDevelopment ? 1000 : 500, // Higher limit for job searching
  message: {
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many login attempts, please try again later'
  },
  skipSuccessfulRequests: true
});

// Speed limiting for heavy operations
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500,
  maxDelayMs: 20000
});

app.use(generalLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/upload', speedLimiter);

// Health check (no rate limiting)
app.use('/health', healthRoutes);
app.use('/api/v1/health', healthRoutes);

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);

// Priority routes for entry-level job seekers
app.use('/api/v1/entry-level', entryLevelRoutes);
app.use('/api/v1/quick-apply', quickApplyRoutes);
app.use('/api/v1/sms', smsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Job Chommie API - Connecting South Africans with Entry-Level Opportunities',
    version: '1.0.0',
    status: 'operational',
    features: [
      'Entry-level job search',
      'Quick apply functionality',
      'SMS job alerts',
      'Multi-language support',
      'Transport-aware matching',
      'Skills-based recommendations'
    ],
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      jobs: '/api/v1/jobs',
      entryLevel: '/api/v1/entry-level',
      quickApply: '/api/v1/quick-apply'
    }
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'AI Job Chommie API',
    version: '1.0.0',
    description: 'REST API for AI-powered job search platform focused on entry-level opportunities in South Africa',
    documentation: '/api/v1/docs',
    support: {
      email: 'support@aijobchommie.co.za',
      phone: '+27-11-xxx-xxxx',
      whatsapp: '+27-xx-xxx-xxxx'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;
const server = app.listen(PORT, () => {
  logger.info(`🚀 AI Job Chommie API server running on port ${PORT}`);
  logger.info(`📱 Environment: ${config.nodeEnv}`);
  logger.info(`🎯 Focus: Entry-level jobs for South African job seekers`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

export default app;
