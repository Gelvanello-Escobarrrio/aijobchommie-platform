/**
 * 🏗️ DATABASE SCHEMA MODELS
 * 
 * Drizzle ORM schema definitions for PostgreSQL
 */

import { pgTable, serial, varchar, text, timestamp, boolean, integer, decimal, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// =====================================
// 👤 USERS TABLE
// =====================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  profileImage: text('profile_image'),
  dateOfBirth: timestamp('date_of_birth'),
  location: varchar('location', { length: 255 }),
  province: varchar('province', { length: 50 }),
  city: varchar('city', { length: 100 }),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  role: varchar('role', { length: 20 }).default('user'), // user, employer, admin
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('free'), // free, basic, premium
  subscriptionStatus: varchar('subscription_status', { length: 20 }).default('active'),
  paystackCustomerId: varchar('paystack_customer_id', { length: 255 }),
  metadata: jsonb('metadata'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// =====================================
// 🔑 REFRESH TOKENS TABLE
// =====================================
export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isRevoked: boolean('is_revoked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// =====================================
// 💼 JOBS TABLE
// =====================================
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  company: varchar('company', { length: 200 }).notNull(),
  companyLogo: text('company_logo'),
  location: varchar('location', { length: 255 }).notNull(),
  province: varchar('province', { length: 50 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: text('address'),
  description: text('description').notNull(),
  requirements: jsonb('requirements'), // Array of strings
  benefits: jsonb('benefits'), // Array of strings
  responsibilities: jsonb('responsibilities'), // Array of strings
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryCurrency: varchar('salary_currency', { length: 10 }).default('ZAR'),
  salaryPeriod: varchar('salary_period', { length: 20 }).default('monthly'), // hourly, daily, weekly, monthly, annually
  jobType: varchar('job_type', { length: 50 }).notNull(), // full-time, part-time, contract, temporary, internship
  category: varchar('category', { length: 100 }).notNull(),
  subcategory: varchar('subcategory', { length: 100 }),
  experienceLevel: varchar('experience_level', { length: 50 }).default('entry-level'), // entry-level, mid-level, senior
  educationLevel: varchar('education_level', { length: 50 }), // matric, diploma, degree, postgraduate
  workingHours: varchar('working_hours', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  applicationMethod: varchar('application_method', { length: 100 }), // online, email, phone, in-person
  applicationUrl: text('application_url'),
  tags: jsonb('tags'), // Array of strings for search
  isUrgent: boolean('is_urgent').default(false),
  isImmediateStart: boolean('is_immediate_start').default(false),
  noExperienceRequired: boolean('no_experience_required').default(false),
  isFeatured: boolean('is_featured').default(false),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  isRemote: boolean('is_remote').default(false),
  viewCount: integer('view_count').default(0),
  applicationCount: integer('application_count').default(0),
  source: varchar('source', { length: 100 }), // scraped, manual, api
  sourceUrl: text('source_url'),
  expiresAt: timestamp('expires_at'),
  postedAt: timestamp('posted_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// =====================================
// 📝 JOB APPLICATIONS TABLE
// =====================================
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  applicantName: varchar('applicant_name', { length: 200 }).notNull(),
  applicantEmail: varchar('applicant_email', { length: 255 }).notNull(),
  applicantPhone: varchar('applicant_phone', { length: 20 }).notNull(),
  coverLetter: text('cover_letter'),
  resumeUrl: text('resume_url'),
  status: varchar('status', { length: 20 }).default('submitted'), // submitted, reviewing, interviewed, rejected, accepted
  trackingNumber: varchar('tracking_number', { length: 50 }).notNull().unique(),
  metadata: jsonb('metadata'),
  appliedAt: timestamp('applied_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// =====================================
// 📄 USER PROFILES TABLE
// =====================================
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  bio: text('bio'),
  skills: jsonb('skills'), // Array of strings
  education: jsonb('education'), // Array of education objects
  experience: jsonb('experience'), // Array of experience objects
  languages: jsonb('languages'), // Array of language objects
  certifications: jsonb('certifications'), // Array of certification objects
  portfolioUrl: text('portfolio_url'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  websiteUrl: text('website_url'),
  isPublic: boolean('is_public').default(true),
  isAvailable: boolean('is_available').default(true),
  preferredJobTypes: jsonb('preferred_job_types'), // Array of strings
  preferredLocations: jsonb('preferred_locations'), // Array of strings
  expectedSalaryMin: integer('expected_salary_min'),
  expectedSalaryMax: integer('expected_salary_max'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// =====================================
// 💳 PAYMENTS TABLE
// =====================================
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('ZAR'),
  status: varchar('status', { length: 20 }).notNull(), // pending, successful, failed, cancelled
  paymentMethod: varchar('payment_method', { length: 50 }), // card, bank_transfer, ussd, mobile_money
  paystackReference: varchar('paystack_reference', { length: 255 }).unique(),
  paystackTransactionId: varchar('paystack_transaction_id', { length: 255 }),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }),
  description: text('description'),
  metadata: jsonb('metadata'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// =====================================
// 📁 FILE UPLOADS TABLE
// =====================================
export const fileUploads = pgTable('file_uploads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // resume, profile_image, cover_letter, certificate
  isProcessed: boolean('is_processed').default(false),
  processedData: jsonb('processed_data'), // For AI-extracted content
  isPublic: boolean('is_public').default(false),
  downloadCount: integer('download_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// =====================================
// 🔍 JOB SEARCHES TABLE
// =====================================
export const jobSearches = pgTable('job_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  query: varchar('query', { length: 255 }),
  filters: jsonb('filters'), // Search filters applied
  resultsCount: integer('results_count').default(0),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// =====================================
// 📧 EMAIL LOGS TABLE
// =====================================
export const emailLogs = pgTable('email_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  toEmail: varchar('to_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  template: varchar('template', { length: 100 }),
  status: varchar('status', { length: 20 }).default('sent'), // sent, failed, pending
  metadata: jsonb('metadata'),
  sentAt: timestamp('sent_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// =====================================
// 🔗 RELATIONS
// =====================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  refreshTokens: many(refreshTokens),
  applications: many(jobApplications),
  payments: many(payments),
  fileUploads: many(fileUploads),
  searches: many(jobSearches),
  emailLogs: many(emailLogs),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [jobApplications.userId],
    references: [users.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  user: one(users, {
    fields: [fileUploads.userId],
    references: [users.id],
  }),
}));

export const jobSearchesRelations = relations(jobSearches, ({ one }) => ({
  user: one(users, {
    fields: [jobSearches.userId],
    references: [users.id],
  }),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  user: one(users, {
    fields: [emailLogs.userId],
    references: [users.id],
  }),
}));

// =====================================
// 📊 TYPES
// =====================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type FileUpload = typeof fileUploads.$inferSelect;
export type NewFileUpload = typeof fileUploads.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
