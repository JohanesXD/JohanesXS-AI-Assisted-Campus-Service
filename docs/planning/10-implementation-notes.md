# 10 Implementation Notes: FR-04 - Penugasan Laporan kepada Teknisi

## Issue
Closes #4

## Requirement
- **FR:** FR-010 (Admin menugaskan laporan kepada teknisi), FR-011 (Teknisi memantau daftar laporan yang ditugaskan kepadanya).
- **AC:** AC-007 (Admin dapat memilih teknisi aktif dari dropdown saat menugaskan laporan), AC-008 (Laporan berubah status menjadi ASSIGNED dan muncul di antrean tugas Teknisi).

## Perubahan
1. **Database Migration (`0004_assignments.sql`)**: Membuat tabel `request_assignments` untuk memetakan penugasan teknisi secara relasional dengan indeks performa.
2. **Worker API (`worker/index.ts`)**:
   - Menambahkan endpoint `GET /api/technicians` untuk memuat daftar teknisi aktif.
   - Menambahkan endpoint `POST /api/requests/:id/assign` untuk membuat record penugasan baru dan memperbarui status laporan menjadi `ASSIGNED`.
   - Memperbarui `GET /api/requests` untuk melakukan `LEFT JOIN` dengan tabel penugasan dan menyaring daftar tugas berdasarkan `technician_id` khusus untuk role `TECHNICIAN`.
3. **Frontend (`src/App.tsx`)**:
   - Menambahkan dropdown pilihan teknisi pada detail laporan Admin jika statusnya `SUBMITTED` atau `UNDER_REVIEW`.
   - Mengubah dashboard Teknisi agar memuat tabel "Daftar Tugas Saya" secara riil dan dinamis lengkap dengan panel Detail Penugasan.
4. **Testing (`tests/unit/technician-assignment.test.ts`)**:
   - Membuat unit test suite untuk memastikan otorisasi Admin dan validitas pengiriman `technician_id`.

## Test
* [x] Test dijalankan
* [x] Build berhasil
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** Tidak ada kesalahan fatal. Integrasi LEFT JOIN penugasan di backend dan tabel dinamis di frontend berjalan lancar.
* **Perbaikan manusia:** Menyediakan template issue/PR untuk standarisasi dokumentasi.

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
