# CHANGELOG TEKNIS — MASTER PROMPT V4.0
**Build ID:** `v4.0.0-GITHUB-PWA-20261101`  
**Basis Kode:** `index.html` V3.0 (`443.353 byte`; `6.697 baris`; SHA-256: `989ffdd63a62a708175f42d040c68a0e5e9ba74808302371bc56c55ae0dd0080`)

## 1. Perbaikan Prioritas P0 (Keselamatan Data, Antrean Sinkronisasi & Rollback)
* **[P0-1 / Bagian 2.1] Drain Antrean Sinkronisasi Aman-Konkuren (`App.flushPendingSyncQueue` & `App.enqueuePendingSync`):**
  * **Masalah:** Sebelumnya `flushPendingSyncQueue()` menyalin antrean ke `snapshotQueue` dan di akhir fungsi menimpa `this.state.pendingSyncQueue = remaining;`, sehingga operasi baru yang masuk saat proses `await` jaringan sedang berlangsung berisiko tertimpa.
  * **Perbaikan:** Setiap item antrean kini memiliki identitas operasi unik (`opId`). Saat satu operasi selesai dikirim ke Firestore, hanya entri dengan `opId` yang sama yang dihapus dari antrean aktif apabila belum digantikan oleh operasi yang lebih baru. Operasi baru yang masuk selama proses *flush* tetap utuh, operasi `'delete'` yang lebih baru tidak pernah dikalahkan oleh `'upsert'` lama, dan pemanggilan `flushPendingSyncQueue()` bersamaan berbagi *Promise* aktif yang sama.
* **[P0-2 / Bagian 2.2] Akurasi Status Penghapusan Massal (`App.clearAllUserData`):**
  * **Masalah:** Kegagalan `getDocs()` saat mengambil daftar dokumen remote sebelumnya hanya dicatat ke `console.warn` tanpa dihitung sebagai kegagalan operasi cloud.
  * **Perbaikan:** Menambahkan penghitung eksplisit `remoteQueryFailures` dan `cloudDeleteFailures`. Bila pembacaan koleksi remote gagal atau penghapusan dokumen gagal, fungsi mengembalikan `status: 'partial'` dan menampilkan status `PARTIAL / NOT COMPLETE` secara jujur (tidak pernah mengklaim seluruh cloud bersih jika query gagal).
* **[P0-3 / Bagian 2.3] Verifikasi Penyimpanan Sebelum Menghapus Snapshot Rollback (`SettingsHubEngine.restorePreImportRollback`):**
  * **Masalah:** `localStorage.removeItem(this.rollbackKey)` sebelumnya dipanggil tanpa memeriksa apakah `saveLocalBackup()` dan penyimpanan modul lain benar-benar berhasil.
  * **Perbaikan:** Memvalidasi nilai kembalian seluruh fungsi simpan lokal (`saveLocalBackup`, `saveProfile`, `saveSchedule`, `saveReminderPrefs`, `saveSettings`) serta melakukan verifikasi baca-ulang (`localStorage.getItem`) sebelum menghapus `micro_ledger_pre_import_rollback_v2`. Jika penyimpanan gagal, state memori dikembalikan dan snapshot rollback tetap dipertahankan.

## 2. Fitur Baru Wajib: Reset Data Permanen (`ResetDataEngine` — Bagian 3 & 4)
* **Pemisahan Visual & Tanggung Jawab Fungsi:** Menambahkan kartu khusus **Reset Data (Permanen & Menyeluruh)** di **Pengaturan → Data & Cadangan** yang terpisah dari tombol *Ekspor/Impor* dan dari tombol *Bersihkan Catatan Transaksi & Workout*.
* **Gerbang Konfirmasi Kata Kunci Case-Sensitive (`RKRKRK`):**
  * Menampilkan modal konfirmasi `#reset-data-modal` dengan peringatan permanen, rincian 9 kategori data pengguna yang dihapus, batasan jujur berkas di luar aplikasi (`Downloads` / GitHub), dan cakupan operasi aktual.
  * Memvalidasi kata kunci secara *case-sensitive exact-match* (`rawVal === 'RKRKRK'`) tanpa `.trim()`, `.toUpperCase()`, atau `.toLowerCase()`. Menolak `'rkrkrk'`, `'Rkrkrk'`, `'RKRKRK '`, `' RKRKRK'`, dan variasi lainnya baik pada tombol UI maupun di dalam fungsi eksekusi `executeResetData()`.
  * Kata kunci segera dihapus dari input DOM saat dieksekusi dan tidak pernah disimpan ke `LocalStorage`, Firestore, backup, maupun log.
* **Penanganan 3 Kondisi Cloud & Jurnal Pemulihan (`micro_ledger_reset_journal_v4`):**
  * **Kondisi 1 (Firebase Tidak Dikonfigurasi):** Menjalankan Reset Data lokal dengan penjelasan jujur bahwa data cloud tidak terhubung pada sesi ini.
  * **Kondisi 2 (Firebase Dikonfigurasi Tetapi Offline / Gagal Autentikasi):** Membatalkan reset penuh sebelum menghapus data lokal agar tidak meninggalkan data cloud tanpa penjelasan.
  * **Kondisi 3 (Firebase Aktif):** Mengunci seluruh operasi tulis/sync (`_resetLockActive`), melepas listener `onSnapshot`, menyimpan jurnal `micro_ledger_reset_journal_v4`, menghapus dokumen `transactions`, `workouts`, `settings/visual_prefs`, dan `settings/workout_schedule` dalam *chunk* aman, serta memverifikasi ulang ke server bahwa koleksi sudah kosong sebelum menghapus data lokal. Jika terputus di tengah jalan, status ditandai `PARTIAL / NOT COMPLETE` dan dapat dilanjutkan (*resume*) saat aplikasi dibuka kembali.

## 3. Perbaikan Prioritas P1 & Paket PWA GitHub Pages (Bagian 2.4, 2.5, 2.6, 6)
* **[P1-1 / Bagian 2.4] Pemisahan Pemeriksaan Cache `index.html` dan `offline.html` (`PWAEngine.verifyAppShellCache`):** Menghapus penggunaan `mIndex` sebagai fallback untuk `mOff`, sehingga ketersediaan *App Shell* (`index.html`) dan *Halaman Offline Khusus* (`offline.html`) diperiksa dan ditampilkan pada baris diagnostik yang terpisah.
* **[P1-2 / Bagian 2.5 & 2.6] Dokumentasi Splash Screen `4.2s` & Pelindung CSS Offline:** Menghapus komentar lama `~850ms` pada HTML sehingga konsisten dengan implementasi `4.2s` (`600ms` fade-in + `3000ms` full hold + `600ms` fade-out), serta menambahkan aturan CSS struktural cadangan di dalam `<style>`.
* **[Bagian 6] Struktur Paket Root-Ready GitHub Pages (`MICRO-LEDGER-PWA-GITHUB.zip`):** Menyusun seluruh berkas di tingkat root ZIP dengan path relatif `./manifest.json`, `./sw.js`, `./offline.html`, dan `./icons/...`.
