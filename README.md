# Sobat Izin Platform

Repositori ini memuat landing page publik serta fondasi backend fase 1 (autentikasi dan model data)
untuk **Sobat Izin**, konsultan perizinan usaha di Indonesia.

## 🚀 Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
npm install
```

> Catatan: gunakan registry npm yang memiliki akses ke paket OSS standar.

### 2. Jalankan Frontend (Vite)
```bash
npm run dev
```
Aplikasi dapat diakses di `http://localhost:5173` secara default.

### 3. Jalankan Backend API
Pastikan variabel lingkungan JWT telah diisi (lihat `.env.example`), lalu jalankan:
```bash
npm run dev:server
```
API akan tersedia di `http://localhost:4000` (atau port yang Anda set).

### 4. Migrasi & Seed Admin
Siapkan database (SQLite secara default) dan jalankan migrasi:
```bash
npm run migrate:deploy
```

Seed admin default melalui variabel lingkungan `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `ADMIN_NAME`:
```bash
npm run seed
```

### 5. Menjalankan Test
```bash
npm test
```
Test mencakup hashing password, alur register/login, guard RBAC, validasi skema order, serta paginasi.

## 🔐 Konfigurasi Backend
Semua variabel lingkungan tercantum di `.env.example`. Beberapa yang wajib:
- `DATABASE_URL` – koneksi database (default SQLite `file:./prisma/dev.db`).
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` – rahasia token JWT.
- `ACCESS_TOKEN_TTL_MINUTES`, `REFRESH_TOKEN_TTL_DAYS` – TTL token.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `ADMIN_PHONE` – digunakan oleh skrip seed admin.

## 🗂️ Skema Database (Prisma)
Model fase 1 mencakup:
- `User` (client/admin) dengan password hash Argon2.
- `Order` dengan enum `serviceType` dan `status`.
- `OrderHistory` untuk log status.
- `ContactLead` untuk prospek formulir.
- `FileUpload` untuk metadata berkas (receipt/final).

Setiap tabel telah memiliki indeks sesuai kebutuhan pencarian/paginasi.

## 🌐 Frontend Landing Page
Struktur komponen ada di `src/` sesuai ketentuan:
- `Header`, `Hero`, `Services`, `Advantages`, `Pricing`, `FAQ`, `Contact`, `Footer`, serta tombol WhatsApp mengambang.
- Konfigurasi situs di `src/config/site.js` dan paket harga di `src/config/pricing.js`.
- Formulir kontak mendukung Formspree atau EmailJS melalui variabel lingkungan `VITE_*`.

## 🧭 Cara Kustomisasi
- **Nomor & link WhatsApp**: edit `whatsappNumber` dan `whatsappLink` pada `src/config/site.js`.
- **Paket harga**: ubah isi `packages` di `src/config/pricing.js`. Nilai harga `null` akan menampilkan teks "Harga akan ditentukan".
- **Integrasi Formulir**: isi kredensial Formspree/EmailJS pada file `.env` sesuai contoh `.env.example`.

## 🛠️ Struktur Direktori Tingkat Tinggi
```
public/
prisma/
  ├─ schema.prisma
  └─ migrations/0001_init/migration.sql
server/
  ├─ config/
  ├─ lib/
  ├─ middleware/
  ├─ routes/
  ├─ services/
  └─ utils/
src/
tests/
```

Selamat membangun platform perizinan Sobat Izin! 💼
