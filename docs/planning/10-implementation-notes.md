# 10 Implementation Notes: FR-06 - Pemantauan Progres dan Komentar Tambahan oleh Pelapor

## Issue
Closes #6

## Requirement
- **FR:** FR-016 (Pelapor melihat perkembangan laporan), FR-017 (Pelapor memberi komentar tambahan setelah laporan dibuat).
- **AC:** AC-015 (Pelapor dapat melihat status saat ini dan riwayat perpindahan status/timeline pada detail laporan), AC-016 (Pelapor dapat menulis komentar baru yang langsung muncul pada thread komentar detail laporan).

## Perubahan
1. **Database Migration (`0006_comments.sql`)**: Membuat tabel `request_comments` untuk menyimpan komentar pelapor beserta indeks performansi.
2. **Worker API (`worker/index.ts`)**:
   - Menambahkan endpoint `GET /api/requests/:id/comments` untuk memuat thread komentar secara kronologis.
   - Menambahkan endpoint `POST /api/requests/:id/comments` untuk mengirim komentar baru (validasi minimal 5 karakter).
3. **Frontend (`src/App.tsx`)**:
   - Menambahkan state management `comments`, `commentInput`, `commentError`, `commentSuccess`.
   - Menambahkan auto-loader `loadComments` yang dipanggil otomatis saat pelapor memilih laporan.
   - Menambahkan fungsi `handleAddComment` untuk mengirim komentar baru ke API.
   - Menambahkan section "Komentar & Catatan Tambahan" di modal detail laporan pelapor, dengan form input dan thread komentar.
4. **Testing (`tests/unit/reporter-comment.test.ts`)**:
   - Membuat 4 unit test untuk validasi isi komentar (>= 5 karakter, tidak boleh kosong, tidak boleh hanya spasi).

## Test
* [x] Test dijalankan (23 test passed, 6 file)
* [x] Build berhasil (`tsc -b && vite build`)
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** Tidak ada kesalahan pada iterasi ini.
* **Perbaikan manusia:** Tidak diperlukan.

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
