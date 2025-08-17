/**
 * Export all validation schemas from AI Job Chommie shared package
 */

// User schemas
export * from './user';

// Re-export commonly used schemas
export {
  userSchema,
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  userPreferencesSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  skillsSchema,
  saIdNumberSchema,
  basicContactSchema
} from './user';
