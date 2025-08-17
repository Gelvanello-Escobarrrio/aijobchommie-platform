-- AI Job Chommie - Initial Database Schema Migration
-- Created: 2025-01-17

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"profile_image" text,
	"date_of_birth" timestamp,
	"location" varchar(255),
	"province" varchar(50),
	"city" varchar(100),
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"role" varchar(20) DEFAULT 'user',
	"subscription_plan" varchar(50) DEFAULT 'free',
	"subscription_status" varchar(20) DEFAULT 'active',
	"paystack_customer_id" varchar(255),
	"metadata" jsonb,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_revoked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"company" varchar(200) NOT NULL,
	"company_logo" text,
	"location" varchar(255) NOT NULL,
	"province" varchar(50) NOT NULL,
	"city" varchar(100) NOT NULL,
	"address" text,
	"description" text NOT NULL,
	"requirements" jsonb,
	"benefits" jsonb,
	"responsibilities" jsonb,
	"salary_min" integer,
	"salary_max" integer,
	"salary_currency" varchar(10) DEFAULT 'ZAR',
	"salary_period" varchar(20) DEFAULT 'monthly',
	"job_type" varchar(50) NOT NULL,
	"category" varchar(100) NOT NULL,
	"subcategory" varchar(100),
	"experience_level" varchar(50) DEFAULT 'entry-level',
	"education_level" varchar(50),
	"working_hours" varchar(255),
	"contact_email" varchar(255),
	"contact_phone" varchar(20),
	"application_method" varchar(100),
	"application_url" text,
	"tags" jsonb,
	"is_urgent" boolean DEFAULT false,
	"is_immediate_start" boolean DEFAULT false,
	"no_experience_required" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_remote" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"application_count" integer DEFAULT 0,
	"source" varchar(100),
	"source_url" text,
	"expires_at" timestamp,
	"posted_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Job applications table
CREATE TABLE IF NOT EXISTS "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"user_id" uuid,
	"applicant_name" varchar(200) NOT NULL,
	"applicant_email" varchar(255) NOT NULL,
	"applicant_phone" varchar(20) NOT NULL,
	"cover_letter" text,
	"resume_url" text,
	"status" varchar(20) DEFAULT 'submitted',
	"tracking_number" varchar(50) NOT NULL,
	"metadata" jsonb,
	"applied_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "job_applications_tracking_number_unique" UNIQUE("tracking_number")
);

-- User profiles table
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bio" text,
	"skills" jsonb,
	"education" jsonb,
	"experience" jsonb,
	"languages" jsonb,
	"certifications" jsonb,
	"portfolio_url" text,
	"linkedin_url" text,
	"github_url" text,
	"website_url" text,
	"is_public" boolean DEFAULT true,
	"is_available" boolean DEFAULT true,
	"preferred_job_types" jsonb,
	"preferred_locations" jsonb,
	"expected_salary_min" integer,
	"expected_salary_max" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);

-- Payments table
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10,2) NOT NULL,
	"currency" varchar(10) DEFAULT 'ZAR',
	"status" varchar(20) NOT NULL,
	"payment_method" varchar(50),
	"paystack_reference" varchar(255),
	"paystack_transaction_id" varchar(255),
	"subscription_plan" varchar(50),
	"description" text,
	"metadata" jsonb,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_paystack_reference_unique" UNIQUE("paystack_reference")
);

-- File uploads table
CREATE TABLE IF NOT EXISTS "file_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"file_name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"is_processed" boolean DEFAULT false,
	"processed_data" jsonb,
	"is_public" boolean DEFAULT false,
	"download_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Job searches table
CREATE TABLE IF NOT EXISTS "job_searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"query" varchar(255),
	"filters" jsonb,
	"results_count" integer DEFAULT 0,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);

-- Email logs table
CREATE TABLE IF NOT EXISTS "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email_type" varchar(50) NOT NULL,
	"recipient_email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"template_used" varchar(100),
	"status" varchar(20) DEFAULT 'sent',
	"sent_at" timestamp DEFAULT now(),
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_read" boolean DEFAULT false,
	"action_url" text,
	"metadata" jsonb,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
DO $$ BEGIN
	ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "job_searches" ADD CONSTRAINT "job_searches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_users_province_city" ON "users" ("province", "city");
CREATE INDEX IF NOT EXISTS "idx_jobs_location" ON "jobs" ("province", "city");
CREATE INDEX IF NOT EXISTS "idx_jobs_category" ON "jobs" ("category", "subcategory");
CREATE INDEX IF NOT EXISTS "idx_jobs_posted_at" ON "jobs" ("posted_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_jobs_search" ON "jobs" USING gin (("title" || ' ' || "company" || ' ' || "description"));
CREATE INDEX IF NOT EXISTS "idx_jobs_active" ON "jobs" ("is_active", "expires_at");
CREATE INDEX IF NOT EXISTS "idx_job_applications_job_id" ON "job_applications" ("job_id");
CREATE INDEX IF NOT EXISTS "idx_job_applications_user_id" ON "job_applications" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_job_applications_status" ON "job_applications" ("status");
CREATE INDEX IF NOT EXISTS "idx_payments_user_id" ON "payments" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications" ("user_id", "is_read");
