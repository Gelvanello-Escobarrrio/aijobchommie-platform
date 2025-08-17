-- =====================================
-- 🔄 AI JOB CHOMMIE PLATFORM - MIGRATION SCRIPT
-- Safe migration from existing schema to enhanced version
-- Handles existing tables and adds new features incrementally
-- =====================================

-- First, let's check what tables currently exist
DO $$
BEGIN
    RAISE NOTICE 'Starting migration for AI Job Chommie Platform...';
    RAISE NOTICE 'Current timestamp: %', NOW();
END $$;

-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- 🗂️ CREATE ENUMS (IF NOT EXISTS)
-- =====================================

-- Check and create user_role enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'admin', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Check and create subscription enums
DO $$ BEGIN
    CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'canceled', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Check and create job-related enums
DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'temporary', 'internship');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM ('entry-level', 'mid-level', 'senior', 'executive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_model AS ENUM ('remote', 'on-site', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Check and create application status enum
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'draft', 'submitted', 'under_review', 'shortlisted', 
        'interview_scheduled', 'interviewed', 'offer_extended', 
        'hired', 'rejected', 'withdrawn', 'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Check and create payment enums
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'successful', 'failed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('card', 'bank_transfer', 'ussd', 'mobile_money', 'eft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Check and create file type enum
DO $$ BEGIN
    CREATE TYPE file_type AS ENUM ('resume', 'profile_image', 'cover_letter', 'certificate', 'portfolio', 'company_logo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Check and create South African provinces enum
DO $$ BEGIN
    CREATE TYPE sa_province AS ENUM (
        'Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State',
        'KwaZulu-Natal', 'North West', 'Gauteng', 'Mpumalanga', 'Limpopo'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================
-- 🔄 ALTER EXISTING TABLES
-- =====================================

-- Update users table with new columns (if they don't exist)
DO $$ 
BEGIN
    -- Add new columns to users table if they don't exist
    BEGIN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN profile_image TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN date_of_birth DATE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN location VARCHAR(255);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN province sa_province;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN city VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN role user_role DEFAULT 'job_seeker';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN subscription_plan subscription_plan DEFAULT 'free';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN subscription_status subscription_status DEFAULT 'active';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN paystack_customer_id VARCHAR(255);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN metadata JSONB DEFAULT '{}';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN last_login_at TIMESTAMPTZ;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMPTZ;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;

    RAISE NOTICE 'Updated users table with new columns';
END $$;

-- Update jobs table with new columns
DO $$ 
BEGIN
    -- Add new columns to jobs table if they don't exist
    BEGIN
        ALTER TABLE jobs ADD COLUMN slug VARCHAR(200);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE SET NULL;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN company_logo TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN province sa_province;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN city VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN address TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN requirements JSONB DEFAULT '[]';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN responsibilities JSONB DEFAULT '[]';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN benefits JSONB DEFAULT '[]';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN qualifications JSONB DEFAULT '[]';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN salary_period VARCHAR(20) DEFAULT 'monthly';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN work_model work_model DEFAULT 'on-site';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN experience_level experience_level DEFAULT 'entry-level';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN education_level VARCHAR(50);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN subcategory VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN industry VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN working_hours VARCHAR(255);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN contact_phone VARCHAR(20);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN contact_person VARCHAR(200);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN application_method VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN application_url TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN application_instructions TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN external_url TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN is_urgent BOOLEAN DEFAULT FALSE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN is_immediate_start BOOLEAN DEFAULT FALSE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN no_experience_required BOOLEAN DEFAULT FALSE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN allows_applications BOOLEAN DEFAULT TRUE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN view_count INTEGER DEFAULT 0;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN application_count INTEGER DEFAULT 0;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN ai_tags JSONB DEFAULT '[]';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN ai_score DECIMAL(3,2);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN search_vector TSVECTOR;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN tags JSONB DEFAULT '[]';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN source VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN source_url TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN posted_by UUID REFERENCES users(id);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE jobs ADD COLUMN posted_at TIMESTAMPTZ DEFAULT NOW();
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;

    RAISE NOTICE 'Updated jobs table with new columns';
END $$;

-- =====================================
-- 📊 CREATE NEW TABLES (IF NOT EXISTS)
-- =====================================

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    logo TEXT,
    website VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province sa_province,
    industry VARCHAR(100) NOT NULL,
    company_size VARCHAR(20),
    founded INTEGER,
    culture JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    social_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    skills JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    preferred_job_types JSONB DEFAULT '[]',
    preferred_locations JSONB DEFAULT '[]',
    expected_salary_min INTEGER,
    expected_salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'ZAR',
    ai_match_score DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create refresh_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create file_uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type file_type NOT NULL,
    is_processed BOOLEAN DEFAULT FALSE,
    processed_data JSONB DEFAULT '{}',
    processing_status VARCHAR(50) DEFAULT 'pending',
    processing_error TEXT,
    ai_extracted_skills JSONB DEFAULT '[]',
    ai_extracted_experience JSONB DEFAULT '{}',
    ai_compatibility_score DECIMAL(3,2),
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    access_token VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_searches table if it doesn't exist
CREATE TABLE IF NOT EXISTS job_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query VARCHAR(500),
    location VARCHAR(255),
    province sa_province,
    category VARCHAR(100),
    job_type job_type,
    experience_level experience_level,
    salary_min INTEGER,
    salary_max INTEGER,
    filters JSONB DEFAULT '{}',
    results_count INTEGER DEFAULT 0,
    results_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS job_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    query VARCHAR(500),
    location VARCHAR(255),
    province sa_province,
    category VARCHAR(100),
    job_type job_type,
    experience_level experience_level,
    salary_min INTEGER,
    salary_max INTEGER,
    filters JSONB DEFAULT '{}',
    frequency VARCHAR(20) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    jobs_found_count INTEGER DEFAULT 0,
    total_notifications_sent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    to_email VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template VARCHAR(100),
    status VARCHAR(20) DEFAULT 'sent',
    provider VARCHAR(50),
    provider_id VARCHAR(255),
    error_message TEXT,
    html_content TEXT,
    text_content TEXT,
    metadata JSONB DEFAULT '{}',
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sms_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS sms_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    to_phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent',
    provider VARCHAR(50),
    provider_id VARCHAR(255),
    cost_amount DECIMAL(8,4),
    cost_currency VARCHAR(10) DEFAULT 'ZAR',
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jobs_viewed_count INTEGER DEFAULT 0,
    jobs_applied_count INTEGER DEFAULT 0,
    jobs_saved_count INTEGER DEFAULT 0,
    searches_performed_count INTEGER DEFAULT 0,
    profile_views_count INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    total_session_time INTEGER DEFAULT 0,
    average_session_time DECIMAL(8,2),
    bounce_rate DECIMAL(5,2),
    ai_recommended_jobs_count INTEGER DEFAULT 0,
    ai_match_accuracy DECIMAL(3,2),
    preferred_categories JSONB DEFAULT '[]',
    job_search_patterns JSONB DEFAULT '{}',
    period_type VARCHAR(20) DEFAULT 'all_time',
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    notes TEXT,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- =====================================
-- 🔄 UPDATE EXISTING APPLICATION TABLES
-- =====================================

-- Update applications table (rename from applications to job_applications if needed)
DO $$ 
BEGIN
    -- Check if applications table exists and job_applications doesn't
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'applications') 
       AND NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_applications') THEN
        
        -- Rename applications to job_applications
        ALTER TABLE applications RENAME TO job_applications;
        RAISE NOTICE 'Renamed applications table to job_applications';
        
    END IF;
END $$;

-- Add new columns to job_applications if they don't exist
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE job_applications ADD COLUMN applicant_name VARCHAR(200);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN applicant_email VARCHAR(255);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN applicant_phone VARCHAR(20);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN portfolio_url TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN expected_salary INTEGER;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN availability_date DATE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN custom_answers JSONB DEFAULT '{}';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN tracking_number VARCHAR(50) UNIQUE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN ai_match_score DECIMAL(3,2);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN ai_analysis JSONB DEFAULT '{}';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN skills_match DECIMAL(3,2);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN experience_match DECIMAL(3,2);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN employer_notes TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN interview_date TIMESTAMPTZ;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN interview_type VARCHAR(20);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN interview_notes TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN feedback_comments TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN applied_at TIMESTAMPTZ DEFAULT NOW();
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE job_applications ADD COLUMN reviewed_by UUID REFERENCES users(id);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;

    RAISE NOTICE 'Updated job_applications table with new columns';
END $$;

-- Update payments table (rename from payments if needed and add columns)
DO $$ 
BEGIN
    -- Add new columns to payments table if they don't exist
    BEGIN
        ALTER TABLE payments ADD COLUMN payment_method payment_method;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN paystack_reference VARCHAR(255) UNIQUE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN paystack_transaction_id VARCHAR(255);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN paystack_authorization_code VARCHAR(255);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN paystack_customer_code VARCHAR(255);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN subscription_plan subscription_plan;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN subscription_period INTEGER;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN subscription_start_date DATE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN subscription_end_date DATE;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN description TEXT;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN invoice_number VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN metadata JSONB DEFAULT '{}';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
    
    BEGIN
        ALTER TABLE payments ADD COLUMN paid_at TIMESTAMPTZ;
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;

    RAISE NOTICE 'Updated payments table with new columns';
END $$;

-- =====================================
-- 🔗 CREATE INDEXES FOR PERFORMANCE
-- =====================================

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_province ON users(province);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Jobs indexes (critical for performance)
CREATE INDEX IF NOT EXISTS idx_jobs_title_gin ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_gin ON jobs USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_province ON jobs(province);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_range ON jobs(salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);

-- Job applications indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_tracking_number ON job_applications(tracking_number);

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_province ON companies(province);
CREATE INDEX IF NOT EXISTS idx_companies_is_verified ON companies(is_verified);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_paystack_reference ON payments(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- =====================================
-- 🔄 CREATE FUNCTIONS AND TRIGGERS
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at (drop existing first to avoid conflicts)
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
    CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
    CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
    CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
    CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_file_uploads_updated_at ON file_uploads;
    CREATE TRIGGER update_file_uploads_updated_at BEFORE UPDATE ON file_uploads
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_job_alerts_updated_at ON job_alerts;
    CREATE TRIGGER update_job_alerts_updated_at BEFORE UPDATE ON job_alerts
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    RAISE NOTICE 'Created/updated all triggers for updated_at columns';
END $$;

-- Function to automatically update job search vector
CREATE OR REPLACE FUNCTION update_job_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.title, '') || ' ' || 
    COALESCE(NEW.company, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' || 
    COALESCE(NEW.location, '') || ' ' ||
    CASE 
        WHEN NEW.requirements IS NOT NULL THEN
            COALESCE(array_to_string(
                ARRAY(SELECT jsonb_array_elements_text(NEW.requirements)), ' '
            ), '')
        ELSE ''
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create job search vector trigger
DO $$
BEGIN
    DROP TRIGGER IF EXISTS update_jobs_search_vector ON jobs;
    CREATE TRIGGER update_jobs_search_vector 
        BEFORE INSERT OR UPDATE ON jobs
        FOR EACH ROW EXECUTE FUNCTION update_job_search_vector();
    
    RAISE NOTICE 'Created job search vector trigger';
END $$;

-- Function to generate unique tracking numbers
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := 'AJC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
      LPAD(NEXTVAL('tracking_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for tracking numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS tracking_number_seq START 1;

-- Create tracking number trigger
DO $$
BEGIN
    DROP TRIGGER IF EXISTS generate_job_application_tracking_number ON job_applications;
    CREATE TRIGGER generate_job_application_tracking_number 
        BEFORE INSERT ON job_applications
        FOR EACH ROW EXECUTE FUNCTION generate_tracking_number();
    
    RAISE NOTICE 'Created tracking number generation trigger';
END $$;

-- Function to automatically update job application counts
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET application_count = COALESCE(application_count, 0) + 1 
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET application_count = GREATEST(COALESCE(application_count, 0) - 1, 0) 
    WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create application count trigger
DO $$
BEGIN
    DROP TRIGGER IF EXISTS update_job_application_count_trigger ON job_applications;
    CREATE TRIGGER update_job_application_count_trigger
        AFTER INSERT OR DELETE ON job_applications
        FOR EACH ROW EXECUTE FUNCTION update_job_application_count();
    
    RAISE NOTICE 'Created job application count trigger';
END $$;

-- =====================================
-- 📊 CREATE VIEWS FOR COMMON QUERIES
-- =====================================

-- Drop existing views to avoid conflicts
DROP VIEW IF EXISTS active_jobs_with_company;
DROP VIEW IF EXISTS user_application_stats;
DROP VIEW IF EXISTS job_posting_stats;

-- Active jobs with company information
CREATE VIEW active_jobs_with_company AS
SELECT 
  j.*,
  c.logo as company_logo_url,
  c.industry as company_industry,
  c.company_size,
  c.is_verified as company_verified
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id
WHERE j.is_active = true 
  AND (j.expires_at IS NULL OR j.expires_at > NOW());

-- User application statistics
CREATE VIEW user_application_stats AS
SELECT 
  user_id,
  COUNT(*) as total_applications,
  COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_count,
  COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_count,
  COUNT(CASE WHEN status = 'shortlisted' THEN 1 END) as shortlisted_count,
  COUNT(CASE WHEN status = 'interviewed' THEN 1 END) as interviewed_count,
  COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired_count,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
  AVG(ai_match_score) as avg_match_score
FROM job_applications
WHERE user_id IS NOT NULL
GROUP BY user_id;

-- Job posting statistics for employers
CREATE VIEW job_posting_stats AS
SELECT 
  posted_by as employer_id,
  COUNT(*) as total_jobs_posted,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_jobs,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_jobs,
  SUM(COALESCE(application_count, 0)) as total_applications_received,
  AVG(COALESCE(application_count, 0)) as avg_applications_per_job,
  SUM(COALESCE(view_count, 0)) as total_views
FROM jobs
WHERE posted_by IS NOT NULL
GROUP BY posted_by;

-- =====================================
-- 🎯 DATA MIGRATION AND CLEANUP
-- =====================================

-- Update existing jobs with slugs if they don't have them
UPDATE jobs 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g')) 
WHERE slug IS NULL OR slug = '';

-- Update existing users with split names if needed
DO $$
BEGIN
    -- If full_name exists but first_name and last_name are null, split them
    UPDATE users 
    SET 
        first_name = SPLIT_PART(full_name, ' ', 1),
        last_name = CASE 
            WHEN ARRAY_LENGTH(STRING_TO_ARRAY(full_name, ' '), 1) > 1 
            THEN RIGHT(full_name, LENGTH(full_name) - LENGTH(SPLIT_PART(full_name, ' ', 1)) - 1)
            ELSE SPLIT_PART(full_name, ' ', 1)
        END
    WHERE (first_name IS NULL OR last_name IS NULL) 
      AND full_name IS NOT NULL 
      AND LENGTH(full_name) > 0;
    
    RAISE NOTICE 'Updated user names from full_name column';
END $$;

-- =====================================
-- ✅ MIGRATION VALIDATION
-- =====================================

-- Final validation - list all tables
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM pg_tables 
    WHERE schemaname = 'public' 
      AND tablename IN (
        'users', 'user_profiles', 'companies', 'jobs', 'job_applications',
        'payments', 'file_uploads', 'job_searches', 'job_alerts', 'email_logs',
        'sms_logs', 'user_analytics', 'saved_jobs', 'refresh_tokens'
      );
    
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📊 Total tables created/updated: %', table_count;
    RAISE NOTICE '🎯 Your AI Job Chommie Platform database is now fully enhanced!';
END $$;

-- List all tables for verification
SELECT 
    schemaname, 
    tablename,
    CASE 
        WHEN tablename IN ('users', 'jobs', 'job_applications', 'payments') 
        THEN '🔄 Updated' 
        ELSE '✨ New' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'user_profiles', 'companies', 'jobs', 'job_applications',
    'payments', 'file_uploads', 'job_searches', 'job_alerts', 'email_logs',
    'sms_logs', 'user_analytics', 'saved_jobs', 'refresh_tokens'
  )
ORDER BY tablename;
