## Issue
Closes #8

## Requirement
FR-016: Sistem harus mengizinkan pelapor melihat perkembangan laporan.
FR-017: Sistem harus mengizinkan pelapor memberi komentar tambahan setelah laporan dibuat.

## Acceptance Criteria
- AC-015: Pelapor dapat melihat status saat ini dan riwayat perpindahan status (timeline) pada detail laporan.
- AC-016: Pelapor dapat menulis komentar baru yang akan langsung muncul pada thread komentar detail laporan.

## Perubahan
- Migration 0004: tabel request_status_history & request_comments
- Worker: GET/POST comments, GET status-history, GET request detail, recordStatusHistory helper
- Frontend: panel detail laporan dengan timeline & thread komentar
- Tests: 9 test baru (comments + status-history)

## Test
- [x] Test dijalankan (21 tests pass)
- [x] Build berhasil

## Penggunaan AI
Skill yang digunakan: 10-implementation
Kesalahan AI yang ditemukan: Missing created_at property in ServiceRequest type, unused variable requestRow
Perbaikan manusia: Fixed type definition and removed unused variable
