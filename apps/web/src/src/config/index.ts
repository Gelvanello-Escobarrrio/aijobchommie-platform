/**
 * API Configuration
 * Environment-based configuration with South African context
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Configuration schema
const configSchema = z.object({
  // Server
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  corsOrigins: z.string().transform(val => val.split(',').map(origin => origin.trim())),
  
  // Database
  databaseUrl: z.string().url(),
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string(),
  supabaseServiceKey: z.string(),
  
  // Redis
  redisUrl: z.string().optional(),
  redisHost: z.string().default('localhost'),
  redisPort: z.coerce.number().default(6379),
  redisPassword: z.string().optional(),
  
  // JWT
  jwtSecret: z.string().min(32),
  jwtRefreshSecret: z.string().min(32),
  jwtAccessExpiry: z.string().default('15m'),
  jwtRefreshExpiry: z.string().default('7d'),
  
  // Email
  smtpHost: z.string(),
  smtpPort: z.coerce.number().default(587),
  smtpUser: z.string(),
  smtpPassword: z.string(),
  emailFrom: z.string().email(),
  
  // SMS (South African providers)
  smsProvider: z.enum(['clickatell', 'smsportal', 'bulksms']).default('clickatell'),
  clickatellApiKey: z.string().optional(),
  smsportalApiKey: z.string().optional(),
  bulksmsUsername: z.string().optional(),
  bulksmsPassword: z.string().optional(),
  
  // File Storage
  storageProvider: z.enum(['supabase', 'aws', 'local']).default('supabase'),
  awsRegion: z.string().optional(),
  awsAccessKeyId: z.string().optional(),
  awsSecretAccessKey: z.string().optional(),
  s3BucketName: z.string().optional(),
  
  // AI Services
  openaiApiKey: z.string().optional(),
  huggingfaceApiKey: z.string().optional(),
  
  // Payment (Paystack for South Africa)
  paystackSecretKey: z.string(),
  paystackPublicKey: z.string(),
  paystackWebhookSecret: z.string(),
  
  // Application
  appName: z.string().default('AI Job Chommie'),
  appUrl: z.string().url().default('https://aijobchommie.co.za'),
  apiUrl: z.string().url(),
  webUrl: z.string().url(),
  adminUrl: z.string().url().optional(),
  
  // South African specific
  defaultCurrency: z.string().default('ZAR'),
  defaultTimezone: z.string().default('Africa/Johannesburg'),
  defaultLanguage: z.string().default('en'),
  supportedLanguages: z.string().transform(val => val.split(',')).default('en,af,zu,xh'),
  
  // Features
  enableSmsNotifications: z.boolean().default(true),
  enableAiRecommendations: z.boolean().default(true),
  enableJobScraping: z.boolean().default(false),
  enableAnalytics: z.boolean().default(true),
  
  // Rate Limiting
  rateLimitWindowMs: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  rateLimitMax: z.coerce.number().default(500),
  authRateLimitMax: z.coerce.number().default(10),
  
  // File Limits
  maxFileSize: z.coerce.number().default(5 * 1024 * 1024), // 5MB
  maxImageSize: z.coerce.number().default(2 * 1024 * 1024), // 2MB
  
  // Job Limits for free users (entry-level focus)
  freeUserJobApplicationsPerMonth: z.coerce.number().default(20), // Increased for entry-level
  freeUserJobAlertsMax: z.coerce.number().default(5), // Increased
  freeUserAiRecommendationsPerDay: z.coerce.number().default(10), // Increased
  
  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  logFile: z.string().optional()
});

// Parse and validate environment variables
const parseConfig = () => {
  const rawConfig = {
    // Server
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173',
    
    // Database
    databaseUrl: process.env.DATABASE_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Redis
    redisUrl: process.env.REDIS_URL,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
    
    // JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY,
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY,
    
    // Email
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    emailFrom: process.env.EMAIL_FROM,
    
    // SMS
    smsProvider: process.env.SMS_PROVIDER,
    clickatellApiKey: process.env.CLICKATELL_API_KEY,
    smsportalApiKey: process.env.SMSPORTAL_API_KEY,
    bulksmsUsername: process.env.BULKSMS_USERNAME,
    bulksmsPassword: process.env.BULKSMS_PASSWORD,
    
    // File Storage
    storageProvider: process.env.STORAGE_PROVIDER,
    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketName: process.env.S3_BUCKET_NAME,
    
    // AI
    openaiApiKey: process.env.OPENAI_API_KEY,
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
    
    // Payment
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
    paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
    
    // Application URLs
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    webUrl: process.env.WEB_URL || 'http://localhost:5173',
    adminUrl: process.env.ADMIN_URL,
    
    // Features
    enableSmsNotifications: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
    enableAiRecommendations: process.env.ENABLE_AI_RECOMMENDATIONS !== 'false',
    enableJobScraping: process.env.ENABLE_JOB_SCRAPING === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
    
    // Rate Limiting
    rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: process.env.RATE_LIMIT_MAX,
    authRateLimitMax: process.env.AUTH_RATE_LIMIT_MAX,
    
    // File Limits
    maxFileSize: process.env.MAX_FILE_SIZE,
    maxImageSize: process.env.MAX_IMAGE_SIZE,
    
    // Job Limits
    freeUserJobApplicationsPerMonth: process.env.FREE_USER_JOB_APPLICATIONS_PER_MONTH,
    freeUserJobAlertsMax: process.env.FREE_USER_JOB_ALERTS_MAX,
    freeUserAiRecommendationsPerDay: process.env.FREE_USER_AI_RECOMMENDATIONS_PER_DAY,
    
    // Logging
    logLevel: process.env.LOG_LEVEL,
    logFile: process.env.LOG_FILE
  };

  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    console.error('Configuration validation failed:', error);
    process.exit(1);
  }
};

export const config = parseConfig();

// Additional computed properties
export const configExtended = {
  ...config,
  
  // Environment booleans
  isDevelopment: config.nodeEnv === 'development',
  isProduction: config.nodeEnv === 'production',
  isTest: config.nodeEnv === 'test',
  
  // Database connection options
  dbConfig: {
    connectionString: config.databaseUrl,
    ssl: config.isProduction ? { rejectUnauthorized: false } : false
  },
  
  // Redis connection options
  redisConfig: config.redisUrl ? {
    url: config.redisUrl
  } : {
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true
  },
  
  // SMTP configuration
  smtpConfig: {
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  },
  
  // South African specific settings
  saSettings: {
    currency: 'ZAR',
    timezone: 'Africa/Johannesburg',
    locale: 'en-ZA',
    countryCode: 'ZA',
    phonePrefix: '+27',
    minimumWage: 4558, // R4,558 per month as of 2024
    
    // Priority job categories for entry-level
    priorityJobCategories: [
      'general_labour',
      'cleaning_domestic',
      'security_safety',
      'food_service',
      'transport_delivery',
      'retail_customer_service'
    ],
    
    // SMS settings for South Africa
    smsSettings: {
      maxLength: 160,
      sender: 'JobChommie',
      timezone: 'Africa/Johannesburg',
      allowedHours: {
        start: 8, // 8 AM
        end: 20   // 8 PM
      }
    }
  }
};

export default configExtended;
