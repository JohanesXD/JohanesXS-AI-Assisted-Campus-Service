## Issue
Closes #13

## Requirement
- FR-024: Sistem harus menyediakan dashboard untuk Manajer Fasilitas.
- FR-025: Dashboard harus menampilkan total masalah yang sudah diselesaikan.
- FR-026: Dashboard harus menampilkan chart kategori masalah yang paling sering muncul.
- FR-027: Dashboard harus dapat difilter atau diurutkan berdasarkan terbaru, terlama, ruangan, dan kategori.
- FR-028: Sistem harus menyediakan laporan ringkas untuk Manajer Fasilitas.
- FR-029: Laporan ringkas harus mengandung ruangan masalah dan kategori masalah.
- FR-042: Sistem harus mengizinkan laporan ringkas diunduh (format CSV).
- FR-043: Sistem harus mengizinkan Manajer Fasilitas memberi catatan tindak lanjut dengan menyertakan alasan.

## Acceptance Criteria
- AC-026: Manajer Fasilitas dapat memfilter dashboard berdasarkan waktu, ruangan, dan kategori serta mengunduh data laporan ringkas ke format file CSV.
- AC-027: Manajer Fasilitas dapat menambahkan catatan tindak lanjut dengan alasan wajib pada laporan yang telah ditinjau.

## Perubahan
- Migration 0012: membuat tabel `facility_manager_notes` dan indeks terkait.
- Worker: endpoint `/api/reports/stats` (statistik), `/api/reports/summary` (laporan ringkas), `/api/reports/summary.csv` (ekspor CSV), dan `/api/reports/:id/follow-up` (catatan tindak lanjut).
- Frontend: Tab navigasi Statistik & Laporan untuk Manajer Fasilitas, kartu ringkasan total masalah selesai, chart CSS diagram kategori, form filter pencarian, tombol ekspor CSV, dan dialog modal pengisian catatan tindak lanjut.
- Tests: 5 unit/integration test baru di `tests/unit/facility-manager.test.ts`.

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
