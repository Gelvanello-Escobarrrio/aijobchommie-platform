-- =============================================
-- AI JOB CHOMMIE - COMPLETE DATABASE SCHEMA
-- Final Error-Free Version with Full Documentation
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- =============================================
-- 1. ENUM TYPES (Created First - No Dependencies)
-- =============================================

-- South African provinces
DO $$ BEGIN
    CREATE TYPE sa_province AS ENUM (
        'western_cape',     -- Western Cape
        'eastern_cape',     -- Eastern Cape  
        'northern_cape',    -- Northern Cape
        'free_state',       -- Free State
        'kwazulu_natal',    -- KwaZulu-Natal
        'north_west',       -- North West
        'gauteng',          -- Gauteng
        'mpumalanga',       -- Mpumalanga
        'limpopo'           -- Limpopo
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- User role types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'job_seeker',       -- Regular job seekers
        'employer',         -- Company representatives who post jobs
        'admin',            -- Platform administrators
        'moderator'         -- Content moderators
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Subscription plan types
DO $$ BEGIN
    CREATE TYPE subscription_plan AS ENUM (
        'free',             -- Free tier with limited features
        'basic',            -- Basic paid plan
        'premium',          -- Premium plan with advanced features
        'enterprise'        -- Enterprise plan for large companies
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Subscription status types
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM (
        'active',           -- Currently active subscription
        'inactive',         -- Subscription paused or expired
        'cancelled',        -- User cancelled subscription
        'expired',          -- Subscription expired
        'trial'             -- Free trial period
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Job type classifications
DO $$ BEGIN
    CREATE TYPE job_type AS ENUM (
        'full-time',        -- Full-time permanent position
        'part-time',        -- Part-time position
        'contract',         -- Fixed-term contract
        'temporary',        -- Temporary/seasonal work
        'internship',       -- Internship opportunity
        'freelance',        -- Freelance/consulting work
        'casual'            -- Casual/ad-hoc work
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Work arrangement models
DO $$ BEGIN
    CREATE TYPE work_model AS ENUM (
        'on-site',          -- Must work from office/location
        'remote',           -- Fully remote work
        'hybrid'            -- Mix of on-site and remote
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Experience level requirements
DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM (
        'entry-level',      -- 0-2 years experience
        'mid-level',        -- 3-5 years experience
        'senior-level',     -- 6-10 years experience
        'executive'         -- 10+ years, leadership roles
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Job application status tracking
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'submitted',        -- Application just submitted
        'under_review',     -- Being reviewed by employer
        'shortlisted',      -- Moved to shortlist
        'interviewed',      -- Interview completed
        'hired',            -- Successfully hired
        'rejected',         -- Application rejected
        'withdrawn'         -- Applicant withdrew
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Payment transaction status
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending',          -- Payment initiated but not complete
        'completed',        -- Payment successful
        'failed',           -- Payment failed
        'cancelled',        -- Payment cancelled
        'refunded'          -- Payment refunded
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- 2. CORE TABLES (Users, Companies, Jobs)
-- =============================================

-- Users table - Central user management
CREATE TABLE IF NOT EXISTS users (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Location information
    city VARCHAR(100),
    province sa_province,
    
    -- Platform role and subscription
    role user_role DEFAULT 'job_seeker' NOT NULL,
    subscription_plan subscription_plan DEFAULT 'free' NOT NULL,
    subscription_status subscription_status DEFAULT 'active' NOT NULL,
    subscription_start DATE,
    subscription_end DATE,
    
    -- Verification status
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Profile and social links
    profile_picture_url TEXT,
    bio TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    
    -- Account status and tracking
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT users_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_valid CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s\-\(\)]+$'),
    CONSTRAINT users_subscription_dates_valid CHECK (
        subscription_start IS NULL OR subscription_end IS NULL OR subscription_start <= subscription_end
    )
);

-- Companies table - Employer organizations
CREATE TABLE IF NOT EXISTS companies (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Business information
    industry VARCHAR(100),
    website VARCHAR(255),
    logo_url TEXT,
    size_range VARCHAR(50), -- e.g., "1-10", "11-50", "51-200", etc.
    founded_year INTEGER,
    
    -- Location information
    headquarters_city VARCHAR(100),
    province sa_province,
    
    -- Contact information
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    linkedin_url TEXT,
    
    -- Verification and ownership
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT companies_website_valid CHECK (website IS NULL OR website ~* '^https?://'),
    CONSTRAINT companies_email_valid CHECK (
        contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT companies_founded_year_valid CHECK (
        founded_year IS NULL OR (founded_year >= 1800 AND founded_year <= EXTRACT(YEAR FROM NOW()))
    )
);

-- Jobs table - Job postings with complete information
CREATE TABLE IF NOT EXISTS jobs (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    
    -- Salary information
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_currency VARCHAR(3) DEFAULT 'ZAR' NOT NULL,
    
    -- Job classification
    job_type job_type NOT NULL,
    work_model work_model DEFAULT 'on-site' NOT NULL,
    experience_level experience_level,
    category VARCHAR(100),           -- e.g., "Technology", "Finance", "Healthcare"
    subcategory VARCHAR(100),        -- e.g., "Software Development", "Data Analysis"
    industry VARCHAR(100),
    
    -- Skills and requirements
    skills TEXT[],                   -- Array of required/preferred skills
    education_requirements TEXT,
    
    -- Location information
    location_city VARCHAR(100),
    province sa_province,
    is_remote BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Application and external information
    application_deadline DATE,
    external_url TEXT,               -- For jobs that redirect to external sites
    
    -- Relationships
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Status and metrics
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    applications_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT jobs_salary_valid CHECK (
        salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max
    ),
    CONSTRAINT jobs_salary_positive CHECK (
        (salary_min IS NULL OR salary_min >= 0) AND (salary_max IS NULL OR salary_max >= 0)
    ),
    CONSTRAINT jobs_deadline_future CHECK (
        application_deadline IS NULL OR application_deadline >= CURRENT_DATE
    ),
    CONSTRAINT jobs_counts_non_negative CHECK (
        views_count >= 0 AND applications_count >= 0
    ),
    CONSTRAINT jobs_external_url_valid CHECK (
        external_url IS NULL OR external_url ~* '^https?://'
    )
);

-- =============================================
-- 3. USER PROFILE AND AUTHENTICATION TABLES
-- =============================================

-- Refresh tokens for authentication
CREATE TABLE IF NOT EXISTS refresh_tokens (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Token information
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Audit timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT refresh_tokens_expires_future CHECK (expires_at > NOW())
);

-- Extended user profiles for job seekers
CREATE TABLE IF NOT EXISTS user_profiles (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Career documents and information
    cv_url TEXT,
    skills TEXT[],                   -- Array of user skills
    experience_years INTEGER,
    education TEXT,                  -- Education history/qualifications
    certifications TEXT[],           -- Professional certifications
    languages TEXT[],                -- Spoken languages
    
    -- Job search preferences
    availability_status VARCHAR(50) DEFAULT 'available',
    expected_salary_min DECIMAL(12,2),
    expected_salary_max DECIMAL(12,2),
    preferred_job_types job_type[],  -- Array of preferred job types
    preferred_work_model work_model[], -- Array of preferred work models
    preferred_locations TEXT[],       -- Preferred work locations
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT user_profiles_experience_valid CHECK (
        experience_years IS NULL OR experience_years >= 0
    ),
    CONSTRAINT user_profiles_salary_valid CHECK (
        expected_salary_min IS NULL OR expected_salary_max IS NULL OR 
        expected_salary_min <= expected_salary_max
    )
);

-- =============================================
-- 4. JOB APPLICATION AND INTERACTION TABLES
-- =============================================

-- Job applications tracking
CREATE TABLE IF NOT EXISTS job_applications (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Application content
    cover_letter TEXT,
    cv_url TEXT,
    
    -- Status tracking
    status application_status DEFAULT 'submitted' NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,                      -- Employer notes on application
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Ensure one application per user per job
    UNIQUE(job_id, user_id)
);

-- Saved jobs for users
CREATE TABLE IF NOT EXISTS saved_jobs (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    
    -- Timestamp
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Ensure one save per user per job
    UNIQUE(user_id, job_id)
);

-- =============================================
-- 5. PAYMENT AND SUBSCRIPTION TABLES
-- =============================================

-- Payment transactions
CREATE TABLE IF NOT EXISTS payments (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Payment information
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR' NOT NULL,
    subscription_plan subscription_plan,
    
    -- Payment processing
    payment_method VARCHAR(50),      -- e.g., "credit_card", "payfast", "paypal"
    payment_gateway VARCHAR(50),     -- e.g., "payfast", "stripe", "paypal"
    gateway_transaction_id VARCHAR(255),
    
    -- Status and timing
    status payment_status DEFAULT 'pending' NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT payments_amount_positive CHECK (amount > 0)
);

-- =============================================
-- 6. SEARCH AND NOTIFICATION TABLES
-- =============================================

-- Job search history
CREATE TABLE IF NOT EXISTS job_searches (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Search parameters
    search_query TEXT,
    filters JSONB,                   -- JSON search filters
    location_city VARCHAR(100),
    province sa_province,
    
    -- Results
    results_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Timestamp
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT job_searches_results_non_negative CHECK (results_count >= 0)
);

-- Job alerts for users
CREATE TABLE IF NOT EXISTS job_alerts (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Alert configuration
    alert_name VARCHAR(255) NOT NULL,
    search_criteria JSONB NOT NULL, -- JSON search criteria
    location_city VARCHAR(100),
    province sa_province,
    frequency VARCHAR(20) DEFAULT 'daily' NOT NULL, -- daily, weekly, monthly
    
    -- Status and tracking
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_sent TIMESTAMP WITH TIME ZONE,
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT job_alerts_frequency_valid CHECK (
        frequency IN ('daily', 'weekly', 'monthly')
    )
);

-- =============================================
-- 7. FILE MANAGEMENT AND LOGGING TABLES
-- =============================================

-- File uploads tracking
CREATE TABLE IF NOT EXISTS file_uploads (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- File information
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,               -- File size in bytes
    file_type VARCHAR(100),          -- MIME type
    file_url TEXT NOT NULL,          -- Storage URL
    upload_purpose VARCHAR(50),      -- e.g., "cv", "profile_picture", "company_logo"
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT file_uploads_size_positive CHECK (file_size IS NULL OR file_size > 0)
);

-- Email communication logs
CREATE TABLE IF NOT EXISTS email_logs (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Email information
    email_type VARCHAR(50) NOT NULL, -- e.g., "welcome", "job_alert", "application_update"
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    template_name VARCHAR(100),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT email_logs_status_valid CHECK (
        status IN ('pending', 'sent', 'failed', 'bounced')
    )
);

-- SMS communication logs
CREATE TABLE IF NOT EXISTS sms_logs (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- SMS information
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    sms_type VARCHAR(50),            -- e.g., "verification", "job_alert", "notification"
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT sms_logs_status_valid CHECK (
        status IN ('pending', 'sent', 'failed', 'delivered')
    )
);

-- =============================================
-- 8. ANALYTICS AND TRACKING TABLES
-- =============================================

-- User analytics and behavior tracking
CREATE TABLE IF NOT EXISTS user_analytics (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Event information
    event_type VARCHAR(100) NOT NULL, -- e.g., "job_view", "search", "application_submit"
    event_data JSONB,                -- Additional event data
    
    -- Session information
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================
-- 9. PERFORMANCE INDEXES
-- =============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_plan, subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_province ON users(province);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Companies table indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_province ON companies(province);
CREATE INDEX IF NOT EXISTS idx_companies_verified ON companies(is_verified);
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);

-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_work_model ON jobs(work_model);
CREATE INDEX IF NOT EXISTS idx_jobs_province ON jobs(province);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_salary ON jobs(salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_experience ON jobs(experience_level);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_jobs_title_fts ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_fts ON jobs USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_companies_name_fts ON companies USING gin(to_tsvector('english', name));

-- Job applications table indexes
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON job_applications(applied_at);

-- Authentication and profile indexes
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);

-- Job interaction indexes
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON saved_jobs(job_id);

-- Search and alerts indexes
CREATE INDEX IF NOT EXISTS idx_job_searches_user ON job_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_job_searches_province ON job_searches(province);
CREATE INDEX IF NOT EXISTS idx_job_alerts_user ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_province ON job_alerts(province);
CREATE INDEX IF NOT EXISTS idx_job_alerts_active ON job_alerts(is_active);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Logging indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_user ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_user ON sms_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_type ON sms_logs(sms_type);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at);

-- File uploads indexes
CREATE INDEX IF NOT EXISTS idx_file_uploads_user ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_purpose ON file_uploads(upload_purpose);

-- =============================================
-- 10. FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at 
    BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_alerts_updated_at 
    BEFORE UPDATE ON job_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update job application counts
CREATE OR REPLACE FUNCTION update_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE jobs SET applications_count = applications_count - 1 WHERE id = OLD.job_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for job applications count
CREATE TRIGGER trigger_update_job_applications_count
    AFTER INSERT OR DELETE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_job_applications_count();

-- =============================================
-- 11. SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample users
INSERT INTO users (
    email, password_hash, first_name, last_name, phone, city, province, role, email_verified
) VALUES 
(
    'admin@aijobchommie.co.za', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbRTZh4h7p6Nb4W', -- password: admin123
    'Admin', 'User', '+27123456789', 'Cape Town', 'western_cape', 'admin', true
),
(
    'employer@aijobchommie.co.za', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbRTZh4h7p6Nb4W', -- password: employer123
    'John', 'Employer', '+27987654321', 'Johannesburg', 'gauteng', 'employer', true
),
(
    'jobseeker@aijobchommie.co.za', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbRTZh4h7p6Nb4W', -- password: jobseeker123
    'Jane', 'Seeker', '+27555123456', 'Durban', 'kwazulu_natal', 'job_seeker', true
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample companies
INSERT INTO companies (
    name, description, industry, website, headquarters_city, province, 
    contact_email, is_verified, created_by
) VALUES 
(
    'TechCorp SA', 
    'Leading technology company in South Africa specializing in software development and AI solutions.',
    'Technology', 'https://techcorp.co.za', 'Cape Town', 'western_cape',
    'hr@techcorp.co.za', true,
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1)
),
(
    'FinanceHub', 
    'Premier financial services company offering innovative banking and investment solutions.',
    'Finance', 'https://financehub.co.za', 'Johannesburg', 'gauteng',
    'careers@financehub.co.za', true,
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1)
),
(
    'HealthPlus Medical', 
    'Healthcare technology company improving patient care through digital solutions.',
    'Healthcare', 'https://healthplus.co.za', 'Durban', 'kwazulu_natal',
    'jobs@healthplus.co.za', false,
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (
    title, description, requirements, responsibilities, benefits,
    salary_min, salary_max, job_type, work_model, experience_level,
    category, subcategory, industry, skills,
    location_city, province, company_id, posted_by, is_active, is_featured
) VALUES 
(
    'Senior Software Developer',
    'We are looking for an experienced software developer to join our dynamic team and work on cutting-edge AI projects.',
    'Bachelor''s degree in Computer Science or related field. 5+ years of experience in software development. Proficiency in Python, JavaScript, and React.',
    'Develop and maintain web applications. Collaborate with cross-functional teams. Write clean, maintainable code. Participate in code reviews.',
    'Medical aid, retirement fund, flexible working hours, remote work options, professional development budget.',
    45000.00, 65000.00, 'full-time', 'hybrid', 'senior-level',
    'Technology', 'Software Development', 'Technology',
    ARRAY['Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    'Cape Town', 'western_cape',
    (SELECT id FROM companies WHERE name = 'TechCorp SA' LIMIT 1),
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1),
    true, true
),
(
    'Financial Analyst',
    'Join our finance team to analyze market trends and provide insights for investment decisions.',
    'BCom in Finance or related field. 3+ years of financial analysis experience. Strong Excel and SQL skills.',
    'Conduct financial analysis and modeling. Prepare reports for management. Monitor market trends and risks.',
    'Medical aid, performance bonuses, professional certifications funding.',
    35000.00, 50000.00, 'full-time', 'on-site', 'mid-level',
    'Finance', 'Financial Analysis', 'Finance',
    ARRAY['Excel', 'SQL', 'Financial Modeling', 'Data Analysis'],
    'Johannesburg', 'gauteng',
    (SELECT id FROM companies WHERE name = 'FinanceHub' LIMIT 1),
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1),
    true, false
),
(
    'Junior Web Developer',
    'Entry-level position for a passionate developer to start their career in healthcare technology.',
    'Diploma or degree in Computer Science. Knowledge of HTML, CSS, JavaScript. Fresh graduates welcome.',
    'Assist in developing healthcare web applications. Learn from senior developers. Participate in team projects.',
    'Medical aid, mentorship program, career development opportunities.',
    18000.00, 25000.00, 'full-time', 'remote', 'entry-level',
    'Technology', 'Web Development', 'Healthcare',
    ARRAY['HTML', 'CSS', 'JavaScript', 'Git'],
    'Durban', 'kwazulu_natal',
    (SELECT id FROM companies WHERE name = 'HealthPlus Medical' LIMIT 1),
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1),
    true, false
)
ON CONFLICT DO NOTHING;

-- =============================================
-- 12. FINAL VALIDATION QUERIES
-- =============================================

-- Confirm successful schema creation
SELECT 'AI Job Chommie database schema created successfully! ' as message;

-- Show all created tables
SELECT 'CREATED TABLES:' as info;
SELECT 
    t.table_name,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;

-- Show all ENUM types
SELECT 'CREATED ENUMS:' as info;
SELECT 
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE t.typtype = 'e'
GROUP BY t.typname
ORDER BY t.typname;

-- Show sample data counts
SELECT 'SAMPLE DATA:' as info;
SELECT 
    (SELECT count(*) FROM users) as users,
    (SELECT count(*) FROM companies) as companies,
    (SELECT count(*) FROM jobs) as jobs;

-- Show sample jobs with company info
SELECT 'SAMPLE JOBS:' as info;
SELECT 
    j.title,
    c.name as company,
    j.location_city || ', ' || j.province as location,
    'R' || j.salary_min || ' - R' || j.salary_max as salary_range,
    j.job_type,
    j.work_model
FROM jobs j
JOIN companies c ON j.company_id = c.id
ORDER BY j.is_featured DESC, j.created_at DESC;

-- Final success message
SELECT 'Database is ready for AI Job Chommie platform! ' as final_status;
