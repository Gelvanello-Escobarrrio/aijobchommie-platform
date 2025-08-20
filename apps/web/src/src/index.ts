/**
 *  AI JOB CHOMMIE - ENTERPRISE BACKEND SERVER
 * 
 * Features:
 *  Job scraping and aggregation
 *  Paystack payment integration
 *  User authentication and management
 *  CV parsing and analysis
 *  Real-time notifications
 *  Advanced caching and performance
 *  Enterprise security
 *  Comprehensive logging
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// =====================================
//  ENTERPRISE CONFIGURATION
// =====================================

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001'),
  HOST: process.env.HOST || '0.0.0.0',
  API_VERSION: process.env.API_VERSION || 'v1',
  MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE || '50mb',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '1000'), // requests per window
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY
};

// =====================================
//  ENTERPRISE LOGGING SYSTEM
// =====================================

const createLogger = () => {
  // Create logs directory if it doesn't exist
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  );

  const logger = winston.createLogger({
    level: CONFIG.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'ai-job-chommie-api' },
    transports: [
      new winston.transports.File({ 
        filename: path.join(logsDir, 'error.log'), 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      new winston.transports.File({ 
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });

  if (CONFIG.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  return logger;
};

const logger = createLogger();

// =====================================
//  MAIN APPLICATION SETUP
// =====================================

const app = express();

// Create necessary directories
const requiredDirs = ['logs', 'uploads', 'uploads/cvs', 'uploads/images', 'temp'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// =====================================
//  ENTERPRISE SECURITY MIDDLEWARE
// =====================================

// Advanced Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.paystack.co']
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Advanced CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || CONFIG.CORS_ORIGINS.includes('*') || CONFIG.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 
    'Authorization', 'Cache-Control', 'X-API-Key'
  ]
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression({ level: 6, threshold: 1024 }));

// Rate limiting
const limiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW,
  max: CONFIG.RATE_LIMIT_MAX,
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retry_after: CONFIG.RATE_LIMIT_WINDOW / 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

app.use(limiter);

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: CONFIG.MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ extended: true, limit: CONFIG.MAX_REQUEST_SIZE }));

// Request ID middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// =====================================
//  HEALTH CHECK ENDPOINTS
// =====================================

app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: CONFIG.NODE_ENV,
    version: '1.0.0',
    memory: process.memoryUsage(),
    services: {
      database: 'connected', // TODO: Add actual DB check
      cache: 'connected',     // TODO: Add actual cache check
      paystack: CONFIG.PAYSTACK_SECRET_KEY ? 'configured' : 'not_configured'
    }
  });
});

app.get('/health/ready', (req: express.Request, res: express.Response) => {
  // Readiness probe for Kubernetes
  res.status(200).json({ status: 'ready' });
});

app.get('/health/live', (req: express.Request, res: express.Response) => {
  // Liveness probe for Kubernetes
  res.status(200).json({ status: 'live' });
});

// =====================================
//  INITIALIZE SERVICES
// =====================================

import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import 'express-async-errors';

// Import routes
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import userRoutes from './routes/user';
import applicationRoutes from './routes/applications';
import paymentRoutes from './routes/payments';
import uploadRoutes from './routes/upload';

// Initialize services on startup (graceful for testing)
(async () => {
  try {
    console.log(' Initializing services...');
    
    // Try to initialize database (continue without it for testing)
    try {
      await initializeDatabase();
      console.log(' Database initialized successfully');
    } catch (error) {
      console.warn(' Database initialization failed (continuing without DB):', error.message);
    }
    
    // Try to initialize Redis (continue without it for testing)
    try {
      await initializeRedis();
      console.log(' Redis initialized successfully');
    } catch (error) {
      console.warn(' Redis initialization failed (continuing without cache):', error.message);
    }
    
    console.log(' Service initialization completed');
  } catch (error) {
    console.error(' Critical service initialization failed:', error);
    // Don't exit for testing - let the server start anyway
    console.log(' Starting server despite initialization issues...');
  }
})();

// =====================================
//  API ROUTES
// =====================================

// Mount API routes
app.use(`/api/${CONFIG.API_VERSION}/auth`, authRoutes);
app.use(`/api/${CONFIG.API_VERSION}/jobs`, jobRoutes);
app.use(`/api/${CONFIG.API_VERSION}/users`, userRoutes);
app.use(`/api/${CONFIG.API_VERSION}/applications`, applicationRoutes);
app.use(`/api/${CONFIG.API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${CONFIG.API_VERSION}/files`, uploadRoutes);

// Root endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ 
    message: 'AI Job Chommie API - Empowering South African Job Seekers',
    version: '1.0.0',
    status: 'running',
    environment: CONFIG.NODE_ENV,
    timestamp: new Date().toISOString(),
    documentation: {
      swagger: `/api/${CONFIG.API_VERSION}/docs`,
      postman: 'https://documenter.getpostman.com/view/aijobchommie'
    },
    endpoints: {
      health: '/health',
      auth: {
        register: `POST /api/${CONFIG.API_VERSION}/auth/register`,
        login: `POST /api/${CONFIG.API_VERSION}/auth/login`,
        refresh: `POST /api/${CONFIG.API_VERSION}/auth/refresh`,
        logout: `POST /api/${CONFIG.API_VERSION}/auth/logout`,
        profile: `GET /api/${CONFIG.API_VERSION}/auth/me`
      },
      jobs: {
        list: `GET /api/${CONFIG.API_VERSION}/jobs`,
        create: `POST /api/${CONFIG.API_VERSION}/jobs`,
        details: `GET /api/${CONFIG.API_VERSION}/jobs/:id`,
        update: `PUT /api/${CONFIG.API_VERSION}/jobs/:id`,
        delete: `DELETE /api/${CONFIG.API_VERSION}/jobs/:id`,
        categories: `GET /api/${CONFIG.API_VERSION}/jobs/categories/list`,
        stats: `GET /api/${CONFIG.API_VERSION}/jobs/stats/overview`
      },
      applications: {
        submit: `POST /api/${CONFIG.API_VERSION}/applications`,
        list: `GET /api/${CONFIG.API_VERSION}/applications`,
        details: `GET /api/${CONFIG.API_VERSION}/applications/:id`,
        update: `PUT /api/${CONFIG.API_VERSION}/applications/:id`
      },
      files: {
        upload: `POST /api/${CONFIG.API_VERSION}/files/upload`,
        download: `GET /api/${CONFIG.API_VERSION}/files/download/:id`,
        list: `GET /api/${CONFIG.API_VERSION}/files`,
        delete: `DELETE /api/${CONFIG.API_VERSION}/files/:id`
      },
      payments: {
        initialize: `POST /api/${CONFIG.API_VERSION}/payments/initialize`,
        verify: `POST /api/${CONFIG.API_VERSION}/payments/verify`,
        webhook: `POST /api/${CONFIG.API_VERSION}/payments/webhook`
      }
    }
  });
});

// Mock entry-level jobs endpoint (enhanced version)
app.get(`/api/${CONFIG.API_VERSION}/entry-level/jobs`, (req: express.Request, res: express.Response) => {
  // Enhanced mock job data
  const mockJobs = [
    {
      id: '1',
      title: 'General Worker',
      company: 'Pick n Pay Distribution Centre',
      location: 'Cape Town, Western Cape',
      salary: { min: 3500, max: 4200, currency: 'ZAR' },
      type: 'Full-time',
      category: 'General Labour',
      urgentHiring: true,
      immediateStart: true,
      noExperienceRequired: true,
      description: 'We are looking for reliable general workers to join our distribution team. Duties include packing, sorting, and basic warehouse operations. No previous experience required - full training provided.',
      requirements: [
        'Matric certificate preferred but not essential',
        'Physically fit and able to lift up to 25kg',
        'Available to work shifts including weekends',
        'Reliable transport to Montague Gardens area',
        'Good attitude and willingness to learn'
      ],
      benefits: [
        'Medical aid contribution after 6 months',
        'Annual bonus based on performance',
        'Overtime opportunities available',
        'On-the-job training provided',
        'Career advancement opportunities'
      ],
      contactPhone: '+27-21-555-1234',
      applicationMethod: 'Apply online or call',
      address: 'Montague Gardens, Cape Town',
      workingHours: 'Monday to Saturday, 7AM - 4PM (rotating shifts)',
      postedAt: new Date('2024-01-15'),
      tags: ['entry-level', 'no-experience', 'warehouse', 'cape-town', 'immediate-start'],
      featured: true,
      verified: true
    },
    {
      id: '2',
      title: 'Cleaning Assistant',
      company: 'CleanCorp Services',
      location: 'Johannesburg, Gauteng',
      salary: { min: 3000, max: 3800, currency: 'ZAR' },
      type: 'Full-time',
      category: 'Cleaning & Domestic',
      urgentHiring: true,
      immediateStart: false,
      noExperienceRequired: true,
      description: 'Join our professional cleaning team servicing office buildings in Sandton area. We provide all equipment and training.',
      requirements: [
        'No experience required - training provided',
        'Must be reliable and punctual',
        'Able to work independently'
      ],
      benefits: [
        'Uniform and equipment provided',
        'Performance bonuses',
        'Flexible working hours available'
      ],
      contactPhone: '+27-11-555-5678',
      applicationMethod: 'WhatsApp or call',
      address: 'Sandton, Johannesburg',
      workingHours: '5AM - 1PM or 2PM - 10PM',
      postedAt: new Date('2024-01-14'),
      tags: ['cleaning', 'entry-level', 'sandton', 'flexible-hours', 'training-provided'],
      featured: false,
      verified: true
    },
    {
      id: '3',
      title: 'Kitchen Assistant',
      company: 'Ocean Basket Restaurant',
      location: 'Durban, KwaZulu-Natal',
      salary: { min: 2800, max: 3500, currency: 'ZAR' },
      type: 'Part-time',
      category: 'Food Service',
      urgentHiring: false,
      immediateStart: true,
      noExperienceRequired: true,
      description: 'Busy restaurant looking for kitchen assistant to help with food preparation, dishwashing, and general kitchen duties.',
      requirements: [
        'No experience required',
        'Must be available weekends',
        'Energetic and able to work in fast-paced environment'
      ],
      benefits: [
        'Free meals during shifts',
        'Flexible part-time hours',
        'Learn culinary skills'
      ],
      contactPhone: '+27-31-555-9012',
      applicationMethod: 'Apply in person or call',
      address: 'Gateway Mall, Durban',
      workingHours: 'Evenings and weekends',
      postedAt: new Date('2024-01-13'),
      tags: ['food-service', 'part-time', 'durban', 'tips', 'learn-skills'],
      featured: false,
      verified: true
    }
  ];

  // Enhanced filtering
  let filteredJobs = mockJobs;
  
  if (req.query.location) {
    const location = (req.query.location as string).toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(location)
    );
  }
  
  if (req.query.category) {
    filteredJobs = filteredJobs.filter(job => 
      job.category === req.query.category
    );
  }
  
  if (req.query.urgentOnly === 'true') {
    filteredJobs = filteredJobs.filter(job => job.urgentHiring);
  }

  if (req.query.salaryMin) {
    const minSalary = parseInt(req.query.salaryMin as string);
    filteredJobs = filteredJobs.filter(job => job.salary.min >= minSalary);
  }

  res.json({
    success: true,
    data: {
      jobs: filteredJobs,
      total: filteredJobs.length,
      filters_applied: {
        location: req.query.location || null,
        category: req.query.category || null,
        urgent_only: req.query.urgentOnly === 'true',
        salary_min: req.query.salaryMin || null
      }
    },
    metadata: {
      generated_at: new Date().toISOString(),
      api_version: CONFIG.API_VERSION,
      request_id: req.id
    }
  });
});

// Enhanced quick apply endpoint
app.post(`/api/${CONFIG.API_VERSION}/quick-apply/:jobId`, (req: express.Request, res: express.Response) => {
  const { jobId } = req.params;
  const { name, phone, email, message } = req.body;
  
  // Validation
  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'Name, phone, and email are required'
    });
  }

  // Mock application processing with enhanced response
  setTimeout(() => {
    logger.info(`Job application submitted`, {
      job_id: jobId,
      applicant_email: email,
      request_id: req.id
    });

    res.json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        application_id: `APP-${Date.now()}`,
        job_id: jobId,
        applicant: { name, phone, email },
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        estimated_response_time: '2-4 hours',
        tracking_number: `TRK-${Date.now().toString(36).toUpperCase()}`
      }
    });
  }, 1000); // Simulate processing time
});

// =====================================
//  ERROR HANDLING
// =====================================

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    request_id: req.id,
    url: req.url,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: CONFIG.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    request_id: req.id
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  logger.warn('Endpoint not found', {
    url: req.originalUrl,
    method: req.method,
    request_id: req.id
  });

  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    request_id: req.id
  });
});

// =====================================
//  SERVER STARTUP
// =====================================

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  logger.info(' AI Job Chommie API Server Started!', {
    environment: CONFIG.NODE_ENV,
    port: CONFIG.PORT,
    host: CONFIG.HOST,
    version: CONFIG.API_VERSION
  });
  
  console.log(`\n AI Job Chommie API Server Running!\n`);
  console.log(` Environment: ${CONFIG.NODE_ENV}`);
  console.log(` Server: http://${CONFIG.HOST}:${CONFIG.PORT}`);
  console.log(` Health Check: http://${CONFIG.HOST}:${CONFIG.PORT}/health`);
  console.log(` Jobs API: http://${CONFIG.HOST}:${CONFIG.PORT}/api/${CONFIG.API_VERSION}/entry-level/jobs`);
  console.log(`\n Ready to empower South African job seekers!\n`);
});

export default app;

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}
