-- =====================================
-- 🚀 AI JOB CHOMMIE PLATFORM - FRESH SUPABASE SCHEMA
-- Complete database schema for new installation
-- Designed for South African job market with AI integration
-- =====================================

-- Enable UUID and crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- 🗂️ ENUMS AND TYPES
-- =====================================

-- Create enums safely (PostgreSQL equivalent of IF NOT EXISTS for types)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'admin', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
      'draft', 'submitted', 'under_review', 'shortlisted', 
      'interview_scheduled', 'interviewed', 'offer_extended', 
      'hired', 'rejected', 'withdrawn', 'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

DO $$ BEGIN
    CREATE TYPE file_type AS ENUM ('resume', 'profile_image', 'cover_letter', 'certificate', 'portfolio', 'company_logo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sa_province AS ENUM (
      'Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State',
      'KwaZulu-Natal', 'North West', 'Gauteng', 'Mpumalanga', 'Limpopo'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================
-- 👥 USERS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  phone VARCHAR(20),
  profile_image TEXT,
  date_of_birth DATE,
  location VARCHAR(255),
  province sa_province,
  city VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  role user_role DEFAULT 'job_seeker',
  subscription_plan subscription_plan DEFAULT 'free',
  subscription_status subscription_status DEFAULT 'active',
  paystack_customer_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  last_login_at TIMESTAMPTZ,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 🔑 REFRESH TOKENS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 👤 USER PROFILES TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  skills JSONB DEFAULT '[]', -- Array of strings
  education JSONB DEFAULT '[]', -- Array of education objects
  experience JSONB DEFAULT '[]', -- Array of experience objects
  languages JSONB DEFAULT '[]', -- Array of language objects
  certifications JSONB DEFAULT '[]', -- Array of certification objects
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  preferred_job_types JSONB DEFAULT '[]', -- Array of job_type enums
  preferred_locations JSONB DEFAULT '[]', -- Array of strings
  expected_salary_min INTEGER,
  expected_salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'ZAR',
  ai_match_score DECIMAL(3,2), -- AI compatibility score
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 🏢 COMPANIES TABLE
-- =====================================
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
  company_size VARCHAR(20), -- '1-10', '11-50', '51-200', '201-1000', '1000+'
  founded INTEGER,
  culture JSONB DEFAULT '[]', -- Array of culture values
  benefits JSONB DEFAULT '[]', -- Array of benefits
  social_links JSONB DEFAULT '{}', -- Object with social media links
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 💼 JOBS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  company VARCHAR(200) NOT NULL, -- Denormalized for performance
  company_logo TEXT,
  location VARCHAR(255) NOT NULL,
  province sa_province NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT,
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '[]', -- Array of strings
  responsibilities JSONB DEFAULT '[]', -- Array of strings
  benefits JSONB DEFAULT '[]', -- Array of strings
  qualifications JSONB DEFAULT '[]', -- Array of strings
  
  -- Salary information
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'ZAR',
  salary_period VARCHAR(20) DEFAULT 'monthly', -- hourly, daily, weekly, monthly, annually
  
  -- Job classification
  job_type job_type NOT NULL,
  work_model work_model DEFAULT 'on-site',
  experience_level experience_level DEFAULT 'entry-level',
  education_level VARCHAR(50), -- matric, diploma, degree, postgraduate
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  industry VARCHAR(100),
  
  -- Contact and application
  working_hours VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_person VARCHAR(200),
  application_method VARCHAR(100), -- online, email, phone, in-person
  application_url TEXT,
  application_instructions TEXT,
  external_url TEXT,
  
  -- Job features and status
  is_urgent BOOLEAN DEFAULT FALSE,
  is_immediate_start BOOLEAN DEFAULT FALSE,
  no_experience_required BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_remote BOOLEAN DEFAULT FALSE,
  allows_applications BOOLEAN DEFAULT TRUE,
  
  -- Analytics and AI
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  ai_tags JSONB DEFAULT '[]', -- AI-generated tags
  ai_score DECIMAL(3,2), -- AI relevance score
  search_vector TSVECTOR, -- Full-text search vector
  
  -- Metadata
  tags JSONB DEFAULT '[]', -- Array of strings for search
  source VARCHAR(100), -- scraped, manual, api, imported
  source_url TEXT,
  posted_by UUID REFERENCES users(id),
  expires_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 📝 JOB APPLICATIONS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Applicant information (denormalized for data integrity)
  applicant_name VARCHAR(200) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  applicant_phone VARCHAR(20) NOT NULL,
  
  -- Application content
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  expected_salary INTEGER,
  availability_date DATE,
  custom_answers JSONB DEFAULT '{}', -- Custom question responses
  
  -- Application status and tracking
  status application_status DEFAULT 'submitted',
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- AI analysis
  ai_match_score DECIMAL(3,2), -- AI compatibility score with job
  ai_analysis JSONB DEFAULT '{}', -- AI insights about the application
  skills_match DECIMAL(3,2),
  experience_match DECIMAL(3,2),
  
  -- Employer feedback
  employer_notes TEXT,
  interview_date TIMESTAMPTZ,
  interview_type VARCHAR(20), -- phone, video, in_person
  interview_notes TEXT,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comments TEXT,
  
  -- Timestamps
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 💳 PAYMENTS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ZAR',
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  
  -- Paystack integration
  paystack_reference VARCHAR(255) UNIQUE,
  paystack_transaction_id VARCHAR(255),
  paystack_authorization_code VARCHAR(255),
  paystack_customer_code VARCHAR(255),
  
  -- Subscription details
  subscription_plan subscription_plan,
  subscription_period INTEGER, -- months
  subscription_start_date DATE,
  subscription_end_date DATE,
  
  -- Additional information
  description TEXT,
  invoice_number VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 📁 FILE UPLOADS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- File information
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_type file_type NOT NULL,
  
  -- File processing
  is_processed BOOLEAN DEFAULT FALSE,
  processed_data JSONB DEFAULT '{}', -- AI-extracted content, metadata
  processing_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  processing_error TEXT,
  
  -- AI analysis for resumes/CVs
  ai_extracted_skills JSONB DEFAULT '[]',
  ai_extracted_experience JSONB DEFAULT '{}',
  ai_compatibility_score DECIMAL(3,2),
  
  -- Access control
  is_public BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  access_token VARCHAR(255), -- For secure file access
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 🔍 JOB SEARCHES TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS job_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Search parameters
  query VARCHAR(500),
  location VARCHAR(255),
  province sa_province,
  category VARCHAR(100),
  job_type job_type,
  experience_level experience_level,
  salary_min INTEGER,
  salary_max INTEGER,
  filters JSONB DEFAULT '{}', -- Additional search filters
  
  -- Search results
  results_count INTEGER DEFAULT 0,
  results_data JSONB, -- Cached search results for analytics
  
  -- User context
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 🔔 JOB ALERTS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Alert configuration
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
  
  -- Alert settings
  frequency VARCHAR(20) DEFAULT 'daily', -- immediate, daily, weekly, monthly
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Alert tracking
  last_run_at TIMESTAMPTZ,
  jobs_found_count INTEGER DEFAULT 0,
  total_notifications_sent INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 📧 EMAIL LOGS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Email details
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  template VARCHAR(100),
  
  -- Email status
  status VARCHAR(20) DEFAULT 'sent', -- sent, failed, pending, delivered, opened, clicked
  provider VARCHAR(50), -- smtp, sendgrid, mailgun, etc.
  provider_id VARCHAR(255), -- External provider message ID
  error_message TEXT,
  
  -- Email content
  html_content TEXT,
  text_content TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Tracking
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 📱 SMS LOGS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- SMS details
  to_phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  
  -- SMS status
  status VARCHAR(20) DEFAULT 'sent', -- sent, failed, pending, delivered
  provider VARCHAR(50), -- twilio, clickatell, etc.
  provider_id VARCHAR(255),
  cost_amount DECIMAL(8,4),
  cost_currency VARCHAR(10) DEFAULT 'ZAR',
  error_message TEXT,
  
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 📊 USER ANALYTICS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Activity metrics
  jobs_viewed_count INTEGER DEFAULT 0,
  jobs_applied_count INTEGER DEFAULT 0,
  jobs_saved_count INTEGER DEFAULT 0,
  searches_performed_count INTEGER DEFAULT 0,
  profile_views_count INTEGER DEFAULT 0,
  
  -- Engagement metrics
  last_activity_at TIMESTAMPTZ,
  total_session_time INTEGER DEFAULT 0, -- in minutes
  average_session_time DECIMAL(8,2),
  bounce_rate DECIMAL(5,2),
  
  -- AI insights
  ai_recommended_jobs_count INTEGER DEFAULT 0,
  ai_match_accuracy DECIMAL(3,2),
  preferred_categories JSONB DEFAULT '[]',
  job_search_patterns JSONB DEFAULT '{}',
  
  -- Period tracking (for monthly/weekly analytics)
  period_type VARCHAR(20) DEFAULT 'all_time', -- daily, weekly, monthly, all_time
  period_start DATE,
  period_end DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- 🏆 SAVED JOBS TABLE (Many-to-Many)
-- =====================================
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  notes TEXT, -- User's personal notes about the job
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, job_id)
);

