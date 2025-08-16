// Export all type definitions
export * from './user';
export * from './job';
export * from './payment';
export * from './api';

// Re-export commonly used types with aliases for convenience
export type {
  User as UserType,
  Job as JobType,
  Company as CompanyType,
  JobApplication as ApplicationType,
  Subscription as SubscriptionType,
  PaystackTransaction as TransactionType,
  ApiResponse as APIResponse
} from './user';

export type {
  Job,
  Company,
  JobApplication
} from './job';

export type {
  PaystackTransaction,
  Subscription,
  PaymentStatus
} from './payment';

export type {
  ApiResponse,
  ApiError,
  UploadedFile,
  Notification
} from './api';
