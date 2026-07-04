# 10 Implementation Notes: FR-08 - Pemantauan Progres dan Komentar oleh Pelapor

## Issue
Closes #8

## Requirement
- **FR:** FR-016 (Pelapor melihat perkembangan laporan), FR-017 (Pelapor memberi komentar tambahan).
- **AC:** AC-015 (Pelapor dapat melihat status saat ini dan riwayat perpindahan status pada detail laporan), AC-016 (Pelapor dapat menulis komentar baru yang akan langsung muncul pada thread komentar detail laporan).

## Perubahan
1. **Database Migration (`database/migrations/0007_status_history.sql`)**:
   - Membuat tabel `request_status_history` untuk menyimpan riwayat perubahan status laporan.
   - Tabel `request_comments` sudah dibuat oleh migration `0006_comments.sql` (FR-07).
   - Menambahkan index pada `request_id` dan `created_at` di `request_status_history`.

2. **Worker API (`worker/index.ts`)**:
   - Menambahkan fungsi `recordStatusHistory()` untuk mencatat riwayat status secara konsisten.
   - **GET `/api/requests/:id`** — Mengembalikan detail laporan lengkap (termasuk kategori, lokasi, pelapor). Reporter hanya bisa melihat laporan miliknya sendiri.
   - **GET `/api/requests/:id/status-history`** — Mengembalikan riwayat status (timeline) dari awal sampai status terkini.
   - **GET `/api/requests/:id/comments`** — Mengembalikan daftar komentar pada laporan (diimplementasikan oleh FR-07, endpoint menggunakan schema `content`/`user_id`).
   - **POST `/api/requests/:id/comments`** — Menambahkan komentar baru (diimplementasikan oleh FR-07, minimal 5 karakter, ID berformat `cmt-`).
   - Mencatat status history otomatis saat laporan dibuat (`SUBMITTED`) dan saat ditolak (`REJECTED`).

3. **Frontend (`src/App.tsx`)**:
   - Baris laporan pada tabel "Laporan Saya" sekarang dapat diklik untuk membuka panel detail.
   - Panel detail menampilkan: informasi laporan, riwayat status (timeline visual dengan dot dan garis), thread komentar, dan form input komentar.
   - Setelah komentar berhasil dikirim, thread komentar diperbarui secara otomatis.

4. **Testing (`tests/unit/comments.test.ts`, `tests/unit/status-history.test.ts`)**:
   - `comments.test.ts` — 4 test: komentar valid, komentar kosong, komentar spasi, properti tidak ada.
   - `status-history.test.ts` — 5 test: transisi valid, status tidak dikenal, alasan penolakan, penolakan dengan alasan valid, status kosong.

## Test
* [x] Test dijalankan (21 test pass)
* [x] Build berhasil
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
<<<<<<< HEAD
* **Kesalahan AI yang ditemukan:** Tipe `ServiceRequest` tidak memiliki properti `created_at` sehingga menyebabkan error tsc. Variabel `requestRow` tidak digunakan dan menyebabkan warning.
* **Perbaikan manusia:** Menambahkan `created_at` dan `updated_at` ke tipe `ServiceRequest`, menghapus variabel `requestRow` yang tidak terpakai.

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
