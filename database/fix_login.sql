-- ============================================
-- FIX LOGIN ISSUE - VERIFY & CREATE ADMIN
-- ============================================
-- Run this script in Supabase SQL Editor
-- ============================================

-- 1. Check if admin_users table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_users'
) as table_exists;

-- 2. Check existing admin users
SELECT 
    id,
    username,
    email,
    password_hash,
    is_active,
    created_at,
    last_login
FROM public.admin_users;

-- 3. If no admin users exist, create default admin
-- Username: admin
-- Password: admin123
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 4. Verify admin user was created
SELECT 
    id,
    username,
    email,
    password_hash,
    is_active
FROM public.admin_users
WHERE username = 'admin';

-- 5. If you need to reset password for existing admin
-- Uncomment and run this:
-- UPDATE public.admin_users
-- SET password_hash = 'admin123'
-- WHERE username = 'admin';

-- 6. Check RLS policies (Row Level Security)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'admin_users';

-- 7. Test query (same as login does)
SELECT *
FROM public.admin_users
WHERE username = 'admin'
AND is_active = true;

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If you get "permission denied" error:
-- Run this to temporarily disable RLS for testing:
-- ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable RLS:
-- ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- If you need to create the table from scratch:
/*
CREATE TABLE IF NOT EXISTS public.admin_users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view their own data"
    ON public.admin_users FOR SELECT
    USING (true);

CREATE POLICY "Admins can update their own data"
    ON public.admin_users FOR UPDATE
    USING (true);

CREATE POLICY "Authenticated users can insert admin users"
    ON public.admin_users FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
*/

-- ============================================
-- EXPECTED RESULT
-- ============================================
-- After running this script, you should see:
-- 
-- id | username | email              | password_hash | is_active
-- ---+----------+--------------------+---------------+-----------
-- 1  | admin    | admin@dramabox.com | admin123      | true
--
-- Now you can login with:
-- Username: admin
-- Password: admin123
-- ============================================
