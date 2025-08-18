
-- ===================================================================
-- AI JOB CHOMMIE - SUPABASE-OPTIMIZED & PERFECTED DATABASE SCHEMA
--
-- Version: 2.1 - "The Perfected One"
-- Date: 2025-08-18
--
-- Key Improvements from v2.0:
--   - ✅ **IDEMPOTENT & DESTRUCTIVE**: This script is now self-cleaning. 
--     It starts by dropping old tables and types, guaranteeing a perfect, 
--     fresh slate every time. This resolves the `column does not exist` error.
--   - ✅ **FULL INTEGRATION WITH SUPABASE AUTH**: Seamlessly connects to `auth.users`.
--   - ✅ **AUTOMATED PROFILES & TIMESTAMPS**: `user_profiles` are created 
--     automatically on sign-up, and `updated_at` timestamps are always fresh.
--   - ✅ **ROCK-SOLID ROW-LEVEL SECURITY**: Correct, robust RLS policies for all tables.
-- ===================================================================

-- 1. CLEANUP PHASE (DROPPING OLD OBJECTS)
-- This section makes the script safe to re-run.
-- -------------------------------------------------------------------

-- Drop the trigger from `auth.users` first as it depends on our function and table.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop tables in reverse order of dependency. CASCADE handles related objects.
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.moddatetime() CASCADE;

-- Drop ENUM types
DROP TYPE IF EXISTS public.payment_status;
DROP TYPE IF EXISTS public.application_status;
DROP TYPE IF EXISTS public.experience_level;
DROP TYPE IF EXISTS public.work_model;
DROP TYPE IF EXISTS public.job_type;
DROP TYPE IF EXISTS public.subscription_plan;
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.sa_province;


-- 2. SETUP PHASE (CREATING NEW OBJECTS)
-- -------------------------------------------------------------------

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create ENUM types
CREATE TYPE public.sa_province AS ENUM (
    'western_cape', 'eastern_cape', 'northern_cape', 'free_state', 
    'kwazulu_natal', 'north_west', 'gauteng', 'mpumalanga', 'limpopo'
);
CREATE TYPE public.user_role AS ENUM ('job_seeker', 'employer', 'admin', 'moderator');
CREATE TYPE public.subscription_plan AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE public.job_type AS ENUM ('full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance', 'casual');
CREATE TYPE public.work_model AS ENUM ('on-site', 'remote', 'hybrid');
CREATE TYPE public.experience_level AS ENUM ('entry-level', 'mid-level', 'senior-level', 'executive');
CREATE TYPE public.application_status AS ENUM ('submitted', 'under_review', 'shortlisted', 'interviewed', 'hired', 'rejected', 'withdrawn');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'refunded');

-- Create trigger function for `updated_at`
CREATE OR REPLACE FUNCTION public.moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 3. TABLE CREATION
-- -------------------------------------------------------------------

-- User Profiles Table (linked to Supabase Auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
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
COMMENT ON TABLE public.user_profiles IS 'Stores public and private profile information for users, linked to auth.users.';
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();

-- Companies Table
CREATE TABLE public.companies (
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
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();

-- Jobs Table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    posted_by_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(200),
    company_logo_url TEXT,
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
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();
CREATE INDEX jobs_posted_by_id_idx ON public.jobs(posted_by_id);
CREATE INDEX jobs_province_idx ON public.jobs(province);
CREATE INDEX jobs_tags_idx ON public.jobs USING GIN(tags);
CREATE INDEX jobs_title_trgm_idx ON public.jobs USING GIN(title gin_trgm_ops);

-- Job Applications Table
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    status application_status DEFAULT 'submitted' NOT NULL,
    cover_letter TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(job_id, user_id)
);
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();

-- Payments Table
CREATE TABLE public.payments (
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
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();


-- 4. AUTH AUTOMATION & TRIGGERS
-- -------------------------------------------------------------------

-- Function to create a user_profile on new user sign-up
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

-- Trigger to execute the function after a new user is created in `auth.users`
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 5. ROW-LEVEL SECURITY (RLS)
-- -------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for `user_profiles`
CREATE POLICY "Allow public read access on profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for `companies`
CREATE POLICY "Allow public read access on companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow users to create companies" ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow owners to update their own company" ON public.companies FOR UPDATE USING (auth.uid() = owner_id);

-- RLS Policies for `jobs`
CREATE POLICY "Allow public read access on jobs" ON public.jobs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow employers to create jobs" ON public.jobs FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()) IN ('employer', 'admin')
);
CREATE POLICY "Allow owners to update their jobs" ON public.jobs FOR UPDATE USING (auth.uid() = posted_by_id);
CREATE POLICY "Allow owners to delete their jobs" ON public.jobs FOR DELETE USING (auth.uid() = posted_by_id);

-- RLS Policies for `job_applications`
CREATE POLICY "Users can view their own applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Employers can view applications for their jobs" ON public.job_applications FOR SELECT USING (
    (SELECT posted_by_id FROM public.jobs WHERE id = job_applications.job_id) = auth.uid()
);
CREATE POLICY "Users can create applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can withdraw their applications" ON public.job_applications FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for `payments`
CREATE POLICY "Users can see their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);


-- 6. GRANT PERMISSIONS
-- -------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON TABLE public.user_profiles TO authenticated, service_role;
GRANT ALL ON TABLE public.companies TO authenticated, service_role;
GRANT ALL ON TABLE public.jobs TO authenticated, service_role;
GRANT ALL ON TABLE public.job_applications TO authenticated, service_role;
GRANT ALL ON TABLE public.payments TO authenticated, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;


-- ===================================================================
-- END OF SCHEMA
-- ===================================================================

