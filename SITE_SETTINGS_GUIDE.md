# Site Settings Feature

## Overview
Fitur Site Settings memungkinkan admin untuk mengatur konfigurasi website melalui dashboard admin, termasuk nama website, meta description, logo, favicon, dan pengaturan lainnya.

## Files Created

### 1. Database Schema
**File:** `database/site_settings_schema.sql`
- Tabel `site_settings` untuk menyimpan konfigurasi website
- Storage bucket `site-assets` untuk logo, favicon, dan OG images
- RLS policies untuk keamanan
- Trigger untuk auto-update timestamp

### 2. Service Layer
**File:** `src/services/siteSettings.js`
- `getSiteSettings()` - Ambil pengaturan website
- `updateSiteSettings(settings)` - Update pengaturan
- `uploadLogo(file)` - Upload logo
- `uploadFavicon(file)` - Upload favicon
- `uploadOGImage(file)` - Upload OG image
- `deleteAsset(url)` - Hapus file dari storage

### 3. Admin Page
**File:** `src/pages/Admin/SiteSettings.jsx`
- Form lengkap dengan 5 tabs:
  - **General**: Site name, tagline, contact email, footer text
  - **Branding**: Logo, favicon upload
  - **SEO**: Meta description, keywords, OG image, Google Analytics
  - **Social Media**: Facebook, Twitter, Instagram, YouTube URLs
  - **Advanced**: Registration toggle, maintenance mode

**File:** `src/pages/Admin/SiteSettings.css`
- Styling modern dengan tabs
- Image upload UI dengan preview
- Responsive design
- Dark mode support

### 4. Routes
**File:** `src/App.jsx`
- Route `/admin/settings` ditambahkan

**File:** `src/pages/admin/Dashboard.jsx`
- Menu "Site Settings" ditambahkan di sidebar

## Setup Instructions

### 1. Run SQL Schema
```sql
-- Copy dan paste isi file database/site_settings_schema.sql
-- ke Supabase SQL Editor dan execute
```

### 2. Verify Tables
```sql
SELECT * FROM site_settings WHERE id = 1;
```

### 3. Access Admin Panel
1. Login ke admin: `/admin/login`
2. Klik menu "Site Settings" di sidebar
3. Konfigurasi website sesuai kebutuhan

## Features

### General Settings
- **Site Name**: Nama website (default: "DramaBox Web")
- **Site Tagline**: Tagline/slogan website
- **Contact Email**: Email kontak
- **Footer Text**: Teks di footer

### Branding
- **Logo**: Upload logo untuk header (PNG/JPG, max 2MB)
- **Favicon**: Upload favicon (ICO/PNG, 32x32 atau 64x64px)
- Preview langsung setelah upload
- Hapus dan ganti logo/favicon kapan saja

### SEO
- **Meta Description**: Deskripsi untuk search engines (max 160 karakter)
- **Meta Keywords**: Keywords untuk SEO
- **OG Image**: Image untuk social media sharing (1200x630px)
- **Google Analytics ID**: Tracking ID (G-XXXXXXXXXX)
- **Google Tag Manager ID**: GTM ID (GTM-XXXXXXX)

### Social Media
- **Twitter Handle**: Username Twitter (@username)
- **Facebook URL**: Link ke halaman Facebook
- **Twitter URL**: Link ke profil Twitter
- **Instagram URL**: Link ke profil Instagram
- **YouTube URL**: Link ke channel YouTube

### Advanced
- **Enable Registration**: Toggle untuk membuka/tutup registrasi user
- **Maintenance Mode**: Mode maintenance untuk website
- **Maintenance Message**: Pesan yang ditampilkan saat maintenance

## Default Values

Jika tidak diubah, sistem akan menggunakan nilai default:
- **Site Name**: "DramaBox Web"
- **Site Tagline**: "Watch Chinese Dramas Online"
- **Meta Description**: "Stream the latest Chinese dramas online..."
- **Contact Email**: "contact@dramabox.com"
- **Footer Text**: "© 2026 DramaBox Web. All rights reserved."

## Usage in Frontend

### Get Site Settings
```javascript
import { getSiteSettings } from './services/siteSettings';

const settings = await getSiteSettings();
console.log(settings.site_name); // "DramaBox Web"
console.log(settings.logo_url); // URL to logo
```

### Update Settings
```javascript
import { updateSiteSettings } from './services/siteSettings';

await updateSiteSettings({
  site_name: "My Drama Site",
  meta_description: "Watch the best dramas online"
});
```

### Upload Logo
```javascript
import { uploadLogo } from './services/siteSettings';

const file = event.target.files[0];
const logoUrl = await uploadLogo(file);
```

## Integration Points

### 1. Update Navbar Logo
```javascript
// In Navbar.jsx
const [settings, setSettings] = useState(null);

useEffect(() => {
  const loadSettings = async () => {
    const data = await getSiteSettings();
    setSettings(data);
  };
  loadSettings();
}, []);

// Use settings.logo_url for logo
<img src={settings?.logo_url || '/default-logo.png'} alt={settings?.site_name} />
```

### 2. Update Page Title & Meta
```javascript
// In App.jsx or individual pages
useEffect(() => {
  const loadSettings = async () => {
    const data = await getSiteSettings();
    document.title = data.site_name;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = data.meta_description;
    }
  };
  loadSettings();
}, []);
```

### 3. Update Favicon
```javascript
// In index.html or dynamically
const link = document.querySelector("link[rel*='icon']");
if (link && settings?.favicon_url) {
  link.href = settings.favicon_url;
}
```

## Security

- ✅ Row Level Security (RLS) enabled
- ✅ Public can read settings (for frontend)
- ✅ Only authenticated admins can update
- ✅ File upload restricted to authenticated users
- ✅ File size validation (max 2MB)
- ✅ File type validation

## Storage Structure

```
site-assets/
├── logos/
│   └── logo-1234567890.png
├── favicons/
│   └── favicon-1234567890.ico
└── og-images/
    └── og-image-1234567890.jpg
```

## Notes

1. **Single Row Table**: Tabel `site_settings` hanya memiliki 1 row (id=1)
2. **Auto Timestamps**: `updated_at` otomatis terupdate saat save
3. **File Cleanup**: File lama otomatis dihapus saat upload baru
4. **Validation**: Form memiliki validasi client-side dan server-side
5. **Responsive**: UI fully responsive untuk mobile dan desktop

## Troubleshooting

### Settings tidak tersimpan
- Pastikan user sudah login sebagai admin
- Check browser console untuk error
- Verify RLS policies di Supabase

### Upload gagal
- Check file size (max 2MB)
- Check file type (PNG, JPG, ICO)
- Verify storage bucket `site-assets` sudah dibuat

### Settings tidak muncul di frontend
- Pastikan sudah run SQL schema
- Check apakah ada data di tabel `site_settings`
- Verify service import sudah benar

## Future Enhancements

- [ ] Multiple language support
- [ ] Theme color customization
- [ ] Custom CSS injection
- [ ] Email template settings
- [ ] SMTP configuration
- [ ] Backup/restore settings
