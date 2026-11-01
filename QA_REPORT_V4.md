# LAPORAN QA & VALIDASI REGRESI — MASTER PROMPT V4.0
**Build ID:** `v4.0.0-GITHUB-PWA-20261101`  
**Standar Kejujuran Status:** Hanya menggunakan `PASS`, `FAIL`, dan `NOT TESTED` beserta metode dan lingkungan uji yang sebenarnya.

## 1. Matriks Pengujian Otomatis & Simulasi (Statis, Unit, Integrasi & Headless Chromium 155)

| ID Uji | Modul / Skenario Uji | Metode & Lingkungan Uji | Status | Bukti Terukur |
| :--- | :--- | :--- | :--- | :--- |
| **QA-01** | Pemeriksaan Statis HTML/JS, Keutuhan ID/Tombol Lama & Sintaks `sw.js` | `check_web_app.py --previous` & `node --check sw.js` (Statis VM) | **PASS** | `OK: no issues found.` • 0 syntax error • 0 komentar usang `850ms` |
| **QA-02** | **P0-1 (2.1):** Operasi Baru & Delete Baru Masuk Saat `flushPendingSyncQueue()` Sedang `await` + Panggilan Flush Bersamaan | Integrasi & Simulasi Async Firestore di Headless Chromium 155 (`run_v4_qa_suite.py`) | **PASS** | `concurrentFlushSharesPromise: true`, `newOpSurvivedDuringFlush: true`, `newerDeleteSurvivedDuringFlush: true`, `secondPassDrainedCleanly: true` |
| **QA-03** | **P0-2 (2.2):** Akurasi Status `clearAllUserData()` Saat Query `getDocs()` Cloud Gagal vs Berhasil | Simulasi Kegagalan Query Firestore di Headless Chromium 155 | **PASS** | Saat `getDocs()` gagal: `status: "partial"`, `remoteQueryFailures: 2`, badge menampilkan gagal query (bukan sukses palsu) |
| **QA-04** | **P0-3 (2.3):** Validasi Penyimpanan Lokal Sebelum Menghapus Snapshot Rollback (`restorePreImportRollback`) | Simulasi `QuotaExceededError` di Headless Chromium 155 | **PASS** | Saat simpan gagal: `rollbackRetainedOnSaveFailure: true`; saat simpan berhasil & terverifikasi: `rollbackRemovedOnlyAfterVerifiedSave: true` |
| **QA-05** | **Reset Data (4.2):** Klik Tombol Utama, Validasi Exact-Match Case-Sensitive `RKRKRK`, & Tombol Batal | Pengujian DOM & JS di Headless Chromium 155 | **PASS** | Klik utama hanya membuka modal; `''`, `'rkrkrk'`, `'Rkrkrk'`, `'RKRKRK '`, `' RKRKRK'`, `'RKRKRK\n'`, `'RKRKRK!'` ditolak di UI & JS; Batal tidak mengubah data |
| **QA-06** | **Reset Data (4.3 & 4.4):** 3 Mode Cloud, Kegagalan Parsial Cloud, Jurnal Resume Saat Reload, & Pembersihan Total | Simulasi Multi-Tahap di Headless Chromium 155 | **PASS** | Mode 2 (Cloud tak terjangkau) membatalkan reset sebelum hapus lokal; Mode 3 (Partial failure) menulis jurnal & mengunci sync, lalu saat dilanjutkan menghapus seluruh dokumen Cloud + 8 key lokal pengguna sembari mempertahankan `micro_ledger_firebase_config_v1` |
| **QA-07** | **Regresi Pasca-Reset (5 & 7.3):** Ekspor, Impor, Audit Integritas & Rollback Setelah Reset Data | Headless Chromium 155 | **PASS** | `localModeResetAndPostResetImportRegression: true` |
| **QA-08** | **P1-1 (2.4):** Pemisahan Pemeriksaan Cache `index.html` vs `offline.html` pada `verifyAppShellCache()` | Simulasi Cache Storage API di Headless Chromium 155 | **PASS** | Saat hanya `index.html` di cache: `appShellCached: true, offlinePageCached: false`; saat keduanya ada: `both: true` |
| **QA-09** | **P1-2 (2.5):** Splash Screen `4.2s` Decode-Aware (`0.6s` + `3.0s` + `0.6s`) | Pengukuran `performance.now()` di Headless Chromium 155 | **PASS** | `fullOpacityMs: 3001 ms` (`>= 3000 ms`), `totalMs: 4205 ms` |
| **QA-10** | **Paket GitHub Pages (6.1–6.6):** Ekstraksi Simulasi `MICRO-LEDGER-PWA-GITHUB.zip` ke Folder Kosong & Audit Path/Ikon | Skrip Verifikasi Ekstraksi & `PIL.Image.verify()` | **PASS** | `index.html` berada tepat di root ZIP; seluruh path relatif `./manifest.json`, `./sw.js`, `./offline.html`, dan `./icons/*` valid; 0 data pribadi di dalam ZIP |

## 2. Pengujian Lingkungan Eksternal yang Membutuhkan Perangkat / Akun Pengguna (`NOT TESTED`)

| Area Uji Eksternal | Status | Alasan Jujur & Langkah Uji Manual bagi Pengguna |
| :--- | :--- | :--- |
| **Sinkronisasi & Reset Data terhadap Server Firebase Firestore Live** | **NOT TESTED** | Lingkungan VM sandbox tidak memiliki akses internet keluar maupun kredensial proyek Firebase live Anda. Untuk menguji secara live: masukkan konfigurasi Firebase Anda ke `micro_ledger_firebase_config_v1`, pasang `firestore.rules`, lalu uji tambah/hapus dan Reset Data saat online. |
| **Publikasi Live pada Repository GitHub Pages Pengguna** | **NOT TESTED** | Membutuhkan unggahan ke akun GitHub Anda. Ikuti langkah pada `DEPLOY_GITHUB_PAGES.md` untuk mengunggah isi `MICRO-LEDGER-PWA-GITHUB.zip` ke root repository dan mengaktifkan GitHub Pages. |
| **Instalasi WebAPK, Mode Standalone & Kamera Fisik pada Perangkat Android Riil** | **NOT TESTED** | Membutuhkan smartphone Android fisik yang membuka URL HTTPS publik GitHub Pages melalui Google Chrome Android. |
