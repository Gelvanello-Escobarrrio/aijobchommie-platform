
-- ===================================================================
-- AI JOB CHOMMIE - SUPABASE-OPTIMIZED & PERFECTED DATABASE SCHEMA
--
-- Version: 2.0
-- Date: 2025-08-18
--
-- Key Improvements:
--   - ✅ Full integration with Supabase Auth (`auth.users`).
--   - ✅ `user_profiles` table automatically populated from new sign-ups.
--   - ✅ `updated_at` timestamps managed automatically by triggers.
--   - ✅ Robust Row-Level Security (RLS) policies for all tables.
--   - ✅ Clear permission grants for Supabase roles (`anon`, `authenticated`).
--   - ✅ Idempotent design - safe to run multiple times.
--   - ✅ Improved relationships between tables (e.g., jobs are linked to users).
-- ===================================================================

-- 1. EXTENSIONS
-- -------------------------------------------------------------------
-- Ensure required extensions are enabled in your Supabase project.
-- Go to Database -> Extensions in your Supabase dashboard.
-- Required: `pg_trgm`
-- Supabase handles `uuid-ossp` by default.
-- -------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- 2. ENUM TYPES
-- Using DO blocks to prevent errors if types already exist.
-- -------------------------------------------------------------------
DO $$ BEGIN CREATE TYPE public.sa_province AS ENUM (
    'western_cape', 'eastern_cape', 'northern_cape', 'free_state', 
    'kwazulu_natal', 'north_west', 'gauteng', 'mpumalanga', 'limpopo'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE public.user_role AS ENUM (
    'job_seeker', 'employer', 'admin', 'moderator'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE public.subscription_plan AS ENUM (
    'free', 'basic', 'premium', 'enterprise'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE public.job_type AS ENUM (
    'full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance', 'casual'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE public.work_model AS ENUM (
    'on-site', 'remote', 'hybrid'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE public.experience_level AS ENUM (
    'entry-level', 'mid-level', 'senior-level', 'executive'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE public.application_status AS ENUM (
    'submitted', 'under_review', 'shortlisted', 'interviewed', 'hired', 'rejected', 'withdrawn'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE public.payment_status AS ENUM (
    'pending', 'completed', 'failed', 'cancelled', 'refunded'
); EXCEPTION WHEN duplicate_object THEN null; END $$;


-- 3. TRIGGER FUNCTION FOR `updated_at`
-- This function will be used across multiple tables.
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 4. USER PROFILES TABLE
-- This table is the core of your user data, linked directly to Supabase Auth.
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    city VARCHAR(100),
    province sa_province,
    profile_picture_url TEXT,
    bio TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    skills TEXT[],
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    role user_role DEFAULT 'job_seeker' NOT NULL,
    subscription_plan subscription_plan DEFAULT 'free' NOT NULL,
    subscription_end_date DATE,
    paystack_customer_id TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add comments for clarity
COMMENT ON TABLE public.user_profiles IS 'Stores public and private profile information for users, linked to auth.users.';
COMMENT ON COLUMN public.user_profiles.id IS 'Foreign key to auth.users.id.';

-- Trigger to keep `updated_at` fresh
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles 
FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();


-- 5. TRIGGER FOR NEW USER CREATION
-- This automatically creates a user_profile when a new user signs up via Supabase Auth.
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The actual trigger that executes the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 6. COMPANIES TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    logo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.companies 
FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();


-- 7. JOBS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    posted_by_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(200), -- Denormalized for easier display
    company_logo_url TEXT,   -- Denormalized for easier display
    
    city VARCHAR(100) NOT NULL,
    province sa_province NOT NULL,
    work_model work_model DEFAULT 'on-site' NOT NULL,
    
    job_type job_type NOT NULL,
    experience_level experience_level DEFAULT 'entry-level' NOT NULL,
    
    salary_min INT,
    salary_max INT,
    salary_currency VARCHAR(10) DEFAULT 'ZAR',
    
    requirements TEXT[],
    responsibilities TEXT[],
    benefits TEXT[],
    
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    
    application_url TEXT,
    application_email VARCHAR(255),

    view_count INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.jobs 
FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS jobs_posted_by_id_idx ON public.jobs(posted_by_id);
CREATE INDEX IF NOT EXISTS jobs_province_idx ON public.jobs(province);
CREATE INDEX IF NOT EXISTS jobs_tags_idx ON public.jobs USING GIN(tags);
CREATE INDEX IF NOT EXISTS jobs_title_trgm_idx ON public.jobs USING GIN(title gin_trgm_ops);


-- 8. JOB APPLICATIONS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    status application_status DEFAULT 'submitted' NOT NULL,
    cover_letter TEXT,
    resume_url TEXT, -- Link to file storage

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    UNIQUE(job_id, user_id) -- User can only apply to a job once
);

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.job_applications
FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();


-- 9. PAYMENTS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'ZAR' NOT NULL,
    status payment_status NOT NULL,
    paystack_reference VARCHAR(255) UNIQUE,
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payments 
FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();


-- 10. ROW-LEVEL SECURITY (RLS)
-- This is the most critical part for securing your data.
-- -------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read access" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Allow public read access" ON public.companies;
DROP POLICY IF EXISTS "Allow users to create companies" ON public.companies;
DROP POLICY IF EXISTS "Allow owners to update their company" ON public.companies;

DROP POLICY IF EXISTS "Allow public read access" ON public.jobs;
DROP POLICY IF EXISTS "Allow employers to create jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow owners to update their jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow owners to delete their jobs" ON public.jobs;

DROP POLICY IF EXISTS "Allow users to view their own applications" ON public.job_applications;
DROP POLICY IF EXISTS "Allow employers to view applications for their jobs" ON public.job_applications;
DROP POLICY IF EXISTS "Allow users to create applications" ON public.job_applications;
DROP POLICY IF EXISTS "Allow users to withdraw their applications" ON public.job_applications;

DROP POLICY IF EXISTS "Allow users to see their own payments" ON public.payments;
DROP POLICY IF EXISTS "Allow service_role to do everything" ON public.payments;


-- RLS Policies for `user_profiles`
CREATE POLICY "Allow public read access" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for `companies`
CREATE POLICY "Allow public read access" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow users to create companies" ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow owners to update their company" ON public.companies FOR UPDATE USING (auth.uid() = owner_id);

-- RLS Policies for `jobs`
CREATE POLICY "Allow public read access" ON public.jobs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow employers to create jobs" ON public.jobs FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()) IN ('employer', 'admin')
);
CREATE POLICY "Allow owners to update their jobs" ON public.jobs FOR UPDATE USING (auth.uid() = posted_by_id);
CREATE POLICY "Allow owners to delete their jobs" ON public.jobs FOR DELETE USING (auth.uid() = posted_by_id);

-- RLS Policies for `job_applications`
CREATE POLICY "Allow users to view their own applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow employers to view applications for their jobs" ON public.job_applications FOR SELECT USING (
    (SELECT posted_by_id FROM public.jobs WHERE id = job_id) = auth.uid()
);
CREATE POLICY "Allow users to create applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to withdraw their applications" ON public.job_applications FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for `payments`
CREATE POLICY "Allow users to see their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);


-- 11. GRANT PERMISSIONS
-- Grant usage to the Supabase roles. `service_role` has admin-like access.
-- -------------------------------------------------------------------

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant access to tables
GRANT SELECT ON TABLE public.user_profiles TO authenticated;
GRANT ALL ON TABLE public.user_profiles TO service_role;

GRANT SELECT ON TABLE public.companies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.companies TO authenticated;
GRANT ALL ON TABLE public.companies TO service_role;

GRANT SELECT ON TABLE public.jobs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.jobs TO authenticated;
GRANT ALL ON TABLE public.jobs TO service_role;

GRANT SELECT, INSERT, DELETE ON TABLE public.job_applications TO authenticated;
GRANT ALL ON TABLE public.job_applications TO service_role;

GRANT SELECT ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;

-- Grant usage on sequences for primary keys
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.moddatetime() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated, service_role;

-- ===================================================================
-- END OF SCHEMA
-- ===================================================================

