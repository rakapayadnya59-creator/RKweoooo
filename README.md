# Micro Ledger & AI Workout — PWA Edition (V4.0)

**Build ID:** `v4.0.0-GITHUB-PWA-20261101`  
**Target Platform:** GitHub Pages (Root & Project Site Subpath) • Google Chrome Android (WebAPK) • Desktop/Mobile Modern Browsers

## 1. Struktur Proyek di Dalam Paket
Seluruh isi proyek diletakkan langsung di tingkat root agar siap diekstrak ke repositori GitHub tanpa folder bertingkat yang keliru:
```text
├── index.html                # Aplikasi utama mandiri (Ledger, AI Workout, Jadwal, Profil, Pengaturan, Reset Data)
├── manifest.json             # Web App Manifest dengan path relatif (./) kompatibel project site GitHub Pages
├── sw.js                     # Service Worker v4.0.0 (App Shell & Offline Page caching)
├── offline.html              # Halaman fallback khusus ketika navigasi dilakukan saat offline
├── .nojekyll                 # Penanda agar GitHub Pages melayani seluruh aset statis secara langsung
├── firestore.rules           # Aturan keamanan Firestore untuk isolasi data per-UID
├── README.md                 # Ringkasan struktur, konfigurasi, pembaruan, dan rollback
├── DEPLOY_GITHUB_PAGES.md    # Panduan langkah demi langkah publikasi ke GitHub Pages & instalasi Chrome Android
├── QA_REPORT_V4.md           # Laporan hasil pengujian QA V4.0 beserta metode, lingkungan, dan batasan jujur
├── CHANGELOG_V4.md           # Catatan perubahan teknis V4.0 (P0, P1, Reset Data, dan PWA)
├── BUILD_INFO.txt            # Informasi waktu build, ukuran berkas, dan checksum SHA-256
└── icons/
    ├── favicon.png           # 64x64 Favicon
    ├── apple-touch-icon.png  # 180x180 iOS Touch Icon
    ├── icon-192.png          # 192x192 PWA Standard Icon (purpose: "any")
    ├── icon-512.png          # 512x512 PWA High-Res Icon (purpose: "any")
    └── icon-512-maskable.png # 512x512 PWA Maskable Icon dengan 78% safe-zone (purpose: "maskable")
```

## 2. Kebutuhan Konfigurasi & Batasan Offline yang Jujur
* **Mode Lokal Mandiri (Default):** Berjalan langsung di penyimpanan lokal browser (`LocalStorage`) tanpa membutuhkan server eksternal atau konfigurasi Firebase.
* **Ketergantungan CDN Eksternal:** Desain utilitas memuat Tailwind CSS CDN & Google Fonts, serta modul AI Workout memuat TensorFlow.js & MoveNet dari CDN saat sesi kamera pertama kali diaktifkan. Kami menyertakan aturan CSS struktural cadangan di dalam `index.html` agar tata letak dasar tetap aman jika CDN gagal dimuat.
* **Sinkronisasi Cloud Firestore (Opsional):** Jika ingin menyinkronkan data lintas perangkat, konfigurasikan objek proyek Firebase Web Anda pada `localStorage.setItem('micro_ledger_firebase_config_v1', JSON.stringify(config))` dan terapkan `firestore.rules` pada Firebase Console.

## 3. Cara Pembaruan (Update) & Rollback
* **Update Versi Baru:** Unggah dan timpa (`commit`) berkas `index.html`, `sw.js`, dan `manifest.json` terbaru ke branch publikasi GitHub Pages tanpa menghapus folder `icons/` atau `offline.html`.
* **Rollback Deployment:** Gunakan riwayat *commit* Git (`git revert` / pilih commit sebelumnya di GitHub) untuk mengembalikan publikasi ke versi sebelumnya.
* **Rollback Impor Data di Aplikasi:** Buka **Pengaturan → Data & Cadangan → Rollback Impor Terakhir** untuk memulihkan kondisi lokal tepat sebelum impor JSON terakhir dijalankan.
