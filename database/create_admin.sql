-- ============================================
-- QUICK ADMIN USER CREATION
-- ============================================
-- Copy dan paste script ini ke Supabase SQL Editor
-- untuk membuat admin user dengan cepat
-- ============================================

-- 1. Buat admin user default
-- Username: admin
-- Password: admin123
-- ⚠️ GANTI PASSWORD SETELAH LOGIN PERTAMA!

INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 2. Verifikasi admin user sudah dibuat
SELECT 
    id,
    username,
    email,
    is_active,
    created_at
FROM public.admin_users
WHERE username = 'admin';

-- ============================================
-- CUSTOM ADMIN USER
-- ============================================
-- Uncomment dan edit baris di bawah untuk membuat admin custom
-- Ganti 'your_username', 'your_email', dan 'your_password'

-- INSERT INTO public.admin_users (username, email, password_hash, is_active)
-- VALUES ('your_username', 'your_email@example.com', 'your_password', TRUE)
-- ON CONFLICT (username) DO NOTHING;

-- ============================================
-- HASIL
-- ============================================
-- Jika berhasil, Anda akan melihat output seperti ini:
-- 
-- id | username | email              | is_active | created_at
-- ---+----------+--------------------+-----------+------------------------
-- 1  | admin    | admin@dramabox.com | true      | 2026-01-18 00:00:00+00
--
-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- URL Local: http://localhost:5173/admin
-- URL Production: https://your-app.vercel.app/admin
-- 
-- Username: admin
-- Password: admin123
-- 
-- ⚠️ PENTING: Ganti password setelah login pertama!
-- ============================================
