# 10 Implementation Notes: FR-09 - Konfirmasi Hasil Pekerjaan dan Penutupan Laporan

## Issue
Closes #9

## Requirement
- **FR:** FR-018 (Pelapor konfirmasi pekerjaan selesai), FR-019 (Batas 45 menit konfirmasi), FR-020 (Penutupan otomatis 45 menit), FR-021 (Admin menutup laporan), FR-036 (Pelapor menolak hasil, admin buka ulang).
- **AC:** AC-017 (Pelapor dapat klik Konfirmasi Selesai atau Tolak Hasil dengan alasan), AC-018 (Auto close CLOSED_AUTO setelah 45 menit), AC-019 (Admin dapat buka ulang REOPENED atau tutup paksa CLOSED_ADMIN).

## Perubahan
1. **Database Migration (`database/migrations/0008_closure.sql`)**:
   - Menambahkan index `idx_service_requests_confirm_due` untuk query efisien auto-close pada status `WAITING_REPORTER_CONFIRMATION`.
   - Kolom `resolved_at`, `confirmation_due_at`, `closed_at`, `resolution_rejected_reason` sudah ada dari migration `0003_requests_expand.sql`.

2. **Worker API (`worker/index.ts`)**:
   - Menambahkan fungsi `runAutoClose()` untuk menutup otomatis laporan yang melebihi 45 menit tanpa konfirmasi.
   - `runAutoClose()` dipanggil di awal setiap request handler.
   - **POST `/api/requests/:id/resolve`** — Teknisi menyelesaikan pekerjaan (IN_PROGRESS → RESOLVED → WAITING_REPORTER_CONFIRMATION, set `resolved_at` dan `confirmation_due_at = now + 45 menit`).
   - **POST `/api/requests/:id/confirm-resolution`** — Pelapor konfirmasi selesai (WAITING_REPORTER_CONFIRMATION → CLOSED_REPORTER_CONFIRMED, set `closed_at`).
   - **POST `/api/requests/:id/reject-resolution`** — Pelapor tolak hasil dengan alasan (WAITING_REPORTER_CONFIRMATION → REOPEN_REQUESTED, set `resolution_rejected_reason`).
   - **POST `/api/requests/:id/close`** — Admin tutup laporan (status aktif → CLOSED_ADMIN, set `closed_at`).
   - **POST `/api/requests/:id/reopen`** — Admin buka ulang (REOPEN_REQUESTED → REOPENED).
   - Menambahkan `resolved_at`, `confirmation_due_at`, `closed_at`, `resolution_rejected_reason` ke query detail laporan.

3. **Frontend (`src/App.tsx`)**:
   - Menambahkan state `rejectResolutionReason`, `closureMessage`, `confirmLoading`.
   - Menambahkan fungsi `handleConfirmResolution`, `handleRejectResolution`, `handleAdminClose`, `handleAdminReopen`.
   - Panel detail pelapor: menampilkan panel konfirmasi dengan batas waktu dan tombol "Konfirmasi Selesai" / "Tolak Hasil" saat status `WAITING_REPORTER_CONFIRMATION`.
   - Panel admin: menambahkan tombol "Tutup Laporan" untuk semua laporan aktif, dan "Buka Ulang Laporan" untuk status `REOPEN_REQUESTED`.

4. **Testing (`tests/unit/closure-flow.test.ts`)**:
   - `closure-flow.test.ts` — 13 test: validasi resolve, konfirmasi, penolakan hasil, penutupan admin, pembukaan ulang.

## Test
* [x] Test dijalankan (49 test pass, 10 file)
* [x] Build berhasil

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** -
* **Perbaikan manusia:** -

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
