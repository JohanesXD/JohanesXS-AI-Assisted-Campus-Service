# Implementation Notes — FR-12: Advanced Admin Actions

## Issue
- GitHub Issue: #12
- Requirements: FR-038, FR-039, FR-040
- User Story: US-017
- Acceptance Criteria: AC-024, AC-025

## Ringkasan Perubahan
Implementasi fitur administrasi lanjutan yang mengizinkan administrator mengedit detail laporan (kategori, lokasi, deskripsi) dengan alasan perubahan wajib, menggabungkan laporan duplikat ke laporan utama, mengajukan penggantian teknisi utama (reassignment) dengan alasan, serta alur persetujuan ganda (dual-approval) dari teknisi lama & baru.

## Backend Changes

### 1. Database Migration (`database/migrations/0012_admin_management.sql`)
- Menambahkan kolom `duplicate_of_id` (TEXT) ke tabel `service_requests` sebagai referensi silang ke laporan utama jika ditandai sebagai duplikat.

### 2. API Endpoints (`worker/index.ts`)

#### PATCH /api/admin/requests/:id/edit — Admin Edit Laporan (FR-038)
- **Auth**: Hanya ADMIN
- **Validasi**:
  - Alasan perubahan wajib diisi (minimal 5 karakter).
  - Deskripsi minimal 20 karakter jika diubah.
- **Proses**:
  - Memperbarui `category_id`, `room_id`, dan `description` di tabel `service_requests`.
  - Mencatat alasan perubahan di tabel `request_edits`.
  - Mencatat perpindahan status ke riwayat.

#### POST /api/admin/requests/:id/merge — Gabungkan Duplikat (FR-039, AC-024)
- **Auth**: Hanya ADMIN
- **Validasi**:
  - `main_request_id` wajib diisi dan harus merujuk laporan aktif yang valid.
  - Laporan duplikat tidak boleh dalam status tertutup atau digabungkan sebelumnya.
- **Proses**:
  - Memperbarui `status` laporan duplikat menjadi `MERGED` dan mengeset `duplicate_of_id` ke id laporan utama.
  - Menambahkan komentar otomatis silang di kedua laporan yang menginformasikan penggabungan tersebut.

#### POST /api/admin/requests/:id/reassign — Ajukan Reassign Teknisi (FR-040, AC-025)
- **Auth**: Hanya ADMIN
- **Validasi**:
  - `new_technician_id` harus terdaftar sebagai teknisi aktif.
  - Harus ada teknisi utama aktif saat ini pada laporan tersebut.
  - Tidak boleh ada pengajuan reassignment tertunda untuk laporan tersebut.
- **Proses**:
  - Membuat assignment baru di tabel `request_assignments` dengan tipe `PRIMARY`, status `REPLACEMENT_PENDING`, dan merekam `technician_id` teknisi baru serta alasan reassign.
  - Mengirim notifikasi perubahan status kepada teknisi lama dan baru.

#### POST /api/requests/:id/reassign/approve — Persetujuan Teknisi (FR-040, AC-025)
- **Auth**: Hanya TECHNICIAN (lama atau baru)
- **Validasi**:
  - Harus ada pengajuan reassign yang sedang tertunda (`REPLACEMENT_PENDING`).
  - Pengguna yang masuk harus merupakan salah satu dari teknisi lama atau baru.
- **Proses**:
  - Jika menolak (`approve: false`), status pengajuan diset `DECLINED` dan admin menerima notifikasi penolakan.
  - Jika menyetujui (`approve: true`), mengupdate timestamp persetujuan bersangkutan (`old_technician_approved_at` atau `new_technician_approved_at`).
  - Jika kedua teknisi telah menyetujui, menonaktifkan assignment lama (`REPLACED`) dan mengaktifkan assignment baru (`ACTIVE`), memperbarui status laporan menjadi `ASSIGNED`, serta mencatat di riwayat status.

## Frontend Changes (`src/App.tsx`)

### State Baru
- `isAdminEditing`, `adminEditCategoryId`, `adminEditRoomId`, `adminEditDescription`, `adminEditReason`
- `showMergeModal`, `mergeTargetRequestId`
- `showReassignModal`, `reassignTechnicianId`, `reassignReason`

### Fungsi Baru
- `handleAdminEditSubmit(requestId)` — Mengirim data edit admin ke backend.
- `handleAdminMergeSubmit(requestId)` — Mengirim perintah merge laporan duplikat.
- `handleAdminReassignSubmit(requestId)` — Mengirim pengajuan reassignment teknisi.
- `handleTechReassignDecision(requestId, approved)` — Mengirim keputusan persetujuan/penolakan reassignment teknisi.

### UI Baru
- Pilihan Tab Administrator: "Antrean Review" vs "Semua Laporan".
- Form Edit Laporan untuk Admin jika laporan berstatus `SUBMITTED` or `UNDER_REVIEW`.
- Dropdown penugasan teknisi utama pertama kali.
- Tombol "Merge Duplikat" dan "Ganti Teknisi" pada detail laporan admin.
- Panel persetujuan reassignment di layar kerja detail tugas teknisi.

## Test (`tests/unit/admin-advanced.test.ts`)
- Pengujian API Edit Detail Laporan oleh Admin beserta validasi panjang alasan.
- Pengujian API Penggabungan Laporan Duplikat ke laporan utama.
- Pengujian API Pengajuan Reassignment Teknisi.
- Pengujian API Persetujuan Bersama (*dual-approval*) hingga assignment aktif.

## Acceptance Criteria Coverage

| AC | Status | Keterangan |
|----|--------|------------|
| AC-024 | ✅ | Admin dapat menggabungkan laporan duplikat ke laporan utama. |
| AC-025 | ✅ | Penggantian teknisi membutuhkan persetujuan teknisi lama & baru sebelum aktif. |

## Checklist Pekerjaan
- [x] Buat form edit admin, dialog merge duplikat, dan UI penggantian teknisi
- [x] Buat API merge, edit admin, dan ganti teknisi
- [x] Simpan persetujuan teknisi lama/baru di database D1
- [x] Buat integration/unit test untuk alur persetujuan penggantian teknisi dan penggabungan duplikat
- [x] Update traceability matrix
