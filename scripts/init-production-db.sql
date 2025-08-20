-- ==========================================
--  AI JOB CHOMMIE - PRODUCTION DATABASE
-- ==========================================

-- Create production database
CREATE DATABASE aijobchommie_prod;

-- Connect to the new database
\c aijobchommie_prod;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create users and roles
CREATE ROLE aijobchommie_app LOGIN PASSWORD 'your_secure_app_password';
CREATE ROLE aijobchommie_readonly LOGIN PASSWORD 'your_secure_readonly_password';

-- Grant appropriate permissions
GRANT CONNECT ON DATABASE aijobchommie_prod TO aijobchommie_app;
GRANT CONNECT ON DATABASE aijobchommie_prod TO aijobchommie_readonly;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS jobs;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS system;

-- Grant schema permissions
GRANT USAGE, CREATE ON SCHEMA app TO aijobchommie_app;
GRANT USAGE, CREATE ON SCHEMA auth TO aijobchommie_app;
GRANT USAGE, CREATE ON SCHEMA jobs TO aijobchommie_app;
GRANT USAGE, CREATE ON SCHEMA analytics TO aijobchommie_app;
GRANT USAGE, CREATE ON SCHEMA system TO aijobchommie_app;

GRANT USAGE ON SCHEMA app TO aijobchommie_readonly;
GRANT USAGE ON SCHEMA auth TO aijobchommie_readonly;
GRANT USAGE ON SCHEMA jobs TO aijobchommie_readonly;
GRANT USAGE ON SCHEMA analytics TO aijobchommie_readonly;
GRANT USAGE ON SCHEMA system TO aijobchommie_readonly;

-- Core Tables
-- Users table
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    profile_completed BOOLEAN DEFAULT FALSE,
    subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'basic', 'premium')),
    subscription_active BOOLEAN DEFAULT FALSE,
    subscription_expires_at TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'
);

-- User profiles
CREATE TABLE app.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_file_url TEXT,
    skills TEXT[],
    experience_level TEXT CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'executive')),
    education_level TEXT,
    preferred_locations TEXT[],
    preferred_job_types TEXT[],
    salary_expectation_min INTEGER,
    salary_expectation_max INTEGER,
    availability TEXT DEFAULT 'immediately',
    bio TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies
CREATE TABLE app.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    logo_url TEXT,
    industry TEXT,
    size_category TEXT CHECK (size_category IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    location TEXT,
    email TEXT,
    phone TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs.job_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES app.companies(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    benefits TEXT[],
    location TEXT NOT NULL,
    job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'temporary')),
    category TEXT NOT NULL,
    experience_level TEXT CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'executive')),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'ZAR',
    urgent_hire BOOLEAN DEFAULT FALSE,
    remote_allowed BOOLEAN DEFAULT FALSE,
    application_deadline DATE,
    external_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed', 'expired')),
    featured BOOLEAN DEFAULT FALSE,
    application_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    source TEXT DEFAULT 'direct',
    source_id TEXT,
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Job applications
CREATE TABLE jobs.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs.job_listings(id),
    user_id UUID REFERENCES auth.users(id),
    cover_letter TEXT,
    cv_file_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'accepted', 'rejected', 'withdrawn')),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    UNIQUE(job_id, user_id)
);

-- Subscriptions
CREATE TABLE app.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'past_due')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    paystack_subscription_code TEXT,
    paystack_customer_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE app.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    subscription_id UUID REFERENCES app.subscriptions(id),
    paystack_transaction_reference TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'ZAR',
    status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
    payment_method TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- System logs
CREATE TABLE system.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics
CREATE TABLE analytics.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    page_views INTEGER DEFAULT 0,
    duration_seconds INTEGER
);

CREATE TABLE analytics.job_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs.job_listings(id),
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    ip_address INET,
    referrer TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_subscription ON auth.users(subscription_type, subscription_active);
CREATE INDEX idx_users_created_at ON auth.users(created_at);

CREATE INDEX idx_job_listings_location ON jobs.job_listings(location);
CREATE INDEX idx_job_listings_category ON jobs.job_listings(category);
CREATE INDEX idx_job_listings_experience ON jobs.job_listings(experience_level);
CREATE INDEX idx_job_listings_status ON jobs.job_listings(status);
CREATE INDEX idx_job_listings_created ON jobs.job_listings(created_at DESC);
CREATE INDEX idx_job_listings_urgent ON jobs.job_listings(urgent_hire) WHERE urgent_hire = true;
CREATE INDEX idx_job_listings_search ON jobs.job_listings USING GIN (to_tsvector('english', title || ' ' || description));

