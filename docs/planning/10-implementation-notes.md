# 10 Implementation Notes: FR-05 - Penerimaan dan Pembaruan Progress Laporan oleh Teknisi

## Issue
Closes #5

## Requirement
- **FR:** FR-012 (Teknisi memperbarui status progress laporan perbaikan), FR-013 (Teknisi menulis catatan progress perbaikan).
- **AC:** AC-009 (Teknisi dapat memilih status progress baru: IN_PROGRESS, ON_HOLD, RESOLVED dan menambahkan catatan), AC-010 (Catatan progress tersimpan di database dan dapat dibaca oleh aktor lainnya).

## Perubahan
1. **Database Migration (`0005_progress.sql`)**: Membuat tabel `technician_progress` untuk merekam log kemajuan pekerjaan tanpa kolom foto/URL gambar yang di-out-of-scope-kan.
2. **Worker API (`worker/index.ts`)**:
   - Menambahkan endpoint `GET /api/requests/:id/progress` untuk memuat riwayat perbaikan.
   - Menambahkan endpoint `POST /api/requests/:id/progress` khusus untuk role TECHNICIAN yang ditugaskan secara aktif pada laporan, memvalidasi input catatan perbaikan (min 5 karakter).
3. **Frontend (`src/App.tsx` & `src/App.css`)**:
   - Menambahkan form interaktif (pilihan status dan area teks catatan) di detail tugas Teknisi.
   - Menambahkan visualisasi timeline riwayat progress perbaikan yang cantik dan modern untuk Pelapor, Admin, dan Teknisi.
4. **Testing (`tests/unit/technician-progress.test.ts`)**:
   - Membuat unit test suite untuk memvalidasi isi catatan, keabsahan status baru, dan kecocokan role aktor.

## Test
* [x] Test dijalankan
* [x] Build berhasil
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** AI melakukan penggantian baris yang tidak sengaja menghapus kurung tutup `}` dari blok penugasan teknisi (`assignMatch`), menyebabkan Vitest gagal parse.
* **Perbaikan manusia:** Menambahkan kembali kurung tutup yang terhapus secara manual.

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
