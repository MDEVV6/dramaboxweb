# 👥 Admin Users Management - User Guide

## Overview

Halaman **Admin Users Management** memungkinkan Anda untuk mengelola semua admin users yang memiliki akses ke admin panel. Anda dapat create, edit, activate/deactivate, dan delete admin users.

## Akses Halaman

### **URL:**
```
Local: http://localhost:5173/admin/users
Production: https://your-app.vercel.app/admin/users
```

### **Cara Akses:**
1. Login ke admin panel
2. Klik **Admin Users** di sidebar menu
3. Atau akses langsung via URL `/admin/users`

---

## Fitur Utama

### 1. **Dashboard Stats**
Melihat statistik admin users:
- **Total Admins** - Jumlah total admin users
- **Active** - Admin yang aktif
- **Inactive** - Admin yang non-aktif

### 2. **Create Admin User**
Membuat admin user baru:

**Langkah:**
1. Klik tombol **Create Admin User**
2. Isi form:
   - **Username** * (required) - Username untuk login
   - **Email** * (required) - Email admin
   - **Password** * (required) - Password login
   - **Active User** - Centang untuk mengaktifkan
3. Klik **Create User**

**Validasi:**
- Username harus unique
- Email harus unique dan valid format
- Password required untuk user baru

### 3. **Edit Admin User**
Mengubah data admin user:

**Langkah:**
1. Klik icon **Edit** (pensil) pada user yang ingin diedit
2. Ubah data yang diperlukan:
   - Username
   - Email
   - Password (opsional - kosongkan jika tidak ingin mengubah)
   - Status aktif
3. Klik **Update User**

**Note:** Password bersifat opsional saat edit. Kosongkan jika tidak ingin mengubah password.

### 4. **Activate/Deactivate User**
Toggle status aktif user:

**Langkah:**
1. Klik icon **Activate/Deactivate** pada user
2. Status akan berubah otomatis
3. User yang inactive tidak bisa login

**Use Case:**
- Temporary suspend user tanpa delete
- Disable akses sementara
- Reactivate user yang sudah di-suspend

### 5. **Delete Admin User**
Menghapus admin user:

**Langkah:**
1. Klik icon **Delete** (trash) pada user
2. Konfirmasi penghapusan
3. User akan dihapus permanent

**⚠️ Warning:** Penghapusan bersifat permanent dan tidak bisa di-undo!

---

## Tabel Admin Users

### **Kolom:**
- **ID** - User ID (auto-generated)
- **Username** - Username dengan avatar
- **Email** - Email address
- **Status** - Active/Inactive badge
- **Last Login** - Waktu login terakhir
- **Created At** - Tanggal pembuatan
- **Actions** - Tombol aksi (Edit, Toggle Status, Delete)

### **Visual Indicators:**
- 🟢 **Green Badge** - Active user
- 🔴 **Red Badge** - Inactive user
- **Faded Row** - Inactive user (opacity 60%)

---

## Security Features

### 1. **Password Visibility Toggle**
- Klik icon **Eye** untuk show/hide password saat input
- Password di-hash sebelum disimpan ke database

### 2. **Unique Constraints**
- Username harus unique
- Email harus unique
- Duplicate akan ditolak dengan error message

### 3. **Authentication Check**
- Halaman hanya bisa diakses oleh logged-in admin
- Auto-redirect ke login jika tidak authenticated

---

## Best Practices

### **1. Username Naming**
```
✅ GOOD:
- admin
- john_doe
- manager1

❌ AVOID:
- admin@123 (gunakan simbol minimal)
- user (terlalu generic)
```

### **2. Password Security**
```
✅ STRONG:
- Minimal 12 karakter
- Kombinasi huruf, angka, simbol
- Contoh: Admin@2026!Secure

❌ WEAK:
- admin123
- password
- 12345678
```

### **3. Email Format**
```
✅ VALID:
- admin@dramabox.com
- john.doe@company.com

❌ INVALID:
- admin@
- notanemail
```

### **4. User Management**
- Jangan delete user yang sedang login
- Deactivate dulu sebelum delete (untuk audit trail)
- Buat user dengan role yang jelas (username descriptive)
- Regular password rotation (ganti password berkala)

---

## Troubleshooting

### **Problem 1: "Username or email already exists"**

**Penyebab:** Username atau email sudah digunakan

