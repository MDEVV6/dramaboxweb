# 🔐 Panduan Membuat Akun Admin di Supabase

## 📋 Daftar Isi
1. [Cara Cepat (Menggunakan SQL Editor)](#cara-1-sql-editor-recommended)
2. [Cara Manual (Menggunakan Table Editor)](#cara-2-table-editor)
3. [Cara Otomatis (Setup Database Lengkap)](#cara-3-setup-database-lengkap)
4. [Login ke Admin Panel](#login-ke-admin-panel)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Cara 1: SQL Editor (Recommended)

### **Step 1: Buka Supabase SQL Editor**
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda: `lerjbwlllftdnrybljnx`
3. Klik **SQL Editor** di sidebar kiri
4. Klik **New Query**

### **Step 2: Jalankan Query Berikut**

#### **A. Buat Admin User Baru**
```sql
-- Buat admin user baru
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;
```

**Penjelasan:**
- **Username:** `admin`
- **Email:** `admin@dramabox.com`
- **Password:** `admin123` (⚠️ Ganti setelah login pertama!)
- **Status:** Active

#### **B. Atau Buat dengan Username Custom**
```sql
-- Ganti 'namaanda' dan 'email@anda.com' dengan data Anda
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('namaanda', 'email@anda.com', 'password123', TRUE)
ON CONFLICT (username) DO NOTHING;
```

### **Step 3: Verifikasi**
```sql
-- Cek apakah admin sudah terbuat
SELECT id, username, email, is_active, created_at 
FROM public.admin_users;
```

Jika berhasil, Anda akan melihat data admin yang baru dibuat.

---

## 📝 Cara 2: Table Editor

### **Step 1: Buka Table Editor**
1. Login ke Supabase Dashboard
2. Klik **Table Editor** di sidebar
3. Pilih tabel **`admin_users`**

### **Step 2: Insert New Row**
1. Klik tombol **Insert** → **Insert row**
2. Isi data berikut:

| Field | Value | Keterangan |
|-------|-------|------------|
| `username` | `admin` | Username untuk login |
| `email` | `admin@dramabox.com` | Email admin |
| `password_hash` | `admin123` | Password (sementara) |
| `is_active` | `TRUE` | Centang checkbox |

3. Klik **Save**

### **Step 3: Verifikasi**
- Refresh halaman Table Editor
- Pastikan row baru muncul di tabel `admin_users`

---

## 🎯 Cara 3: Setup Database Lengkap

Jika Anda belum menjalankan database schema sama sekali, ikuti langkah ini:

### **Step 1: Jalankan Database Schema**
1. Buka **SQL Editor** di Supabase
2. Copy seluruh isi file `database/database.sql`
3. Paste ke SQL Editor
4. Klik **Run**

**File location:** `e:\xampp\htdocs\Dracin\dramabox-web\database\database.sql`

### **Step 2: Tunggu Proses Selesai**
Schema akan membuat:
- ✅ Semua tabel (dramas, episodes, admin_users, articles, dll)
- ✅ Default admin user (username: `admin`, password: `admin123`)
- ✅ Storage buckets
- ✅ RLS policies
- ✅ Functions & triggers

### **Step 3: Verifikasi**
```sql
-- Cek semua tabel yang dibuat
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Cek admin users
SELECT * FROM public.admin_users;
```

---

## 🔑 Login ke Admin Panel

### **Credentials Default**
Setelah membuat admin user, gunakan credentials berikut untuk login:

**Local Development:**
```
URL: http://localhost:5173/admin
Username: admin
Password: admin123
```

**Production (Vercel):**
```
URL: https://your-app.vercel.app/admin
Username: admin
Password: admin123
```

### **Langkah Login:**
1. Buka URL admin panel
2. Masukkan **username** dan **password**
3. Klik **Login**
4. Anda akan diarahkan ke `/admin/dashboard`

---

## 🔧 Troubleshooting

### **Problem 1: "Invalid credentials" saat login**

**Penyebab:**
- Username atau password salah
- Admin user belum dibuat di database

**Solusi:**
```sql
-- Cek apakah admin user ada
SELECT * FROM public.admin_users WHERE username = 'admin';

-- Jika tidak ada, buat baru
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;
```

### **Problem 2: "Table admin_users does not exist"**

**Penyebab:**
- Database schema belum dijalankan

**Solusi:**
1. Jalankan file `database/database.sql` di SQL Editor
2. Atau jalankan query ini untuk membuat tabel:

```sql
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
```

### **Problem 3: "Permission denied" saat insert**

**Penyebab:**
- RLS (Row Level Security) policies belum dikonfigurasi dengan benar

**Solusi:**
```sql
-- Disable RLS sementara untuk insert manual
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Insert admin
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Enable RLS kembali
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
```

### **Problem 4: Lupa Password**

**Solusi:**
```sql
-- Reset password admin
UPDATE public.admin_users
SET password_hash = 'newpassword123'
WHERE username = 'admin';
```

### **Problem 5: Admin tidak bisa akses di production**

**Penyebab:**
- Environment variables tidak diset di Vercel
- Routing issue (sudah diperbaiki di `vercel.json`)

**Solusi:**
1. Pastikan env vars sudah diset di Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Pastikan `vercel.json` sudah ada rewrites config
3. Redeploy aplikasi

---

## 🔐 Keamanan & Best Practices

### **⚠️ PENTING: Ganti Password Default!**

Setelah login pertama kali, **SEGERA GANTI PASSWORD** dengan cara:

```sql
-- Ganti password admin
UPDATE public.admin_users
SET password_hash = 'password_baru_yang_kuat'
WHERE username = 'admin';
```

### **Rekomendasi Password:**
- Minimal 12 karakter
- Kombinasi huruf besar, kecil, angka, dan simbol
- Jangan gunakan password yang mudah ditebak

### **Membuat Admin User Tambahan:**

```sql
-- Buat admin kedua
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin2', 'admin2@dramabox.com', 'secure_password_here', TRUE);
```

### **Nonaktifkan Admin User:**

```sql
-- Nonaktifkan admin
UPDATE public.admin_users
SET is_active = FALSE
WHERE username = 'admin2';
```

### **Hapus Admin User:**

```sql
-- Hapus admin (hati-hati!)
DELETE FROM public.admin_users
WHERE username = 'admin2';
```

---

## 📊 Query Berguna

### **Lihat Semua Admin Users:**
```sql
SELECT 
    id,
    username,
    email,
    is_active,
    created_at,
    last_login
FROM public.admin_users
ORDER BY created_at DESC;
```

### **Cek Admin yang Aktif:**
```sql
SELECT username, email, last_login
FROM public.admin_users
WHERE is_active = TRUE;
```

### **Update Last Login:**
```sql
UPDATE public.admin_users
SET last_login = NOW()
WHERE username = 'admin';
```

### **Cek Total Admin:**
```sql
SELECT 
    COUNT(*) as total_admins,
    COUNT(*) FILTER (WHERE is_active = TRUE) as active_admins,
    COUNT(*) FILTER (WHERE is_active = FALSE) as inactive_admins
FROM public.admin_users;
```

---

## 🎯 Quick Reference

### **Default Credentials:**
```
Username: admin
Password: admin123
```

### **Admin Panel URLs:**
```
Local:      http://localhost:5173/admin
Production: https://your-app.vercel.app/admin
```

### **Quick Insert Query:**
```sql
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;
```

### **Quick Verify Query:**
```sql
SELECT * FROM public.admin_users;
```

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. **Cek Supabase Logs:**
   - Dashboard → Logs → Database Logs

2. **Cek Browser Console:**
   - F12 → Console tab
   - Lihat error saat login

3. **Test Koneksi Supabase:**
   ```javascript
   // Buka browser console di halaman admin
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   ```

4. **Verifikasi RLS Policies:**
   ```sql
   -- Lihat semua policies untuk admin_users
   SELECT * FROM pg_policies 
   WHERE tablename = 'admin_users';
   ```

---

**Dibuat:** 2026-01-18  
**Status:** ✅ Ready to Use  
**Database Version:** 3.0.0
