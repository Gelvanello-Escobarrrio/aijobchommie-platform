/**
 * Export all constants from AI Job Chommie shared package
 */

// App constants
export * from './app';

// South Africa specific constants (prioritizing entry-level opportunities)
export * from './south-africa';

// Re-export commonly used constants
export {
  APP_NAME,
  APP_VERSION,
  DEFAULT_PAGE_SIZE,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  BUSINESS_RULES,
  SUBSCRIPTION_PLANS,
  DEFAULT_VALUES,
  FEATURE_FLAGS
} from './app';

export {
  SA_PRIORITY_JOB_CATEGORIES,
  SA_IMMEDIATE_SKILLS,
  SA_SALARY_RANGES,
  SA_EDUCATION_LEVELS,
  SA_COMMON_REQUIREMENTS,
  SA_PRIORITY_FEATURES,
  SA_WAGE_STANDARDS,
  SA_EMPLOYMENT_PROGRAMS,
  SA_TRAINING_OPPORTUNITIES
} from './south-africa';
