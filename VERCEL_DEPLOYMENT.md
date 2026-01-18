# 🚀 Panduan Deploy ke Vercel - DramaBox Web

## ❌ Masalah yang Terjadi

Saat deploy ke Vercel, akses ke `/admin` dan route lainnya menghasilkan **404 Not Found** karena Vercel tidak tahu bahwa aplikasi ini adalah Single Page Application (SPA) yang menggunakan client-side routing.

## ✅ Solusi yang Sudah Diterapkan

### 1. **Update `vercel.json`**
File `vercel.json` sudah diupdate dengan konfigurasi `rewrites` yang mengarahkan semua request ke `index.html`:

```json
{
    "buildCommand": "npm install && npm run build",
    "installCommand": "npm install",
    "framework": "vite",
    "outputDirectory": "dist",
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}
```

**Penjelasan:**
- `rewrites` memastikan semua route (termasuk `/admin`, `/admin/dashboard`, dll) diarahkan ke `index.html`
- React Router akan menangani routing di client-side
- Ini adalah solusi standar untuk SPA di Vercel

---

## 📋 Langkah-langkah Deploy ke Vercel

### **Step 1: Setup Environment Variables di Vercel**

1. Buka dashboard Vercel project Anda
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan variable berikut:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://lerjbwlllftdnrybljnx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC` | Production, Preview, Development |

**⚠️ PENTING:** 
- Pastikan prefix `VITE_` ada di setiap variable
- Centang semua environment (Production, Preview, Development)

### **Step 2: Push ke GitHub**

```bash
git add .
git commit -m "Fix: Add Vercel rewrites for SPA routing"
git push origin main
```

### **Step 3: Deploy Otomatis**

Vercel akan otomatis mendeteksi push dan melakukan deployment baru.

### **Step 4: Verifikasi Deployment**

Setelah deployment selesai, coba akses:
- ✅ `https://your-app.vercel.app/`
- ✅ `https://your-app.vercel.app/admin`
- ✅ `https://your-app.vercel.app/admin/dashboard`
- ✅ `https://your-app.vercel.app/artikel`

Semua route seharusnya berfungsi dengan baik!

---

## 🔧 Troubleshooting

### **Masalah 1: Masih 404 setelah deploy**

**Solusi:**
1. Pastikan `vercel.json` sudah ter-commit dan ter-push
2. Trigger redeploy manual di Vercel dashboard
3. Clear cache browser (Ctrl + Shift + R)

### **Masalah 2: Environment variables tidak terbaca**

**Solusi:**
1. Cek di Vercel Settings → Environment Variables
2. Pastikan prefix `VITE_` ada
3. Redeploy setelah menambah/mengubah env vars

### **Masalah 3: Build gagal**

**Solusi:**
```bash
# Test build locally dulu
npm run build

# Jika berhasil, push ke GitHub
git push origin main
```

### **Masalah 4: Admin tidak bisa login**

**Solusi:**
1. Pastikan Supabase URL dan Key sudah benar di Vercel
2. Cek Supabase dashboard untuk memastikan user admin sudah dibuat
3. Cek console browser untuk error (F12)

---

## 📝 Catatan Penting

### **File yang Harus Di-commit:**
- ✅ `vercel.json` (sudah diupdate)
- ✅ `.env.example` (untuk dokumentasi)
- ❌ `.env.local` (JANGAN di-commit, sudah ada di .gitignore)

### **Environment Variables:**
- Semua variable harus menggunakan prefix `VITE_` untuk Vite
- Set di Vercel dashboard, BUKAN di file `.env.local`
- `.env.local` hanya untuk development lokal

### **Routing:**
- Semua routing ditangani oleh React Router
- `vercel.json` rewrites memastikan SPA routing bekerja
- Tidak perlu konfigurasi tambahan di Vercel

---

## 🎯 Checklist Deploy

Sebelum deploy, pastikan:

- [ ] `vercel.json` sudah ada konfigurasi `rewrites`
- [ ] Environment variables sudah diset di Vercel dashboard
- [ ] Build lokal berhasil (`npm run build`)
- [ ] Semua perubahan sudah di-commit dan di-push
- [ ] Vercel sudah terhubung dengan GitHub repo

---

## 🔗 Link Berguna

- [Vercel SPA Routing Documentation](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Router Documentation](https://reactrouter.com/)

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. **Cek Vercel Logs:**
   - Buka deployment di Vercel dashboard
   - Klik "View Function Logs"
   - Lihat error yang muncul

2. **Cek Browser Console:**
   - Tekan F12
   - Lihat tab Console untuk error
   - Lihat tab Network untuk failed requests

3. **Test Local Production Build:**
   ```bash
   npm run build
   npm run preview
   ```
   Akses `http://localhost:4173/admin` untuk test

---

**Dibuat:** 2026-01-18  
**Status:** ✅ Siap Deploy