**Solusi:**
- Gunakan username/email yang berbeda
- Cek tabel untuk melihat existing users
- Edit user yang sudah ada jika perlu update

### **Problem 2: "Failed to load admin users"**

**Penyebab:** Database connection issue atau RLS policy

**Solusi:**
```sql
-- Cek RLS policies
SELECT * FROM pg_policies WHERE tablename = 'admin_users';

-- Pastikan policy untuk SELECT ada
CREATE POLICY "Admins can view their own data"
    ON public.admin_users FOR SELECT
    USING (true);
```

### **Problem 3: "Failed to save admin user"**

**Penyebab:** Validation error atau permission issue

**Solusi:**
1. Cek semua required fields terisi
2. Pastikan email format valid
3. Cek browser console untuk error detail
4. Verify RLS policies di Supabase

### **Problem 4: Cannot delete user**

**Penyebab:** Foreign key constraint atau permission

**Solusi:**
```sql
-- Cek foreign key references
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'admin_users';

-- Pastikan DELETE policy ada
CREATE POLICY "Admins can delete users"
    ON public.admin_users FOR DELETE
    USING (true);
```

---

## Database Schema

### **Table: admin_users**

```sql
CREATE TABLE public.admin_users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ
);
```

### **Indexes:**
```sql
-- Unique indexes (auto-created)
CREATE UNIQUE INDEX admin_users_username_key ON admin_users(username);
CREATE UNIQUE INDEX admin_users_email_key ON admin_users(email);
```

### **Triggers:**
```sql
-- Auto-update updated_at
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## API Operations

### **Fetch All Users**
```javascript
const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });
```

### **Create User**
```javascript
const { error } = await supabase
    .from('admin_users')
    .insert([{
        username: 'newadmin',
        email: 'newadmin@example.com',
        password_hash: 'securepassword',
        is_active: true
    }]);
```

### **Update User**
```javascript
const { error } = await supabase
    .from('admin_users')
    .update({
        username: 'updatedname',
        email: 'updated@example.com',
        is_active: true
    })
    .eq('id', userId);
```

### **Delete User**
```javascript
const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', userId);
```

### **Toggle Status**
```javascript
const { error } = await supabase
    .from('admin_users')
    .update({ is_active: !currentStatus })
    .eq('id', userId);
```

---

## UI Components

### **Stats Cards**
- Total Admins (Shield icon)
- Active Users (UserCheck icon, green)
- Inactive Users (UserX icon, red)

### **Action Buttons**
- **Edit** (Blue) - Edit user data
- **Activate/Deactivate** (Green/Orange) - Toggle status
- **Delete** (Red) - Delete user

### **Modal Form**
- Username input
- Email input
- Password input (with show/hide toggle)
- Active checkbox
- Cancel/Submit buttons

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal |
| `Enter` | Submit form (when in modal) |
| `Tab` | Navigate form fields |

---

## Responsive Design

### **Desktop (> 768px)**
- Full table view
- All columns visible
- Sidebar navigation

### **Mobile (< 768px)**
- Horizontal scroll for table
- Stacked stats cards
- Responsive modal

---

## Future Enhancements

Fitur yang bisa ditambahkan:

1. **Role-Based Access Control (RBAC)**
   - Super Admin, Admin, Editor roles
   - Permission management

2. **Activity Log**
   - Track user actions
   - Login history
   - Audit trail

3. **Bulk Operations**
   - Bulk activate/deactivate
   - Bulk delete
   - CSV export

4. **Advanced Filters**
   - Filter by status
   - Search by username/email
   - Sort by columns

5. **Email Notifications**
   - Welcome email for new users
   - Password reset
   - Account status changes

---

## Related Files

```
src/pages/admin/AdminUsers.jsx      # Main component
src/pages/admin/AdminUsers.css      # Styling
src/App.jsx                         # Route configuration
src/pages/admin/Dashboard.jsx       # Navigation menu
database/database.sql               # Database schema
```

---

## Quick Reference

### **Create User:**
Dashboard → Admin Users → Create Admin User → Fill Form → Create

### **Edit User:**
Dashboard → Admin Users → Click Edit Icon → Update Form → Update User

### **Deactivate User:**
Dashboard → Admin Users → Click Toggle Icon → Confirm

### **Delete User:**
Dashboard → Admin Users → Click Delete Icon → Confirm

---

**Created:** 2026-01-18  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
