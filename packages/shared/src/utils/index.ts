/**
 * Export all utility functions from AI Job Chommie shared package
 */

// Validation utilities
export * from './validation';

// Date utilities  
export * from './date';

// String utilities
// Re-export selected string utilities to avoid name collisions (e.g., isEmpty)
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

// Array utilities
export * from './array';

// Only export api helpers once; keep the main API helpers here
export {
  createSuccessResponse,
  createErrorResponse,
  extractErrorMessage,
  buildQueryString,
  buildApiUrl,
  sanitizeApiData
} from './api';
