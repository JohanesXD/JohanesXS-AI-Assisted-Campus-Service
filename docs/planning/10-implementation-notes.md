# 10 Implementation Notes: FR-002 - Pembuatan Laporan Masalah Fasilitas

## Issue
Closes #2

## Requirement
- **FR:** FR-002 (Pembuatan laporan masalah), FR-003 (Menyimpan data detail laporan), FR-005 (Kategori proyektor, AC, kelas, kebersihan, dll), FR-006 (Memilih lokasi ruangan), FR-035 (Ruangan dikelompokkan berdasarkan gedung & lantai).
- **AC:** AC-003 (Dropdown lokasi bertingkat: Gedung -> Lantai -> Ruangan), AC-004 (Laporan berhasil disimpan jika judul, deskripsi min 20 karakter, kategori, lokasi, dan urgensi diisi lengkap).

## Perubahan
1. **Database Migration (`0003_requests_expand.sql`)**: Memperluas skema tabel `service_requests` dengan relasi kunci asing (`reporter_id`, `category_id`, `room_id`) serta kolom pendukung status dan urgensi.
2. **Worker API (`worker/index.ts`)**:
   - Menambahkan endpoint `GET /api/categories` untuk mengambil daftar kategori aktif.
   - Menambahkan endpoint `GET /api/rooms` untuk mengambil daftar ruangan aktif.
   - Memperbarui `GET /api/requests` untuk melakukan JOIN relasional dan filter khusus pelapor (`reporter_id`).
   - Memperbarui `POST /api/requests` untuk memvalidasi integritas relasional data masukan kategori, ruangan, tingkat urgensi, serta minimal panjang deskripsi.
3. **Frontend (`src/App.tsx`)**:
   - Menambahkan pemanggilan API kategori dan ruangan pada saat login berhasil.
   - Mengubah input lokasi manual menjadi pilihan bertingkat (**Gedung** -> **Lantai** -> **Ruangan**) yang menyaring pilihan secara dinamis.
   - Mengubah dropdown kategori diisi dari database dan menambahkan dropdown urgensi (Low, Medium, High, Urgent).
   - Memperbarui tabel riwayat pelapor untuk memuat kolom detail lokasi terstruktur, kategori, dan urgensi.
4. **Testing (`tests/unit/request-validation.test.ts`)**:
   - Membuat test suite untuk memvalidasi batasan input pembuatan laporan (panjang karakter deskripsi, kelengkapan kolom, dan tingkat urgensi).

## Test
* [x] Test dijalankan
* [x] Build berhasil
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** Tidak ada kesalahan fatal. Kode relasional D1 dan dynamic cascading dropdowns diimplementasikan dengan aman dan efisien.
* **Perbaikan manusia:** Menyediakan template issue/PR yang harus dipatuhi.

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
