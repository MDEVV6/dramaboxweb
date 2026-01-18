# 🚀 Vercel Integration Guide - DramaBox Web

## ✅ Status Integrasi

**Project ID:** `prj_SjOY93xmlk4bpv9jk9XceIOG0IvQ`

Project ini **SUDAH TERINTEGRASI** dengan Vercel! Setiap push ke GitHub akan otomatis trigger deployment.

---

## 📋 Informasi Project

### **Vercel Project Details:**
```
Project ID: prj_SjOY93xmlk4bpv9jk9XceIOG0IvQ
Framework: Vite
Build Command: npm install && npm run build
Output Directory: dist
Node Version: 18.x (recommended)
```

### **Repository:**
```
GitHub: MDEVV6/dramaboxweb
Branch: main
Auto-Deploy: ✅ Enabled
```

---

## 🔗 Cara Akses Project di Vercel

### **Method 1: Via Vercel Dashboard**

1. Login ke https://vercel.com
2. Pilih project **dramabox-web**
3. Atau akses langsung: https://vercel.com/dashboard

### **Method 2: Via Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Link project (sudah configured)
vercel link

# Deploy
vercel --prod
```

---

## 🌐 URLs

### **Production URL:**
```
https://dramabox-web.vercel.app
# atau custom domain jika sudah diset
```

### **Preview URLs:**
Setiap push ke branch lain akan generate preview URL:
```
https://dramabox-web-git-[branch-name]-[team].vercel.app
```

### **Admin Panel:**
```
Production: https://dramabox-web.vercel.app/admin
Preview: https://dramabox-web-git-[branch]-[team].vercel.app/admin
```

---

## ⚙️ Environment Variables Setup

### **Required Variables:**

Tambahkan di Vercel Dashboard → Settings → Environment Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://lerjbwlllftdnrybljnx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC` | Production, Preview, Development |

### **Cara Menambahkan:**

#### **Via Dashboard:**
1. Buka https://vercel.com/dashboard
2. Pilih project **dramabox-web**
3. Klik **Settings** → **Environment Variables**
4. Klik **Add New**
5. Masukkan Name, Value, dan pilih Environments
6. Klik **Save**
7. **Redeploy** project untuk apply changes

#### **Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste: https://lerjbwlllftdnrybljnx.supabase.co
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC
# Select: Production, Preview, Development

# Redeploy
vercel --prod
```

---

## 🔄 Deployment Workflow

### **Automatic Deployment (Recommended):**

```
1. Make changes locally
   ↓
2. Commit changes
   git add .
   git commit -m "Your message"
   ↓
3. Push to GitHub
   git push origin main
   ↓
4. Vercel auto-detects push
   ↓
5. Vercel builds & deploys
   ↓
6. Deployment complete! ✅
```

### **Manual Deployment via CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 📦 Build Configuration

### **Current Configuration (`vercel.json`):**

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

### **What This Does:**
- ✅ **buildCommand**: Install deps & build project
- ✅ **framework**: Tells Vercel this is a Vite project
- ✅ **outputDirectory**: Where build files are located
- ✅ **rewrites**: Enables client-side routing (fixes 404 on /admin)

---

## 🎯 Deployment Checklist

Sebelum deploy, pastikan:

### **Code:**
- [ ] All changes committed
- [ ] No console errors
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview works (`npm run preview`)

### **Environment:**
- [ ] Environment variables set di Vercel
- [ ] Supabase credentials correct
- [ ] Database schema deployed

### **Configuration:**
- [ ] `vercel.json` configured
- [ ] `.gitignore` protects sensitive files
- [ ] `package.json` scripts correct

### **Testing:**
- [ ] Test locally first
- [ ] Check all routes work
- [ ] Admin login functional
- [ ] Database connections work

---

## 🔍 Monitoring & Logs

### **View Deployment Logs:**

1. **Via Dashboard:**
   - Vercel Dashboard → Project → Deployments
   - Click on deployment → View Function Logs

2. **Via CLI:**
   ```bash
   vercel logs [deployment-url]
   ```

### **Real-time Logs:**
```bash
vercel logs --follow
```

### **Check Build Status:**
```bash
vercel inspect [deployment-url]
```

---

## 🐛 Troubleshooting

### **Problem 1: Build Fails**

**Error:** `npm install failed`

**Solution:**
```bash
# Test build locally
npm install
npm run build

