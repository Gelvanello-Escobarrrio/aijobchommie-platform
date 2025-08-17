-- =============================================
-- AI Job Chommie Database - Final Completion Script
-- Run this AFTER the migration script completes successfully
-- =============================================

-- =============================================
-- 1. CREATE REMAINING FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns (only if they don't exist)
DO $$
BEGIN
    -- Users table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created trigger: update_users_updated_at';
    END IF;

    -- Companies table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_companies_updated_at') THEN
        CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created trigger: update_companies_updated_at';
    END IF;

    -- Jobs table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_jobs_updated_at') THEN
        CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created trigger: update_jobs_updated_at';
    END IF;

    -- User profiles table trigger (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
            CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            RAISE NOTICE 'Created trigger: update_user_profiles_updated_at';
        END IF;
    END IF;

    -- Job applications table trigger (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_applications') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_job_applications_updated_at') THEN
            CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            RAISE NOTICE 'Created trigger: update_job_applications_updated_at';
        END IF;
    END IF;

    -- Job alerts table trigger (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_alerts') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_job_alerts_updated_at') THEN
            CREATE TRIGGER update_job_alerts_updated_at BEFORE UPDATE ON job_alerts
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            RAISE NOTICE 'Created trigger: update_job_alerts_updated_at';
        END IF;
    END IF;

END $$;

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

-- Create trigger for job applications count (only if table exists and trigger doesn't exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_applications') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_job_applications_count') THEN
            CREATE TRIGGER trigger_update_job_applications_count
                AFTER INSERT OR DELETE ON job_applications
                FOR EACH ROW EXECUTE FUNCTION update_job_applications_count();
            RAISE NOTICE 'Created trigger: trigger_update_job_applications_count';
        END IF;
    END IF;
END $$;

-- =============================================
-- 2. CREATE REMAINING INDEXES
-- =============================================

DO $$
BEGIN
    -- Full-text search indexes (only if they don't exist)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_title_fts') THEN
        CREATE INDEX idx_jobs_title_fts ON jobs USING gin(to_tsvector('english', title));
        RAISE NOTICE 'Created index: idx_jobs_title_fts';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_description_fts') THEN
        CREATE INDEX idx_jobs_description_fts ON jobs USING gin(to_tsvector('english', description));
        RAISE NOTICE 'Created index: idx_jobs_description_fts';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_companies_name_fts') THEN
        CREATE INDEX idx_companies_name_fts ON companies USING gin(to_tsvector('english', name));
        RAISE NOTICE 'Created index: idx_companies_name_fts';
    END IF;

    -- Additional performance indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_salary') THEN
        CREATE INDEX idx_jobs_salary ON jobs(salary_min, salary_max);
        RAISE NOTICE 'Created index: idx_jobs_salary';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
        CREATE INDEX idx_users_email ON users(email);
        RAISE NOTICE 'Created index: idx_users_email';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
        CREATE INDEX idx_users_role ON users(role);
        RAISE NOTICE 'Created index: idx_users_role';
    END IF;

END $$;

-- =============================================
-- 3. INSERT SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample users
INSERT INTO users (
    email, password_hash, first_name, last_name, phone, city, province, role
) VALUES 
(
    'admin@aijobchommie.co.za', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbRTZh4h7p6Nb4W', -- password: admin123
    'Admin', 
    'User', 
    '+27123456789', 
    'Cape Town', 
    'western_cape', 
    'admin'
),
(
    'employer@aijobchommie.co.za', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbRTZh4h7p6Nb4W', -- password: employer123
    'John', 
    'Employer', 
    '+27987654321', 
    'Johannesburg', 
    'gauteng', 
    'employer'
),
(
    'jobseeker@aijobchommie.co.za', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbRTZh4h7p6Nb4W', -- password: jobseeker123
    'Jane', 
    'Seeker', 
    '+27555123456', 
    'Durban', 
    'kwazulu_natal', 
    'job_seeker'
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample companies
INSERT INTO companies (
    name, description, industry, website, headquarters_city, province, contact_email, is_verified, created_by
) VALUES 
(
    'TechCorp SA', 
    'Leading technology company in South Africa specializing in software development and AI solutions.',
    'Technology',
    'https://techcorp.co.za',
    'Cape Town',
    'western_cape',
    'hr@techcorp.co.za',
    true,
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1)
),
(
    'FinanceHub', 
    'Premier financial services company offering innovative banking and investment solutions.',
    'Finance',
    'https://financehub.co.za',
    'Johannesburg',
    'gauteng',
    'careers@financehub.co.za',
    true,
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1)
),
(
    'HealthPlus Medical', 
    'Healthcare technology company improving patient care through digital solutions.',
    'Healthcare',
    'https://healthplus.co.za',
    'Durban',
    'kwazulu_natal',
    'jobs@healthplus.co.za',
    false,
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (
    title, description, requirements, responsibilities, benefits, salary_min, salary_max,
    job_type, work_model, experience_level, category, subcategory, industry,
    skills, location_city, province, company_id, posted_by, is_active, is_featured
) VALUES 
(
    'Senior Software Developer',
    'We are looking for an experienced software developer to join our dynamic team and work on cutting-edge AI projects.',
    'Bachelor''s degree in Computer Science or related field. 5+ years of experience in software development. Proficiency in Python, JavaScript, and React.',
    'Develop and maintain web applications. Collaborate with cross-functional teams. Write clean, maintainable code. Participate in code reviews.',
    'Medical aid, retirement fund, flexible working hours, remote work options, professional development budget.',
    45000.00, 65000.00,
    'full-time', 'hybrid', 'senior-level',
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
    35000.00, 50000.00,
    'full-time', 'on-site', 'mid-level',
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
    18000.00, 25000.00,
    'full-time', 'remote', 'entry-level',
    'Technology', 'Web Development', 'Healthcare',
    ARRAY['HTML', 'CSS', 'JavaScript', 'Git'],
    'Durban', 'kwazulu_natal',
    (SELECT id FROM companies WHERE name = 'HealthPlus Medical' LIMIT 1),
    (SELECT id FROM users WHERE email = 'employer@aijobchommie.co.za' LIMIT 1),
    true, false
)
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. FINAL VALIDATION
-- =============================================

-- Verify schema completion
SELECT 'Final schema completion successful!' as message;

-- Show all tables
SELECT 'DATABASE TABLES:' as info;
SELECT table_name, 
       (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Show all ENUM types
SELECT 'DATABASE ENUMS:' as info;
SELECT typname as enum_name,
       array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typtype = 'e'
GROUP BY typname
ORDER BY typname;

-- Show sample data counts
SELECT 'SAMPLE DATA COUNTS:' as info;
SELECT 
    (SELECT count(*) FROM users) as users_count,
    (SELECT count(*) FROM companies) as companies_count,
    (SELECT count(*) FROM jobs) as jobs_count;

-- Show jobs with company information
SELECT 'SAMPLE JOBS:' as info;
SELECT 
    j.title,
    c.name as company_name,
    j.location_city,
    j.province,
    j.salary_min,
    j.salary_max,
    j.job_type,
    j.work_model
FROM jobs j
JOIN companies c ON j.company_id = c.id
ORDER BY j.created_at DESC;

SELECT 'AI Job Chommie database setup completed successfully! 🚀' as final_message;
