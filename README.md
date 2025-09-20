# Sobat Izin - Wizard Instalasi

Repositori ini menyediakan contoh implementasi wizard instalasi untuk aplikasi Sobat Izin.
Wizard membantu administrator memeriksa prasyarat server, mengonfigurasi website,
menyiapkan akun admin, dan membuat database secara otomatis apabila kredensial master
tersedia.

## Struktur Proyek

```
.
├── src/                # Front-end React sederhana
│   ├── app.js          # Menentukan alur sebelum login dan wizard instalasi
│   └── pages/install   # Halaman wizard instalasi beserta styling
└── server/
    └── src/
        ├── index.js            # Entry point Express
        ├── routes.js           # Registrasi endpoint instalasi
        └── installService.js   # Logika utama instalasi & prasyarat
```

## Menjalankan Wizard Instalasi

1. **Persiapan Lingkungan**
   - Pastikan Node.js versi 18 atau lebih baru.
   - Siapkan kredensial database MySQL yang akan digunakan aplikasi.
   - Jika memiliki akses master (root/cPanel), siapkan juga kredensialnya untuk
     membuat database dan user secara otomatis.

2. **Konfigurasi Berkas Lingkungan**
   - Duplikat `.env.example` menjadi `.env` dan isi variabel berikut sesuai
     lingkungan server:

     ```bash
     cp .env.example .env
     ```

   - Variabel penting:
     - `INSTALL_DB_HOST`, `INSTALL_DB_PORT`: Host & port database master.
     - `INSTALL_DB_ROOT_USER`, `INSTALL_DB_ROOT_PASSWORD`: Kredensial root/cPanel.
     - `INSTALL_TEMPLATE_DIR`: Lokasi template aplikasi (jika berbeda dari default).
     - `INSTALL_API_KEY`: Token opsional untuk mengamankan endpoint instalasi.

3. **Menjalankan Backend Instalasi**
   - Masuk ke direktori `server` dan instal dependensi:

     ```bash
     cd server
     npm install
     npm run start
     ```

   - Endpoint instalasi tersedia di `POST /api/install`. Endpoint pendukung:
     - `GET /api/install/status`
     - `GET /api/install/prerequisites`

4. **Menjalankan Front-end**
   - Implementasi front-end pada folder `src/` dapat diintegrasikan dengan bundler
     favorit (mis. Vite/CRA). Pastikan `src/app.js` dipakai sebagai entry point
     aplikasi. Wizard instalasi akan muncul otomatis hingga status instalasi
     tersimpan oleh backend.

5. **Alur Instalasi**
   - Buka aplikasi di browser. Wizard akan menampilkan daftar prasyarat server.
   - Lengkapi formulir instalasi dan kirim. Backend akan:
     - Memvalidasi prasyarat (Node/PHP placeholder, akses database, template).
     - Menguji kredensial database dan membuat database/user bila kredensial
       master tersedia.
     - Menyimpan status instalasi agar halaman login dapat diakses setelah selesai.

## Konfigurasi Database via cPanel

Apabila menggunakan server dengan cPanel:

- Isi `masterDbUser` dengan username root atau akun cPanel utama.
- Isi `masterDbPassword` dengan password atau API token yang memiliki hak membuat
  database dan user.
- Jika menggunakan API cPanel, masukkan `cpanelUser` dan `cpanelToken` pada form
  wizard untuk dokumentasi internal (payload akan diteruskan ke backend sehingga
  dapat diintegrasikan dengan permintaan API cPanel pada pengembangan lanjutan).

## Catatan Lanjutan

- Berkas status instalasi disimpan pada `server/storage/install-status.json`.
- Pemeriksaan versi PHP masih berupa placeholder. Integrasikan dengan pemeriksaan
  nyata (mis. memanggil skrip PHP) sesuai kebutuhan produksi.
- Pastikan untuk mengamankan endpoint instalasi dengan token (`INSTALL_API_KEY`)
  jika server diakses publik.
