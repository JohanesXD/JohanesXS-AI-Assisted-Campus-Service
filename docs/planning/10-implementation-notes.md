# 10 Implementation Notes: FR-031/032/033/034 - Perubahan dan Pembatalan Laporan oleh Pelapor

## Issue
Closes #11

## Requirement
- **FR:** FR-031 (Pelapor mengubah laporan dengan alasan), FR-032 (Menampilkan perubahan & alasan kepada admin), FR-033 (Admin menutup laporan tidak valid setelah perubahan), FR-034 (Pelapor membatalkan laporan dengan alasan).
- **AC:** AC-022 (Pelapor membatalkan laporan berstatus awal dengan alasan), AC-023 (Pelapor mengubah laporan, mengembalikan status ke review admin, mencatat alasan dan mengirim notifikasi).

## Perubahan
1. **Database Migration (`database/migrations/0010_request_edits.sql`)**: Membuat tabel `request_edits` untuk menyimpan riwayat perubahan laporan.
2. **Worker API (`worker/index.ts`)**:
   - PATCH `/api/requests/:id` untuk memperbarui laporan oleh pelapor dengan alasan perubahan (status kembali ke `UNDER_REVIEW`).
   - POST `/api/requests/:id/cancel` untuk membatalkan laporan oleh pelapor (status menjadi `CANCELLED`).
   - Notifikasi perubahan "EDITED" dan "CANCELLED" dikirim ke seluruh admin.
3. **Frontend UI (`src/App.tsx`)**:
   - Tombol "✎ Edit Laporan" dan "✕ Batalkan Laporan" untuk pelapor pada laporan aktif.
   - Form ubah detail laporan (judul, deskripsi, lokasi, kategori, urgensi, alasan).
   - Modal konfirmasi pembatalan laporan dengan input alasan pembatalan.
4. **Testing (`tests/unit/reporter-edit-cancel.test.ts`)**:
   - Membuat 22 test case untuk memvalidasi proses edit, pembatalan, validasi input, dan transisi status.

## Test
* [x] Test dijalankan
* [x] Build berhasil
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** -
* **Perbaikan manusia:** -

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
