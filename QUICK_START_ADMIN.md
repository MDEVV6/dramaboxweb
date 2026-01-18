# 🎯 Quick Start: Membuat Admin User (5 Menit)

## Langkah Singkat

### 1️⃣ Buka Supabase SQL Editor
- Login ke https://app.supabase.com
- Pilih project: `lerjbwlllftdnrybljnx`
- Klik **SQL Editor** (ikon ⚡ di sidebar)
- Klik **New Query**

### 2️⃣ Copy & Paste Query Ini
```sql
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;
```

### 3️⃣ Klik Run (atau tekan Ctrl+Enter)

### 4️⃣ Verifikasi
```sql
SELECT * FROM public.admin_users;
```

### 5️⃣ Login ke Admin Panel
```
URL: http://localhost:5173/admin (local)
     https://your-app.vercel.app/admin (production)

Username: admin
Password: admin123
```

---

## ✅ Selesai!

Anda sekarang bisa login ke admin panel dan:
- ✅ Mengelola artikel
- ✅ Upload drama & episode
- ✅ Mengatur ads
- ✅ Melihat analytics
- ✅ Konfigurasi site settings

---

## ⚠️ PENTING

**GANTI PASSWORD SETELAH LOGIN PERTAMA!**

Cara ganti password:
```sql
UPDATE public.admin_users
SET password_hash = 'password_baru_anda'
WHERE username = 'admin';
```

---

## 📚 Dokumentasi Lengkap

Lihat file `ADMIN_SETUP_GUIDE.md` untuk:
- Cara alternatif membuat admin
- Troubleshooting
- Security best practices
- Query berguna

---

## 🆘 Troubleshooting Cepat

**Error: "Table admin_users does not exist"**
→ Jalankan file `database/database.sql` terlebih dahulu

**Error: "Invalid credentials"**
→ Pastikan username dan password benar (case-sensitive)

**Error: "Permission denied"**
→ Cek RLS policies atau disable RLS sementara

---

**File Terkait:**
- `database/create_admin.sql` - Script SQL siap pakai
- `database/database.sql` - Full database schema
- `ADMIN_SETUP_GUIDE.md` - Panduan lengkap
- `VERCEL_DEPLOYMENT.md` - Panduan deployment

**Need help?** Check browser console (F12) for errors.