# If success, push to GitHub
git push origin main
```

### **Problem 2: Environment Variables Not Working**

**Error:** `Cannot read VITE_SUPABASE_URL`

**Solution:**
1. Check Vercel Dashboard → Environment Variables
2. Ensure prefix `VITE_` exists
3. Ensure all environments selected (Production, Preview, Development)
4. Redeploy after adding env vars

### **Problem 3: 404 on /admin Route**

**Error:** `404 Not Found` when accessing `/admin`

**Solution:**
- ✅ Already fixed with `rewrites` in `vercel.json`
- If still occurs, redeploy project

### **Problem 4: Deployment Stuck**

**Error:** Deployment taking too long

**Solution:**
```bash
# Cancel current deployment
vercel cancel

# Redeploy
vercel --prod
```

### **Problem 5: Custom Domain Not Working**

**Error:** Domain not resolving

**Solution:**
1. Vercel Dashboard → Project → Settings → Domains
2. Add custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

---

## 🚀 Advanced Features

### **1. Preview Deployments**

Setiap branch mendapat preview URL:
```bash
# Create new branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature

# Vercel auto-creates preview
# URL: https://dramabox-web-git-feature-new-feature-[team].vercel.app
```

### **2. Rollback Deployment**

```bash
# Via Dashboard
Deployments → Click on previous deployment → Promote to Production

# Via CLI
vercel rollback [deployment-url]
```

### **3. Custom Domains**

```bash
# Add domain via CLI
vercel domains add yourdomain.com

# Or via Dashboard
Settings → Domains → Add Domain
```

### **4. Team Collaboration**

```bash
# Invite team members
vercel teams invite member@email.com

# Set team as default
vercel switch [team-name]
```

---

## 📊 Performance Optimization

### **1. Build Optimization:**

```json
// vite.config.js
export default {
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
}
```

### **2. Caching:**

Vercel automatically caches:
- Static assets (images, CSS, JS)
- Build outputs
- Dependencies

### **3. Edge Functions (Optional):**

```javascript
// api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Edge!' });
}
```

---

## 🔐 Security Best Practices

### **1. Environment Variables:**
- ✅ Never commit `.env` files
- ✅ Use Vercel Environment Variables
- ✅ Rotate keys regularly

### **2. Authentication:**
- ✅ Protect admin routes
- ✅ Use secure session storage
- ✅ Implement CSRF protection

### **3. HTTPS:**
- ✅ Vercel provides free SSL
- ✅ Force HTTPS redirects
- ✅ Use secure headers

---

## 📱 Vercel CLI Commands

### **Installation:**
```bash
npm install -g vercel
```

### **Common Commands:**

```bash
# Login
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# View project info
vercel inspect

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add [name]

# List environment variables
vercel env ls
```

---

## 🎨 Custom Configuration

### **Headers:**

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **Redirects:**

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

---

## 📈 Analytics

### **Enable Vercel Analytics:**

1. **Via Dashboard:**
   - Project → Analytics → Enable

2. **Via Code:**
   ```bash
   npm install @vercel/analytics
   ```

   ```javascript
   // src/main.jsx
   import { Analytics } from '@vercel/analytics/react';

   ReactDOM.createRoot(document.getElementById('root')).render(
     <>
       <App />
       <Analytics />
     </>
   );
   ```

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Documentation** | https://vercel.com/docs |
| **CLI Docs** | https://vercel.com/docs/cli |
| **Status Page** | https://vercel-status.com |
| **Community** | https://github.com/vercel/vercel/discussions |
| **Support** | https://vercel.com/support |

---

## 📞 Quick Actions

### **Deploy Now:**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### **View Deployment:**
```
https://vercel.com/dashboard
```

### **Check Logs:**
```
Dashboard → Deployments → Latest → Function Logs
```

### **Update Env Vars:**
```
Dashboard → Settings → Environment Variables → Add/Edit
```

---

## ✅ Integration Checklist

- [x] Project linked to Vercel ✅
- [x] `vercel.json` configured ✅
- [x] Rewrites for SPA routing ✅
- [x] `.gitignore` protects sensitive files ✅
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Team members invited (optional)

---

## 🎯 Next Steps

### **1. Set Environment Variables**
```
Dashboard → Settings → Environment Variables
Add: VITE_SUPABASE_URL
Add: VITE_SUPABASE_ANON_KEY
```

### **2. Trigger Deployment**
```bash
git push origin main
```

### **3. Verify Deployment**
```
Check: https://dramabox-web.vercel.app
Test: https://dramabox-web.vercel.app/admin
```

### **4. Monitor**
```
Dashboard → Deployments → View Logs
```

---

**Project ID:** `prj_SjOY93xmlk4bpv9jk9XceIOG0IvQ`  
**Status:** ✅ Integrated & Ready  
**Last Updated:** 2026-01-18
