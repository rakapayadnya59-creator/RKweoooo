# Panduan Publikasi GitHub Pages & Instalasi Chrome Android (V4.0)

**Build ID:** `v4.0.0-GITHUB-PWA-20261101`

Ikuti 9 langkah berikut untuk mempublikasikan aplikasi ke GitHub Pages (baik di repositori baru maupun *project site* seperti `https://username.github.io/nama-repo/`) dan memasangnya sebagai aplikasi penuh (WebAPK) di Chrome Android:

### Langkah 1 — Siapkan Repository GitHub
Buat repository publik baru di GitHub atau gunakan repository proyek yang sudah Anda siapkan (misalnya `RKweoooo`).

### Langkah 2 — Unduh & Ekstrak `MICRO-LEDGER-PWA-GITHUB.zip`
Unduh berkas `MICRO-LEDGER-PWA-GITHUB.zip` dan ekstrak seluruh isinya ke satu folder di komputer/perangkat Anda.

### Langkah 3 — Pastikan `index.html` Berada di Root Sumber Publish
Periksa hasil ekstraksi: berkas `index.html`, `manifest.json`, `sw.js`, `offline.html`, `.nojekyll`, dan folder `icons/` harus berada langsung di tingkat terluar (root), **bukan** terbungkus di dalam sub-folder tambahan.

### Langkah 4 — Upload / Commit Semua File & Folder ke Repository
Unggah seluruh berkas hasil ekstraksi beserta folder `icons/` ke root repository GitHub Anda, lalu tekan **Commit changes**.
> **Peringatan Keamanan Repository Publik:** Jangan pernah mengunggah berkas backup `.json` pribadi Anda, kunci rahasia (*service account private key*), atau data transaksi pribadi ke dalam repository GitHub publik.

### Langkah 5 — Buka Menu Settings -> Pages
Di halaman repository GitHub Anda, klik tab **Settings** di bagian atas, lalu pilih menu **Pages** di bilah samping kiri.

### Langkah 6 — Atur Branch & Folder Sumber Publikasi (Metode Paling Sederhana)
Pada bagian **Build and deployment**:
1. Pilih **Source:** `Deploy from a branch`.
2. Pilih **Branch:** `main` (atau `master` sesuai branch utama Anda).
3. Pilih **Folder:** `/ (root)` — karena `index.html` sudah ditempatkan langsung di root repository.
4. Klik tombol **Save**.

### Langkah 7 — Tunggu Deployment Selesai & Buka URL Publik HTTPS
Tunggu sekitar 1–2 menit hingga workflow **pages-build-deployment** selesai, lalu buka URL HTTPS resmi yang ditampilkan oleh GitHub Pages (contoh: `https://username.github.io/nama-repo/`).

### Langkah 8 — Uji & Instal di Google Chrome Android
1. Buka URL HTTPS GitHub Pages tersebut menggunakan **Google Chrome di Android**.
2. Masuk ke tab **Pengaturan → Tentang Aplikasi** untuk melihat status diagnostik PWA (`Manifest Valid`, `SW Registered`, `SW Active`, `Page Controlled`, `App Shell Cached`, dan `Halaman Offline Khusus`). Muat ulang halaman (*reload*) satu kali agar status **Page Controlled** aktif.
3. Ketuk tombol **Instal Aplikasi ke Layar Utama (PWA)** yang muncul di aplikasi, atau buka menu titik tiga Chrome Android lalu pilih **Install app** / **Tambahkan ke Layar Utama**.
4. Setelah instalasi selesai, buka aplikasi dari ikon di daftar aplikasi Android Anda dan pastikan aplikasi berjalan dalam mode **Standalone** (tanpa bilah alamat browser).

### Langkah 9 — Cara Update Versi di Kemudian Hari
Saat memperbarui aplikasi, unggah berkas versi baru (`index.html`, `sw.js`, `manifest.json`) ke lokasi yang sama tanpa menghapus folder `icons/` atau `offline.html`.
