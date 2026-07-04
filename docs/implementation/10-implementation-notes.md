# Implementation Notes — FR-11: Perubahan dan Pembatalan Laporan oleh Pelapor

## Issue
- GitHub Issue: #34
- Requirements: FR-031, FR-032, FR-033, FR-034
- User Story: US-015
- Acceptance Criteria: AC-022, AC-023

## Ringkasan Perubahan
Implementasi fitur yang mengizinkan pelapor untuk mengubah atau membatalkan laporan yang sudah dikirim, dengan alasan perubahan/pembatalan yang tercatat di sistem.

## Backend Changes

### 1. Database Migration (`database/migrations/0010_request_edits.sql`)
- Tabel `request_edits` untuk menyimpan riwayat perubahan laporan
- Kolom: id, request_id, edited_by_user_id, old/new title, description, category_id, room_id, urgency, reason, created_at
- Index pada request_id dan created_at

### 2. API Endpoints (`worker/index.ts`)

#### PATCH /api/requests/:id — Edit Laporan (FR-031, AC-023)
- **Auth**: Hanya REPORTER
- **Validasi**: 
  - Laporan harus milik pelapor (reporter_id === currentUser.id)
  - Status harus SUBMITTED, UNDER_REVIEW, atau REJECTED
  - Alasan perubahan wajib diisi (minimal 5 karakter)
  - Judul tidak boleh kosong, deskripsi minimal 20 karakter
- **Proses**:
  - Update field yang diubah (title, description, category_id, room_id, urgency)
  - Reset status ke UNDER_REVIEW
  - Hapus rejection_reason jika sebelumnya REJECTED
  - Simpan riwayat perubahan ke tabel `request_edits`
  - Catat perubahan status di `request_status_history`
  - Kirim notifikasi "EDITED" ke semua admin

#### POST /api/requests/:id/cancel — Batalkan Laporan (FR-034, AC-022)
- **Auth**: Hanya REPORTER
- **Validasi**:
  - Laporan harus milik pelapor
  - Status harus SUBMITTED, UNDER_REVIEW, atau REJECTED
  - Alasan pembatalan wajib diisi (minimal 5 karakter)
- **Proses**:
  - Update status ke CANCELLED
  - Catat perubahan status di `request_status_history` dengan alasan
  - Kirim notifikasi "CANCELLED" ke semua admin

#### Notifikasi
- Ditambahkan case "EDITED" di `notifyStatusChange` untuk mengirim notifikasi ke admin saat pelapor mengubah laporan

## Frontend Changes (`src/App.tsx`)

### State Baru
- `isEditing`, `editTitle`, `editDescription`, `editCategoryId`, `editBuilding`, `editFloor`, `editRoomId`, `editUrgency`, `editReason`, `editError`, `editSuccess`
- `showCancelModal`, `cancelReason`, `cancelError`, `cancelSuccess`

### Fungsi Baru
- `handleStartEdit()` — Mengisi form edit dari data laporan yang dipilih
- `handleEditSubmit(requestId)` — Mengirim PATCH ke API
- `handleCancelSubmit(requestId)` — Mengirim POST cancel ke API
- `resetEditState()` — Reset semua state edit
- `resetCancelState()` — Reset semua state cancel

### UI Baru
- Tombol "✎ Edit Laporan" dan "✕ Batalkan Laporan" muncul hanya untuk status SUBMITTED, UNDER_REVIEW, REJECTED
- Form edit dengan field: judul, deskripsi, lokasi bertingkat (gedung/lantai/ruangan), kategori, urgensi, alasan perubahan
- Modal konfirmasi pembatalan dengan input alasan

## Test (`tests/unit/reporter-edit-cancel.test.ts`)
- 11 test case untuk validasi edit
- 9 test case untuk validasi cancel
- 2 test case untuk transisi status

## Acceptance Criteria Coverage

| AC | Status | Keterangan |
|----|--------|------------|
| AC-022 | ✅ | Pelapor dapat membatalkan laporan berstatus awal dengan alasan |
| AC-023 | ✅ | Pelapor dapat mengubah laporan, sistem mencatat alasan, mengembalikan status ke UNDER_REVIEW, dan mengirim notifikasi ke admin |

## Checklist Pekerjaan
- [x] Buat form edit laporan dan tombol batalkan laporan bagi Pelapor
- [x] Buat API edit (PATCH /api/requests/:id) dan batalkan (POST /api/requests/:id/cancel)
- [x] Simpan riwayat perubahan di database (request_edits dan status_history)
- [x] Buat integration test untuk validasi alur pembatalan dan review admin setelah edit
- [ ] Update traceability matrix (dilakukan di PR review)

## Asumsi
- ASUMSI: Pelapor hanya bisa edit/cancel laporan milik sendiri
- ASUMSI: Edit mengembalikan status ke UNDER_REVIEW agar admin meninjau ulang
- ASUMSI: Cancel langsung mengubah status ke CANCELLED tanpa perlu persetujuan admin
