/**
 * Application constants for AI Job Chommie platform
 */

// App Information
export const APP_NAME = 'AI Job Chommie';
export const APP_DESCRIPTION = 'AI-powered job search platform for South Africa';
export const APP_VERSION = '1.0.0';
export const APP_DOMAIN = 'aijobchommie.co.za';

// API Configuration
export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 5;

// File Upload Limits
export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_COMPANY_LOGO_SIZE = 1 * 1024 * 1024; // 1MB

export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Rate Limiting
export const RATE_LIMITS = {
  GLOBAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit login attempts
  },
  SEARCH: {
    windowMs: 60 * 1000, // 1 minute
    max: 60 // 60 searches per minute
  },
  UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    max: 5 // 5 uploads per minute
  }
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
  SESSION: 15 * 60 // 15 minutes for session data
};

// JWT Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRE: '15m',
  REFRESH_TOKEN_EXPIRE: '7d',
  PASSWORD_RESET_EXPIRE: '1h',
  EMAIL_VERIFICATION_EXPIRE: '24h'
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true
  },
  EMAIL: {
    MAX_LENGTH: 320 // RFC 5321 limit
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  BIO: {
    MAX_LENGTH: 500
  },
  JOB_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100
  },
  JOB_DESCRIPTION: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 5000
  },
  SKILLS: {
    MIN_COUNT: 1,
    MAX_COUNT: 20,
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  }
};

// Business Rules
export const BUSINESS_RULES = {
  FREE_TIER: {
    MAX_APPLICATIONS_PER_MONTH: 10,
    MAX_JOB_ALERTS: 3,
    MAX_RESUME_UPLOADS: 1,
    AI_RECOMMENDATIONS_PER_DAY: 5
  },
  PREMIUM_TIER: {
    MAX_APPLICATIONS_PER_MONTH: 100,
    MAX_JOB_ALERTS: 20,
    MAX_RESUME_UPLOADS: 5,
    AI_RECOMMENDATIONS_PER_DAY: 50
  },
  ENTERPRISE_TIER: {
    MAX_APPLICATIONS_PER_MONTH: -1, // Unlimited
    MAX_JOB_ALERTS: -1, // Unlimited
    MAX_RESUME_UPLOADS: -1, // Unlimited
    AI_RECOMMENDATIONS_PER_DAY: -1 // Unlimited
  }
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'ZAR',
    interval: 'month',
    features: [
      'Basic job search',
      'Up to 10 applications per month',
      '3 job alerts',
      'Basic profile',
      'Email support'
    ]
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 299,
    currency: 'ZAR',
    interval: 'month',
    features: [
      'Advanced job search',
      'Up to 100 applications per month',
      '20 job alerts',
      'AI-powered recommendations',
      'Resume optimization',
      'Priority support',
      'Company insights'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    currency: 'ZAR',
    interval: 'month',
    features: [
      'Unlimited job applications',
      'Unlimited job alerts',
      'Advanced AI features',
      'Custom branding',
      'API access',
      'Dedicated support',
      'Analytics dashboard',
      'Team management'
    ]
  }
};

// Email Templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email-verification',
  PASSWORD_RESET: 'password-reset',
  JOB_ALERT: 'job-alert',
  APPLICATION_CONFIRMATION: 'application-confirmation',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  SUBSCRIPTION_CANCELLED: 'subscription-cancelled'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  JOB_ALERT: 'job_alert',
  APPLICATION_STATUS: 'application_status',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  SUBSCRIPTION_REMINDER: 'subscription_reminder',
  PROFILE_INCOMPLETE: 'profile_incomplete',
  NEW_MESSAGE: 'new_message',
  SYSTEM_UPDATE: 'system_update',
  SECURITY_ALERT: 'security_alert'
};

// Error Codes
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Rate Limiting
  RATE_LIMITED: 'RATE_LIMITED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // File Upload
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // Payment
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User account created successfully',
  USER_UPDATED: 'User profile updated successfully',
  EMAIL_VERIFIED: 'Email address verified successfully',
  PASSWORD_RESET: 'Password reset successfully',
  JOB_APPLIED: 'Job application submitted successfully',
  PAYMENT_COMPLETED: 'Payment completed successfully',
  SUBSCRIPTION_ACTIVATED: 'Subscription activated successfully',
  FILE_UPLOADED: 'File uploaded successfully'
};

// Default Values
export const DEFAULT_VALUES = {
  USER_ROLE: 'job_seeker' as const,
  SUBSCRIPTION_STATUS: 'free' as const,
  JOB_TYPE: 'full_time' as const,
  WORK_MODEL: 'on_site' as const,
  EXPERIENCE_LEVEL: 'mid' as const,
  CURRENCY: 'ZAR' as const,
  LOCALE: 'en-ZA' as const,
  TIMEZONE: 'Africa/Johannesburg' as const
};

// Feature Flags
export const FEATURE_FLAGS = {
  AI_RECOMMENDATIONS: true,
  ADVANCED_SEARCH: true,
  COMPANY_REVIEWS: true,
  SALARY_INSIGHTS: true,
  VIDEO_INTERVIEWS: false,
  BLOCKCHAIN_VERIFICATION: false,
  MOBILE_APP: true,
  DARK_MODE: true
};
