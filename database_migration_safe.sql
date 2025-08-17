-- =============================================
-- AI Job Chommie Database - Safe Migration Script
-- This script safely updates existing schema without conflicts
-- =============================================

-- Step 1: Check current state and add missing columns
DO $$
BEGIN
    -- Check if company_id column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'company_id'
    ) THEN
        RAISE NOTICE 'Adding company_id column to jobs table...';
        ALTER TABLE jobs ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
    ELSE
        RAISE NOTICE 'company_id column already exists in jobs table';
    END IF;

    -- Check if posted_by column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'posted_by'
    ) THEN
        RAISE NOTICE 'Adding posted_by column to jobs table...';
        ALTER TABLE jobs ADD COLUMN posted_by UUID REFERENCES users(id) ON DELETE SET NULL;
    ELSE
        RAISE NOTICE 'posted_by column already exists in jobs table';
    END IF;

    -- Check if is_featured column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'is_featured'
    ) THEN
        RAISE NOTICE 'Adding is_featured column to jobs table...';
        ALTER TABLE jobs ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    ELSE
        RAISE NOTICE 'is_featured column already exists in jobs table';
    END IF;

    -- Check if views_count column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'views_count'
    ) THEN
        RAISE NOTICE 'Adding views_count column to jobs table...';
        ALTER TABLE jobs ADD COLUMN views_count INTEGER DEFAULT 0;
    ELSE
        RAISE NOTICE 'views_count column already exists in jobs table';
    END IF;

    -- Check if applications_count column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'applications_count'
    ) THEN
        RAISE NOTICE 'Adding applications_count column to jobs table...';
        ALTER TABLE jobs ADD COLUMN applications_count INTEGER DEFAULT 0;
    ELSE
        RAISE NOTICE 'applications_count column already exists in jobs table';
    END IF;

    -- Check if external_url column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'external_url'
    ) THEN
        RAISE NOTICE 'Adding external_url column to jobs table...';
        ALTER TABLE jobs ADD COLUMN external_url TEXT;
    ELSE
        RAISE NOTICE 'external_url column already exists in jobs table';
    END IF;

    -- Check if application_deadline column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'application_deadline'
    ) THEN
        RAISE NOTICE 'Adding application_deadline column to jobs table...';
        ALTER TABLE jobs ADD COLUMN application_deadline DATE;
    ELSE
        RAISE NOTICE 'application_deadline column already exists in jobs table';
    END IF;

    -- Check if skills column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'skills'
    ) THEN
        RAISE NOTICE 'Adding skills column to jobs table...';
        ALTER TABLE jobs ADD COLUMN skills TEXT[];
    ELSE
        RAISE NOTICE 'skills column already exists in jobs table';
    END IF;

    -- Check if education_requirements column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'education_requirements'
    ) THEN
        RAISE NOTICE 'Adding education_requirements column to jobs table...';
        ALTER TABLE jobs ADD COLUMN education_requirements TEXT;
    ELSE
        RAISE NOTICE 'education_requirements column already exists in jobs table';
    END IF;

    -- Check if location_city column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'location_city'
    ) THEN
        RAISE NOTICE 'Adding location_city column to jobs table...';
        ALTER TABLE jobs ADD COLUMN location_city VARCHAR(100);
    ELSE
        RAISE NOTICE 'location_city column already exists in jobs table';
    END IF;

    -- Check if is_remote column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'is_remote'
    ) THEN
        RAISE NOTICE 'Adding is_remote column to jobs table...';
        ALTER TABLE jobs ADD COLUMN is_remote BOOLEAN DEFAULT FALSE;
    ELSE
        RAISE NOTICE 'is_remote column already exists in jobs table';
    END IF;

    -- Check if benefits column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'benefits'
    ) THEN
        RAISE NOTICE 'Adding benefits column to jobs table...';
        ALTER TABLE jobs ADD COLUMN benefits TEXT;
    ELSE
        RAISE NOTICE 'benefits column already exists in jobs table';
    END IF;

    -- Check if responsibilities column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'responsibilities'
    ) THEN
        RAISE NOTICE 'Adding responsibilities column to jobs table...';
        ALTER TABLE jobs ADD COLUMN responsibilities TEXT;
    ELSE
        RAISE NOTICE 'responsibilities column already exists in jobs table';
    END IF;

    -- Check if salary_currency column exists in jobs table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'salary_currency'
    ) THEN
        RAISE NOTICE 'Adding salary_currency column to jobs table...';
        ALTER TABLE jobs ADD COLUMN salary_currency VARCHAR(3) DEFAULT 'ZAR';
    ELSE
        RAISE NOTICE 'salary_currency column already exists in jobs table';
    END IF;

END $$;

-- Step 2: Create missing indexes safely
DO $$
BEGIN
    -- Create indexes only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_company') THEN
        CREATE INDEX idx_jobs_company ON jobs(company_id);
        RAISE NOTICE 'Created index: idx_jobs_company';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_posted_by') THEN
        CREATE INDEX idx_jobs_posted_by ON jobs(posted_by);
        RAISE NOTICE 'Created index: idx_jobs_posted_by';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_featured') THEN
        CREATE INDEX idx_jobs_featured ON jobs(is_featured);
        RAISE NOTICE 'Created index: idx_jobs_featured';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_remote') THEN
        CREATE INDEX idx_jobs_remote ON jobs(is_remote);
        RAISE NOTICE 'Created index: idx_jobs_remote';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_deadline') THEN
        CREATE INDEX idx_jobs_deadline ON jobs(application_deadline);
        RAISE NOTICE 'Created index: idx_jobs_deadline';
    END IF;

END $$;

-- Step 3: Verify the migration
SELECT 'Migration completed successfully!' as message;

-- Check all columns in jobs table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
ORDER BY ordinal_position;