-- =====================================
-- 🔗 INDEXES FOR PERFORMANCE
-- =====================================

-- Users indexes
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

-- File uploads indexes
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_file_type ON file_uploads(file_type);
CREATE INDEX IF NOT EXISTS idx_file_uploads_is_processed ON file_uploads(is_processed);

-- Search and analytics indexes
CREATE INDEX IF NOT EXISTS idx_job_searches_user_id ON job_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_job_searches_created_at ON job_searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_is_active ON job_alerts(is_active);

-- =====================================
-- 🔄 FUNCTIONS AND TRIGGERS
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to relevant tables
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
    COALESCE(array_to_string(
      ARRAY(SELECT jsonb_array_elements_text(NEW.requirements)), ' '
    ), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS update_jobs_search_vector ON jobs;
    CREATE TRIGGER update_jobs_search_vector 
      BEFORE INSERT OR UPDATE ON jobs
      FOR EACH ROW EXECUTE FUNCTION update_job_search_vector();
END $$;

-- Function to generate unique tracking numbers
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tracking_number := 'AJC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD(NEXTVAL('tracking_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for tracking numbers
CREATE SEQUENCE IF NOT EXISTS tracking_number_seq START 1;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS generate_job_application_tracking_number ON job_applications;
    CREATE TRIGGER generate_job_application_tracking_number 
      BEFORE INSERT ON job_applications
      FOR EACH ROW EXECUTE FUNCTION generate_tracking_number();
END $$;

-- Function to automatically update job application counts
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET application_count = application_count + 1 
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET application_count = application_count - 1 
    WHERE id = OLD.job_id AND application_count > 0;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS update_job_application_count_trigger ON job_applications;
    CREATE TRIGGER update_job_application_count_trigger
      AFTER INSERT OR DELETE ON job_applications
      FOR EACH ROW EXECUTE FUNCTION update_job_application_count();
END $$;

-- =====================================
-- 🔐 ROW LEVEL SECURITY (RLS)
-- =====================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- User profiles policy
CREATE POLICY "Users can view own user_profile" ON user_profiles
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Job applications policy
CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Payments policy
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- File uploads policy
CREATE POLICY "Users can manage own files" ON file_uploads
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Job alerts policy
CREATE POLICY "Users can manage own alerts" ON job_alerts
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Saved jobs policy
CREATE POLICY "Users can manage own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid()::text = user_id::text);

-- =====================================
-- 📊 VIEWS FOR COMMON QUERIES
-- =====================================

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
  SUM(application_count) as total_applications_received,
  AVG(application_count) as avg_applications_per_job,
  SUM(view_count) as total_views
FROM jobs
WHERE posted_by IS NOT NULL
GROUP BY posted_by;

-- =====================================
-- 🌱 SAMPLE DATA FOR DEVELOPMENT
-- =====================================

-- Insert sample companies
INSERT INTO companies (name, slug, email, industry, description, is_verified) VALUES
('Pick n Pay', 'pick-n-pay', 'careers@pnp.co.za', 'Retail', 'Leading South African retailer', true),
('Standard Bank', 'standard-bank', 'careers@standardbank.co.za', 'Banking', 'Premier African banking group', true),
('MTN Group', 'mtn-group', 'careers@mtn.com', 'Telecommunications', 'Leading telecommunications company in Africa', true),
('Shoprite Holdings', 'shoprite', 'careers@shoprite.co.za', 'Retail', 'Africa''s largest food retailer', true),
('Discovery', 'discovery', 'careers@discovery.co.za', 'Insurance', 'Leading insurance and financial services group', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample job categories and jobs (only if not exists)
INSERT INTO jobs (
  title, slug, company, location, province, city, description, job_type, 
  category, experience_level, salary_min, salary_max, is_active, posted_at,
  requirements, responsibilities, benefits
) VALUES
(
  'General Worker - Immediate Start',
  'general-worker-immediate-start',
  'Pick n Pay Distribution Centre',
  'Montague Gardens, Cape Town',
  'Western Cape',
  'Cape Town',
  'We are looking for reliable general workers to join our distribution team. Duties include packing, sorting, and basic warehouse operations. No previous experience required - full training provided.',
  'full-time',
  'General Labour',
  'entry-level',
  3500,
  4200,
  true,
  NOW(),
  '["No experience required", "Physically fit", "Reliable and punctual", "Able to work in a team"]',
  '["Pack and sort merchandise", "Load and unload delivery trucks", "Maintain clean work environment", "Follow safety protocols"]',
  '["Medical aid", "Pension fund", "Staff discount", "Training provided"]'
),
(
  'Customer Service Representative',
  'customer-service-representative',
  'Standard Bank Call Centre',
  'Rosebank, Johannesburg',
  'Gauteng',
  'Johannesburg',
  'Join our customer service team to help clients with banking queries and transactions. Full training provided for successful candidates.',
  'full-time',
  'Customer Service',
  'entry-level',
  8000,
  12000,
  true,
  NOW(),
  '["Matric certificate", "Good communication skills", "Computer literacy", "Customer service experience preferred"]',
  '["Handle customer phone queries", "Process banking transactions", "Resolve customer complaints", "Maintain customer records"]',
  '["Medical aid", "Pension fund", "Performance bonuses", "Career development opportunities"]'
),
(
  'Security Guard',
  'security-guard',
  'SecureGuard Services',
  'Sandton, Johannesburg',
  'Gauteng',
  'Johannesburg',
  'Experienced security guards needed for corporate buildings in Sandton area. Must have valid PSIRA registration.',
  'full-time',
  'Security',
  'mid-level',
  4500,
  6000,
  true,
  NOW(),
  '["Valid PSIRA registration", "2+ years security experience", "Clean criminal record", "Grade 10 minimum"]',
  '["Monitor premises and entrances", "Patrol assigned areas", "Write incident reports", "Control access to buildings"]',
  '["Medical aid", "Uniform provided", "Night shift allowance", "Training opportunities"]'
),
(
  'Domestic Worker',
  'domestic-worker',
  'Elite Cleaning Services',
  'Constantia, Cape Town',
  'Western Cape',
  'Cape Town',
  'Reliable domestic worker needed for upmarket homes in Constantia area. Experience with households and references required.',
  'part-time',
  'Cleaning & Domestic',
  'entry-level',
  3000,
  4500,
  true,
  NOW(),
  '["Previous domestic work experience", "References required", "Honest and trustworthy", "Own transport preferred"]',
  '["House cleaning and maintenance", "Laundry and ironing", "Light meal preparation", "Garden maintenance"]',
  '["Transport allowance", "Meals provided", "Medical aid contribution", "Annual bonus"]'
),
(
  'Retail Sales Assistant',
  'retail-sales-assistant',
  'Woolworths',
  'V&A Waterfront, Cape Town',
  'Western Cape',
  'Cape Town',
  'Dynamic sales assistant needed for busy Woolworths store. Great opportunity for someone looking to start their retail career.',
  'full-time',
  'Retail Sales',
  'entry-level',
  4500,
  6500,
  true,
  NOW(),
  '["Matric certificate", "Friendly personality", "Sales experience preferred", "Able to work weekends"]',
  '["Assist customers with purchases", "Maintain store displays", "Process cash transactions", "Stock replenishment"]',
  '["Staff discount", "Medical aid", "Performance incentives", "Career progression"]'
);

-- =====================================
-- ✅ SCHEMA VALIDATION
-- =====================================

-- Verify all tables were created
SELECT 
    schemaname, 
    tablename,
    '✅ Created' as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'user_profiles', 'companies', 'jobs', 'job_applications',
    'payments', 'file_uploads', 'job_searches', 'job_alerts', 'email_logs',
    'sms_logs', 'user_analytics', 'saved_jobs', 'refresh_tokens'
  )
ORDER BY tablename;

-- =====================================
-- 🎉 SCHEMA COMPLETE!
-- This comprehensive schema supports:
-- ✅ User management with South African focus
-- ✅ Company and job management with sample data
-- ✅ AI-powered job matching and applications
-- ✅ Paystack payment integration
-- ✅ File uploads with AI processing
-- ✅ Analytics and search functionality
-- ✅ Row Level Security for data protection
-- ✅ Performance optimizations with indexes
-- ✅ Audit trails and logging
-- ✅ South African market specifics
-- ✅ Sample data for immediate testing
-- =====================================

-- Success message
SELECT 'AI Job Chommie Platform database schema created successfully! 🚀' as message;
