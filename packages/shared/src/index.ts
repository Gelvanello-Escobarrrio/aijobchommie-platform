/**
 * AI Job Chommie Shared Package
 * Main entry point for shared types, utilities, constants, and components
 */

// Export all types
export * from './types';

// Export all utilities
export * from './utils';

// Export all constants
export * from './constants';

// Export schemas (if they exist)
// Export schemas under a namespace to avoid colliding top-level type names
export * as schemas from './schemas';

// Re-export most commonly used items for convenience
export type {
  User,
  Job,
  Company,
  JobApplication,
  ApiResponse,
  ApiError,
  UploadedFile,
  Notification
} from './types';

// Payment-related types are defined in the payment module; re-export them explicitly
export type { Subscription, PaystackTransaction } from './types/payment';

export {
  // Validation utilities
  isValidEmail,
  isValidSAPhoneNumber,
  validatePasswordStrength,
  validateResumeFile,
  validateImageFile,
  
  // Date utilities
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getSATime,
  calculateAge,
  
  // String utilities
  capitalize,
  toTitleCase,
  generateSlug,
  truncate,
  getInitials,
  formatCurrency,
  formatNumber,
  sanitizeInput,
  
  // Array utilities
  unique,
  groupBy,
  sortBy,
  paginate,
  chunk,
  
  // API utilities
  createSuccessResponse,
  createErrorResponse,
  buildQueryString,
  buildApiUrl
} from './utils';

export {
  // App constants
  APP_NAME,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  SUBSCRIPTION_PLANS,
  
  // South Africa specific (prioritizing entry-level jobs)
  SA_PRIORITY_JOB_CATEGORIES,
  SA_IMMEDIATE_SKILLS,
  SA_SALARY_RANGES,
  SA_EDUCATION_LEVELS,
  SA_COMMON_REQUIREMENTS,
  SA_PRIORITY_FEATURES,
  SA_WAGE_STANDARDS,
  SA_EMPLOYMENT_PROGRAMS,
  SA_TRAINING_OPPORTUNITIES
} from './constants';
