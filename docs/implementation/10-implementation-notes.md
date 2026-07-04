# Implementation Notes — FR-12: Advanced Admin Actions & FR-13: Facility Manager Dashboard

## Issue
- GitHub Issue: #12, #13
- Requirements: FR-038, FR-039, FR-040, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-042, FR-043
- User Story: US-017, US-012, US-013, US-020
- Acceptance Criteria: AC-024, AC-025, AC-026, AC-027

## Ringkasan Perubahan
Implementasi menyeluruh untuk fitur administrasi lanjutan (Issue 12) dan dashboard analitis manajer fasilitas (Issue 13). Ini mencakup pengelolaan detail laporan, merge laporan duplikat, reassign teknisi dengan persetujuan ganda, visualisasi statistik masalah selesai, diagram batang kategori, filter laporan ringkas, ekspor laporan ke file CSV, dan pengisian catatan tindak lanjut evaluator.

## Backend Changes

### 1. Database Migration (`database/migrations/0012_admin_management.sql`)
- Menambahkan kolom `duplicate_of_id` (TEXT) ke tabel `service_requests` untuk referensi laporan utama.
- Membuat tabel `facility_manager_notes` untuk mencatat catatan evaluasi tindak lanjut beserta alasannya.

### 2. API Endpoints (`worker/index.ts`)

#### PATCH /api/admin/requests/:id/edit — Admin Edit Laporan (FR-038)
- Memperbarui detail laporan sebelum penugasan dengan menyertakan catatan alasan wajib.

#### POST /api/admin/requests/:id/merge — Gabungkan Duplikat (FR-039, AC-024)
- Menandai laporan duplikat sebagai `MERGED` dan menautkannya ke laporan utama.

#### POST /api/admin/requests/:id/reassign — Reassign Teknisi (FR-040, AC-025)
- Pengajuan penggantian teknisi aktif ke status `REPLACEMENT_PENDING`.

#### POST /api/requests/:id/reassign/approve — Persetujuan Teknisi (FR-040, AC-025)
- Persetujuan ganda (*dual-approval*) teknisi lama dan baru untuk mengaktifkan assignment baru.

#### GET /api/reports/stats — Statistik Dashboard (FR-024, FR-025, FR-026)
- **Auth**: Hanya FACILITY_MANAGER
- Mengembalikan total laporan berstatus selesai dan distribusi kategori laporan.

#### GET /api/reports/summary — Laporan Ringkas (FR-028, FR-029)
- **Auth**: Hanya FACILITY_MANAGER
- Mengembalikan daftar laporan terfilter berdasarkan ruangan, kategori, rentang tanggal, dan diurutkan.

#### GET /api/reports/summary.csv — Ekspor Laporan CSV (FR-042, AC-026)
- **Auth**: Hanya FACILITY_MANAGER
- Menghasilkan file teks format CSV yang kompatibel dengan parameter filter aktif.

#### POST /api/reports/:id/follow-up — Catatan Tindak Lanjut (FR-043, AC-027)
- **Auth**: Hanya FACILITY_MANAGER
- Validasi alasan perubahan wajib (minimal 5 karakter) dan menyimpan catatan tindak lanjut evaluator.

## Frontend Changes (`src/App.tsx`)

### State Baru
- `fmStats`, `fmSummary`, `fmFilterCategory`, `fmFilterRoom`, `fmFilterStartDate`, `fmFilterEndDate`, `fmSort`
- `selectedFmReport`, `fmNoteInput`, `fmNoteReasonInput`

### Fungsi Baru
- `loadFmStats()`, `loadFmSummary()` — Memuat statistik dan laporan ringkas.
- `handleAddFmFollowUp(e)` — Menyimpan catatan tindak lanjut ke backend.

### UI Baru
- Pilihan navigasi atas khusus Manajer Fasilitas: "Statistik & Laporan" vs "Kelola Ruangan".
- Kartu ringkasan total masalah diselesaikan dan CSS progress bar diagram kategori terpopuler.
- Form filter komparatif (ruangan, kategori, tanggal mulai/akhir, pengurutan).
- Tabel laporan ringkas beserta tombol ekspor **CSV** dan dialog modal **Catatan Tindak Lanjut**.

## Test (`tests/unit/facility-manager.test.ts`)
- Pengujian stats dashboard (total solved, category count).
- Pengujian filter pencarian laporan ringkas.
- Pengujian unduhan ekspor format CSV.
- Pengujian validasi alasan catatan tindak lanjut.

## Acceptance Criteria Coverage

| AC | Status | Keterangan |
|----|--------|------------|
| AC-026 | ✅ | Filter dashboard analitis dan ekspor data ke file CSV. |
| AC-027 | ✅ | Penambahan catatan tindak lanjut dengan alasan wajib minimal 5 karakter. |

## Checklist Pekerjaan
- [x] Buat halaman Dashboard dan Laporan Ringkas untuk Manajer Fasilitas
- [x] Buat tombol export CSV di frontend dan API endpoint `/api/reports/summary.csv`
- [x] Buat API POST `/api/reports/:id/follow-up` untuk mencatat tindak lanjut Manajer
- [x] Buat unit test untuk validasi data export CSV dan alasan wajib pada catatan tindak lanjut
- [x] Update traceability matrix
