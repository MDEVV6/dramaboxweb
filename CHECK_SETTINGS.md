# Troubleshooting Site Settings

## 1. Cek Data di Database

Buka Supabase SQL Editor dan jalankan:

```sql
-- Cek apakah tabel sudah ada
SELECT * FROM site_settings WHERE id = 1;

-- Cek apakah data sudah terupdate
SELECT 
    site_name,
    site_tagline,
    logo_url,
    favicon_url,
    updated_at
FROM site_settings 
WHERE id = 1;
```

## 2. Cek Browser Console

1. Buka browser DevTools (F12)
2. Tab Console
3. Cek error saat save settings
4. Cek error saat load settings

## 3. Cek Network Tab

1. Buka DevTools → Network tab
2. Klik "Save Settings"
3. Cek request ke Supabase:
   - Status harus 200 OK
   - Response harus berisi data yang diupdate

## 4. Clear Cache & Reload

1. Hard refresh: Ctrl + Shift + R
2. Clear browser cache
3. Reload halaman

## 5. Cek RLS Policies

```sql
-- Cek apakah RLS policies sudah benar
SELECT * FROM pg_policies 
WHERE tablename = 'site_settings';
```

## 6. Manual Update (Jika Perlu)

Jika form tidak bisa save, update manual lewat SQL:

```sql
UPDATE site_settings
SET 
    site_name = 'Nama Website Anda',
    site_tagline = 'Tagline Anda',
    meta_description = 'Deskripsi Anda',
    updated_at = NOW()
WHERE id = 1;
```

## 7. Cek Service Layer

Pastikan import service sudah benar di SiteSettings.jsx:

```javascript
import { 
  getSiteSettings, 
  updateSiteSettings 
} from '../../services/siteSettings';
```

## 8. Cek Supabase Connection

```javascript
// Test di browser console
import { supabase } from './services/supabase';

const { data, error } = await supabase
  .from('site_settings')
  .select('*')
  .eq('id', 1)
  .single();

console.log('Data:', data);
console.log('Error:', error);
```
