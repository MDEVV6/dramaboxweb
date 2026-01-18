# 🔧 Login Troubleshooting Guide

## ❌ Problem: Cannot Login to Admin Panel

**Symptoms:**
- "Invalid username or password" error
- Login button not working
- Stuck on login page

---

## ✅ Solution Applied

### **What Was Fixed:**

**Problem:** Login code was checking hardcoded password `'admin123'` instead of comparing with database `password_hash` field.

**Before:**
```javascript
if (password === 'admin123') {  // ❌ Wrong!
    // login success
}
```

**After:**
```javascript
if (password === data.password_hash) {  // ✅ Correct!
    // login success
}
```

---

## 🔍 Diagnostic Steps

### **Step 1: Verify Supabase Connection**

Open browser console (F12) and check for errors:

```javascript
// Should see Supabase URL
console.log(import.meta.env.VITE_SUPABASE_URL);

// Should NOT be undefined
```

**If undefined:**
- Check `.env.local` file exists
- Restart dev server: `npm run dev`

---

### **Step 2: Check Admin User Exists**

Run this in **Supabase SQL Editor**:

```sql
SELECT * FROM public.admin_users WHERE username = 'admin';
```

**Expected Result:**
```
id | username | email              | password_hash | is_active
---+----------+--------------------+---------------+-----------
1  | admin    | admin@dramabox.com | admin123      | true
```

**If no results:**
- Admin user doesn't exist
- Run `database/fix_login.sql` script

---

### **Step 3: Verify Password Hash**

Check what password is stored:

```sql
SELECT username, password_hash FROM public.admin_users WHERE username = 'admin';
```

**Common Issues:**
- Password is `NULL` → Need to set password
- Password is different → Use the stored password to login
- Password is hashed → Need to reset to plain text (for now)

---

### **Step 4: Check RLS Policies**

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
```

**If RLS blocking:**
```sql
-- Temporarily disable for testing
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Try login again

-- Re-enable after testing
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
```

---

## 🛠️ Quick Fixes

### **Fix 1: Create/Reset Admin User**

Run in Supabase SQL Editor:

```sql
-- Delete existing admin (if any)
DELETE FROM public.admin_users WHERE username = 'admin';

-- Create fresh admin user
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE);

-- Verify
SELECT * FROM public.admin_users WHERE username = 'admin';
```

**Login Credentials:**
```
Username: admin
Password: admin123
```

---

### **Fix 2: Reset Existing Admin Password**

```sql
UPDATE public.admin_users
SET password_hash = 'admin123'
WHERE username = 'admin';
```

---

### **Fix 3: Check User is Active**

```sql
-- Check status
SELECT username, is_active FROM public.admin_users WHERE username = 'admin';

-- Activate if inactive
UPDATE public.admin_users
SET is_active = TRUE
WHERE username = 'admin';
```

---

### **Fix 4: Clear Browser Cache**

Sometimes old session data causes issues:

```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

---

## 🔍 Debug Mode

### **Enable Console Logging:**

The fixed code now includes console logging. Check browser console for:

```
Query error: [error details]
Login error: [error details]
```

### **Common Errors:**

#### **Error: "Query error: null"**
- Admin user doesn't exist
- Create admin user using SQL script

#### **Error: "PGRST116"**
- RLS policy blocking query
- Check/disable RLS temporarily

#### **Error: "Invalid username or password"**
- Username doesn't exist
- Password doesn't match
- User is inactive

---

## 📋 Complete Troubleshooting Checklist

### **Environment:**
- [ ] `.env.local` file exists
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] Dev server restarted after env changes

### **Database:**
- [ ] `admin_users` table exists
- [ ] Admin user exists in table
- [ ] `password_hash` field has value
- [ ] `is_active` is TRUE
- [ ] RLS policies allow SELECT

### **Code:**
- [ ] Login.jsx updated (password check fixed)
- [ ] Supabase client configured correctly
- [ ] No console errors

### **Browser:**
- [ ] Cache cleared
- [ ] localStorage cleared
- [ ] No network errors (F12 → Network tab)

---

## 🎯 Step-by-Step Login Test

### **1. Prepare Database:**

```sql
-- Run in Supabase SQL Editor
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO UPDATE SET password_hash = 'admin123', is_active = TRUE;
```

### **2. Verify Environment:**

```bash
# Check .env.local
cat .env.local

# Should show:
# VITE_SUPABASE_URL=https://lerjbwlllftdnrybljnx.supabase.co
# VITE_SUPABASE_ANON_KEY=sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC
```

### **3. Restart Dev Server:**

```bash
# Stop current server (Ctrl+C)
# Start fresh
npm run dev
```

### **4. Clear Browser:**

```javascript
// Open console (F12)
localStorage.clear();
location.reload();
```

### **5. Try Login:**

```
URL: http://localhost:5173/admin
Username: admin
Password: admin123
```

### **6. Check Console:**

Open F12 → Console tab. Look for:
- ✅ No errors = Good!
- ❌ Errors = Check error message

---

## 🔐 Production Deployment

### **For Vercel:**

1. **Set Environment Variables:**
   ```
   Vercel Dashboard → Settings → Environment Variables
   Add: VITE_SUPABASE_URL
   Add: VITE_SUPABASE_ANON_KEY
   ```

2. **Redeploy:**
   ```bash
   git push origin main
   # Or via Vercel Dashboard → Redeploy
   ```

3. **Test Production:**
   ```
   https://your-app.vercel.app/admin
   Username: admin
   Password: admin123
   ```

---

## 🆘 Still Not Working?

### **Get Detailed Error Info:**

1. **Open Browser Console (F12)**
2. **Go to Console tab**
3. **Try login**
4. **Copy any error messages**

### **Check Network Tab:**

1. **F12 → Network tab**
2. **Try login**
3. **Look for failed requests (red)**
4. **Click on failed request**
5. **Check Response tab**

### **Common Issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| `PGRST116` | RLS blocking | Disable RLS or fix policies |
| `404 Not Found` | Wrong API endpoint | Check Supabase URL |
| `Invalid username` | User doesn't exist | Create admin user |
| `Undefined env` | Env vars not loaded | Restart dev server |
| `CORS error` | Wrong domain | Check Supabase allowed origins |

---

## 📝 Files to Check

### **1. Environment File:**
```bash
# .env.local
VITE_SUPABASE_URL=https://lerjbwlllftdnrybljnx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_I-FkBDd4RzuiOBG75nIIWg_BQrL-9AC
```

### **2. Supabase Config:**
```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### **3. Login Component:**
```javascript
// src/pages/admin/Login.jsx
// Should compare: password === data.password_hash
```

---

## 🎊 Success Indicators

When login works correctly, you should see:

1. **No console errors**
2. **Redirect to `/admin/dashboard`**
3. **Session stored in localStorage**
4. **Last login updated in database**

---

## 📞 Quick Reference

### **Default Credentials:**
```
Username: admin
Password: admin123
```

### **Reset Password:**
```sql
UPDATE public.admin_users
SET password_hash = 'admin123'
WHERE username = 'admin';
```

### **Create Admin:**
```sql
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;
```

### **Clear Session:**
```javascript
localStorage.clear();
```

---

**Created:** 2026-01-18  
**Status:** ✅ Login Fixed  
**Test:** http://localhost:5173/admin