CREATE INDEX idx_applications_user ON jobs.applications(user_id);
CREATE INDEX idx_applications_job ON jobs.applications(job_id);
CREATE INDEX idx_applications_status ON jobs.applications(status);
CREATE INDEX idx_applications_applied ON jobs.applications(applied_at DESC);

CREATE INDEX idx_subscriptions_user ON app.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON app.subscriptions(status);
CREATE INDEX idx_subscriptions_period ON app.subscriptions(current_period_end);

CREATE INDEX idx_transactions_user ON app.payment_transactions(user_id);
CREATE INDEX idx_transactions_reference ON app.payment_transactions(paystack_transaction_reference);
CREATE INDEX idx_transactions_created ON app.payment_transactions(created_at DESC);

CREATE INDEX idx_activity_logs_user ON system.activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON system.activity_logs(action);
CREATE INDEX idx_activity_logs_created ON system.activity_logs(created_at DESC);

CREATE INDEX idx_job_views_job ON analytics.job_views(job_id);
CREATE INDEX idx_job_views_user ON analytics.job_views(user_id);
CREATE INDEX idx_job_views_date ON analytics.job_views(viewed_at DESC);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON app.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON app.companies
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs.job_listings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON app.subscriptions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Grant table permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA jobs TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA system TO aijobchommie_app;

GRANT SELECT ON ALL TABLES IN SCHEMA app TO aijobchommie_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO aijobchommie_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA jobs TO aijobchommie_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO aijobchommie_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA system TO aijobchommie_readonly;

-- Grant sequence permissions
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA app TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA jobs TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA analytics TO aijobchommie_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA system TO aijobchommie_app;

-- Row Level Security (RLS) policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs.applications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON auth.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY profiles_own_data ON app.user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY applications_own_data ON jobs.applications
    FOR ALL USING (auth.uid() = user_id);

-- Public access to job listings
CREATE POLICY jobs_public_read ON jobs.job_listings
    FOR SELECT USING (status = 'active');

-- Initialize with some default data
INSERT INTO app.companies (name, description, industry, location, verified) VALUES
('AI Job Chommie', 'AI-powered job search platform for South Africa', 'Technology', 'Port Elizabeth, Eastern Cape', true),
('Sample Company 1', 'Leading retail company in South Africa', 'Retail', 'Johannesburg, Gauteng', true),
('Sample Company 2', 'Manufacturing and logistics company', 'Manufacturing', 'Cape Town, Western Cape', true);

-- Insert sample job categories for the platform
INSERT INTO jobs.job_listings (
    company_id, 
    title, 
    description, 
    location, 
    job_type, 
    category, 
    experience_level, 
    salary_min, 
    salary_max,
    urgent_hire,
    requirements,
    benefits
) VALUES
(
    (SELECT id FROM app.companies WHERE name = 'Sample Company 1' LIMIT 1),
    'General Worker - Entry Level',
    'We are looking for reliable general workers to join our team. No experience required - full training provided.',
    'Johannesburg, Gauteng',
    'full-time',
    'General Labor',
    'entry',
    8000,
    12000,
    true,
    ARRAY['Reliable and punctual', 'Physically fit', 'Willingness to learn'],
    ARRAY['Medical aid contribution', 'Transport allowance', 'Skills development']
),
(
    (SELECT id FROM app.companies WHERE name = 'Sample Company 2' LIMIT 1),
    'Cleaner - Immediate Start',
    'Cleaning position available for shopping center. Flexible hours and immediate start available.',
    'Cape Town, Western Cape',
    'part-time',
    'Cleaning',
    'entry',
    6000,
    9000,
    true,
    ARRAY['Previous cleaning experience preferred', 'Own transport'],
    ARRAY['Flexible working hours', 'Weekly pay']
);

-- Create admin user (password: Admin123!)
-- Note: In production, change this password immediately
INSERT INTO auth.users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    subscription_type, 
    subscription_active,
    email_verified,
    is_active
) VALUES (
    'admin@aijobchommie.co.za',
    '$2b$10$rQpjWkXvV3YfzXk8c8oWUeHxhOyJ7.mE1qJ8zE2vQnJ8fT2E9.C8O', -- Hash of 'Admin123!'
    'System',
    'Administrator',
    'premium',
    true,
    true,
    true
);

-- Final setup
ANALYZE;
