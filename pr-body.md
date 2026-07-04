## Issue
Closes #12

## Requirement
- FR-038: Sistem harus mengizinkan administrator mengedit kategori, lokasi, atau deskripsi laporan sebelum menugaskan teknisi dengan menyertakan alasan.
- FR-039: Sistem harus mengizinkan administrator menggabungkan laporan duplikat.
- FR-040: Sistem harus mengizinkan administrator mengganti teknisi setelah laporan berjalan dengan persetujuan teknisi lama dan teknisi baru.

## Acceptance Criteria
- AC-024: Admin dapat menggabungkan laporan duplikat ke laporan utama (menghubungkan id laporan duplikat ke laporan utama).
- AC-025: Penggantian teknisi di tengah jalan memerlukan konfirmasi persetujuan (approved) dari teknisi lama dan teknisi baru sebelum assignment baru aktif.

## Perubahan
- Migration 0012: menambahkan kolom `duplicate_of_id` di tabel `service_requests`.
- Worker: endpoint `/api/admin/requests/:id/edit` (edit admin), `/api/admin/requests/:id/merge` (merge laporan), `/api/admin/requests/:id/reassign` (reassign request), dan `/api/requests/:id/reassign/approve` (persetujuan teknisi).
- Frontend: Tab Antrean Review vs Semua Laporan untuk Admin, panel edit detail, tombol & modal merge duplikat, tombol & modal reassign teknisi, serta panel persetujuan reassign di halaman Teknisi.
- Tests: 5 unit/integration test baru di `tests/unit/admin-advanced.test.ts`.

## Test
- [x] Test dijalankan (107/107 passed)
- [x] Build berhasil

## Penggunaan AI
Skill yang digunakan: 10-implementation
Kesalahan AI yang ditemukan: -
Perbaikan manusia: -

## Reviewer
Nama:
Keputusan:
