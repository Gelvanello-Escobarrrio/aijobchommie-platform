/**
 * 🔧 ENVIRONMENT CONFIGURATION VALIDATION
 * 
 * Validates and provides type-safe access to environment variables
 */

import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  // Core Application
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  API_VERSION: z.string().default('v1'),

  // Database
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().transform((val) => parseInt(val, 10)).default('0'),

  // JWT & Security
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),

  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-3.5-turbo'),
  HUGGINGFACE_API_TOKEN: z.string().optional(),
  HUGGINGFACE_MODEL: z.string().default('sentence-transformers/all-MiniLM-L6-v2'),

  // Payment (Paystack)
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),
  CURRENCY: z.string().default('ZAR'),

  // File Upload
  MAX_FILE_SIZE: z.string().transform((val) => parseInt(val, 10)).default('10485760'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/gif,application/pdf'),
  UPLOAD_PATH: z.string().default('./uploads'),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('af-south-1'),
  AWS_S3_BUCKET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.string().transform((val) => parseInt(val, 10)).default('1025'),
  SMTP_SECURE: z.string().transform((val) => val === 'true').default('false'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().default('noreply@aijobchommie.co.za'),
  FROM_NAME: z.string().default('AI Job Chommie'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform((val) => parseInt(val, 10)).default('1000'),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3002'),

  // Monitoring
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),

  // Analytics
  GA_TRACKING_ID: z.string().optional(),
  HOTJAR_ID: z.string().optional(),
  MIXPANEL_TOKEN: z.string().optional(),

  // SMS
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // Search
  ELASTICSEARCH_URL: z.string().optional(),
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_API_KEY: z.string().optional(),
});

// Validate environment variables
const validateEnv = () => {
  try {
    const env = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    if (error instanceof z.ZodError) {
      console.error('Missing or invalid environment variables:');
      error.errors.forEach(err => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

// Export validated environment
export const env = validateEnv();

// Environment-specific configurations
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isStaging = env.NODE_ENV === 'staging';

// Feature flags based on environment
export const features = {
  ai: {
    enabled: !!(env.OPENAI_API_KEY || env.HUGGINGFACE_API_TOKEN),
    openai: !!env.OPENAI_API_KEY,
    huggingface: !!env.HUGGINGFACE_API_TOKEN,
  },
  payments: {
    enabled: !!(env.PAYSTACK_PUBLIC_KEY && env.PAYSTACK_SECRET_KEY),
    paystack: !!(env.PAYSTACK_PUBLIC_KEY && env.PAYSTACK_SECRET_KEY),
  },
  storage: {
    aws: !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY),
    local: true,
  },
  email: {
    enabled: !!(env.SMTP_HOST && env.FROM_EMAIL),
    smtp: !!(env.SMTP_HOST && env.FROM_EMAIL),
  },
  sms: {
    enabled: !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN),
    twilio: !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN),
  },
  search: {
    elasticsearch: !!env.ELASTICSEARCH_URL,
    algolia: !!(env.ALGOLIA_APP_ID && env.ALGOLIA_API_KEY),
  },
  monitoring: {
    sentry: !!env.SENTRY_DSN,
    analytics: !!(env.GA_TRACKING_ID || env.MIXPANEL_TOKEN || env.HOTJAR_ID),
  },
};

// Log enabled features
export const logEnabledFeatures = () => {
  console.log('🚀 Enabled Features:');
  Object.entries(features).forEach(([category, categoryFeatures]) => {
    const enabled = Object.entries(categoryFeatures)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([feature, _]) => feature);
    
    if (enabled.length > 0) {
      console.log(`  ${category}: ${enabled.join(', ')}`);
    }
  });
};
