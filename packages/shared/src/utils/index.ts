/**
 * Export all utility functions from AI Job Chommie shared package
 */

// Validation utilities
export * from './validation';

// Date utilities  
export * from './date';

// String utilities
export * from './string';

// Array utilities
export * from './array';

// API utilities
export * from './api';

// Re-export commonly used utilities with aliases
export {
  isValidEmail,
  isValidSAPhoneNumber,
  validatePasswordStrength,
  isValidSAIdNumber,
  isValidUrl,
  validateResumeFile,
  validateImageFile
} from './validation';

export {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getSATime,
  isToday,
  isThisWeek,
  isThisMonth,
  calculateAge
} from './date';

export {
  capitalize,
  toTitleCase,
  generateSlug,
  truncate,
  getInitials,
  formatCurrency,
  formatNumber,
  formatFileSize,
  sanitizeInput
} from './string';

export {
  unique,
  groupBy,
  sortBy,
  paginate,
  chunk,
  shuffle,
  flatten
} from './array';

export {
  createSuccessResponse,
  createErrorResponse,
  extractErrorMessage,
  buildQueryString,
  buildApiUrl,
  sanitizeApiData
} from './api';
