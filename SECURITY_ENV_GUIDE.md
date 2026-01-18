# 🔐 Panduan Keamanan Environment Variables

## ⚠️ PERINGATAN PENTING

**JANGAN PERNAH** push file `.env` atau `.env.local` ke GitHub!

## 🚨 Mengapa File `.env` Berbahaya?

### **Risiko Keamanan:**
1. **Kredensial Terekspos Publik**
   - Supabase URL & API Key bisa dilihat siapa saja
   - Database Anda bisa diakses oleh orang lain
   - Data bisa dicuri, diubah, atau dihapus

2. **Potensi Kerugian:**
   - Hacker bisa exploit database
   - Data pengguna terekspos
   - Biaya Supabase meningkat (abuse)
   - Reputasi aplikasi rusak

3. **Melanggar Best Practices:**
   - GitHub akan warning jika detect secrets
   - Bisa kena suspend account
   - Supabase bisa revoke API key

---

## ✅ Cara yang BENAR: Environment Variables

### **Development (Local)**

File `.env.local` hanya untuk development lokal:

```bash
# .env.local (JANGAN DI-PUSH!)
VITE_SUPABASE_URL=https://lerjbwlllftdnrybljnx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC
```

**Proteksi:**
- ✅ Sudah ada di `.gitignore`
- ✅ Git akan ignore file ini otomatis
- ✅ Tidak akan ter-commit

### **Production (Vercel)**

**JANGAN** push `.env` ke GitHub. Gunakan Vercel Environment Variables:

#### **Cara 1: Vercel Dashboard (Recommended)**

1. Login ke https://vercel.com
2. Pilih project Anda
3. Klik **Settings** → **Environment Variables**
4. Tambahkan variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://lerjbwlllftdnrybljnx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC` | Production, Preview, Development |

5. Klik **Save**
6. Redeploy aplikasi

#### **Cara 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Input: https://lerjbwlllftdnrybljnx.supabase.co
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# Input: sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC
# Select: Production, Preview, Development

# Deploy
vercel --prod
```

---

## 📋 File yang AMAN vs TIDAK AMAN

### ✅ **AMAN untuk di-push:**

```
✅ .env.example          # Template tanpa nilai asli
✅ .gitignore            # Proteksi file sensitif
✅ vercel.json           # Konfigurasi deployment
✅ package.json          # Dependencies
✅ src/**/*.jsx          # Source code
✅ README.md             # Dokumentasi
✅ database/*.sql        # Database schema
```

### ❌ **TIDAK AMAN untuk di-push:**

```
❌ .env                  # Kredensial production
❌ .env.local            # Kredensial development
❌ .env.production       # Kredensial production
❌ .env.development      # Kredensial development
❌ node_modules/         # Dependencies (besar)
❌ dist/                 # Build output
❌ *.log                 # Log files
```

---

## 🔍 Verifikasi Keamanan

### **Cek File yang Akan di-commit:**

```bash
# Lihat file yang akan di-commit
git status

# Pastikan .env TIDAK muncul di list
# Jika muncul, JANGAN commit!
```

### **Cek .gitignore:**

```bash
# Pastikan .env ada di .gitignore
cat .gitignore | grep .env
```

Output yang benar:
```
.env
.env.local
.env.*
!.env.example
```

### **Cek History Git:**

```bash
# Cek apakah .env pernah di-commit
git log --all --full-history -- .env
git log --all --full-history -- .env.local

# Jika ada output, .env pernah ter-commit!
# Lihat bagian "Jika .env Sudah Ter-commit" di bawah
```

---

## 🚨 Jika .env Sudah Ter-commit

Jika Anda tidak sengaja commit `.env`, SEGERA lakukan:

### **Step 1: Hapus dari Git History**

```bash
# Hapus .env dari semua history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (HATI-HATI!)
git push origin --force --all
```

### **Step 2: Revoke API Keys**

1. Login ke Supabase Dashboard
2. Klik **Settings** → **API**
3. Klik **Reset** pada Anon Key
4. Copy key baru
5. Update di Vercel Environment Variables
6. Update di `.env.local` lokal

### **Step 3: Rotate Credentials**

Ganti semua credentials yang terekspos:
- Supabase API Keys
- Database passwords
- Service role keys
- Semua secrets lainnya

---

## 📝 Template .env.example

File `.env.example` adalah template yang AMAN untuk di-push:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example:
# VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cara Pakai:**
```bash
# Copy template
cp .env.example .env.local

# Edit dengan nilai asli
nano .env.local
```

---

## 🎯 Checklist Keamanan

Sebelum push ke GitHub, pastikan:

- [ ] `.env` ada di `.gitignore`
- [ ] `.env.local` ada di `.gitignore`
- [ ] `git status` tidak menampilkan file `.env`
- [ ] `.env.example` tidak berisi nilai asli
- [ ] Tidak ada API keys hardcoded di source code
- [ ] Tidak ada passwords di source code
- [ ] Environment variables sudah diset di Vercel
- [ ] Sudah test di production

---

## 🔐 Best Practices

### **1. Gunakan Environment Variables**
```javascript
// ✅ BENAR
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ❌ SALAH
const supabaseUrl = "https://lerjbwlllftdnrybljnx.supabase.co";
```

### **2. Prefix untuk Vite**
Semua env vars di Vite harus prefix `VITE_`:
```bash
VITE_SUPABASE_URL=...      # ✅ Bisa diakses di client
SUPABASE_URL=...           # ❌ Tidak bisa diakses
```

### **3. Pisahkan Env per Environment**
```bash
.env.local          # Development
.env.production     # Production (JANGAN DI-PUSH!)
.env.test           # Testing
```

### **4. Rotate Keys Secara Berkala**
- Ganti API keys setiap 3-6 bulan
- Ganti setelah team member keluar
- Ganti jika ada security breach

### **5. Monitor Usage**
- Cek Supabase usage dashboard
- Set up alerts untuk unusual activity
- Review logs secara berkala

---

## 🆘 Troubleshooting

### **Problem: "Environment variables not found"**

**Solusi:**
```bash
# Pastikan file .env.local ada
ls -la .env.local

# Pastikan format benar (no spaces)
VITE_SUPABASE_URL=https://...
# BUKAN: VITE_SUPABASE_URL = https://...

# Restart dev server
npm run dev
```

### **Problem: "Env vars not working in production"**

**Solusi:**
1. Cek Vercel Dashboard → Environment Variables
2. Pastikan prefix `VITE_` ada
3. Pastikan environment dipilih (Production)
4. Redeploy aplikasi

### **Problem: "API key exposed in GitHub"**

**Solusi:**
1. Revoke key di Supabase
2. Remove dari Git history (lihat di atas)
3. Generate key baru
4. Update di Vercel
5. Force push repository

---

## 📚 Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

## 🎯 Quick Reference

### **Setup Development:**
```bash
cp .env.example .env.local
# Edit .env.local dengan nilai asli
npm run dev
```

### **Setup Production (Vercel):**
```bash
# Via Dashboard
Vercel → Settings → Environment Variables → Add

# Via CLI
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### **Verify Security:**
```bash
git status                    # .env tidak boleh muncul
cat .gitignore | grep .env    # Harus ada
git log -- .env               # Harus kosong
```

---

**Dibuat:** 2026-01-18  
**Status:** ✅ Security Guide  
**Priority:** 🔴 CRITICAL
