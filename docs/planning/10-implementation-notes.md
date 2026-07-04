# 10 Implementation Notes: FR-038/039/040 - Manajemen Laporan Lanjutan oleh Administrator

## Issue
Closes #12

## Requirement
- **FR:** FR-038 (Administrator mengedit kategori, lokasi, atau deskripsi sebelum menugaskan), FR-039 (Administrator menggabungkan laporan duplikat), FR-040 (Administrator mengganti teknisi setelah laporan berjalan dengan persetujuan).
- **AC:** AC-024 (Admin menggabungkan laporan duplikat ke laporan utama), AC-025 (Persetujuan ganda teknisi lama & baru sebelum reassign aktif).

## Perubahan
1. **Database Migration (`database/migrations/0012_admin_management.sql`)**: Menambahkan kolom `duplicate_of_id` pada tabel `service_requests`.
2. **Worker API (`worker/index.ts`)**:
   - PATCH `/api/admin/requests/:id/edit` untuk edit detail laporan oleh admin dengan alasan wajib.
   - POST `/api/admin/requests/:id/merge` untuk merge laporan duplikat ke laporan utama.
   - POST `/api/admin/requests/:id/reassign` untuk mengajukan penggantian teknisi.
   - POST `/api/requests/:id/reassign/approve` untuk mencatat persetujuan teknisi lama/baru.
3. **Frontend UI (`src/App.tsx`)**:
   - Sistem tab "Antrean Review" dan "Semua Laporan" pada workspace Admin.
   - Form edit admin, dialog merge, dan dropdown reassign teknisi pada detail peninjauan.
   - Panel persetujuan reassignment (menyetujui/menolak) pada workspace tugas Teknisi.
4. **Testing (`tests/unit/admin-advanced.test.ts`)**:
   - Membuat 5 test case baru untuk validasi edit, penggabungan duplikat, reassign, dan persetujuan ganda teknisi.

## Test
* [x] Test dijalankan
* [x] Build berhasil
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** -
* **Perbaikan manusia:** -

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
