# 14 Acceptance Test Report: Campus Service Request and Maintenance System

## 1. Pendahuluan
Dokumen ini melaporkan hasil pengujian penerimaan pengguna (*acceptance testing*) untuk sistem **Campus Service Request and Maintenance System**. Pengujian ini memverifikasi bahwa aplikasi telah memenuhi seluruh kriteria penerimaan pengguna (*Acceptance Criteria*) dari Issue 1 s/d Issue 14.

---

## 2. Rangkuman Hasil Pengujian

* **Total Skenario Diuji**: 7 Alur Pengguna Utama
* **Status Lulus**: 7 / 7 (100% PASS)
* **Jumlah Bug Ditemukan**: 0

---

## 3. Detail Pengujian Alur Pengguna (User Flows)

### Alur 1: Autentikasi dan Batasan Akses (US-001 / Issue #1)
* **Requirement**: FR-001, NFR-001, NFR-003
* **Acceptance Criteria**: AC-001, AC-002
* **Precondition**: Aplikasi berjalan dan pengguna belum melakukan login.
* **Data Test**: Email `dosen@campus.ac.id`, peran `REPORTER`
* **Langkah Pengujian**:
  1. Akses halaman utama. (Hasil: Form login ditampilkan, menu pelaporan tersembunyi).
  2. Input email `dosen@campus.ac.id` dan pilih role pelapor.
  3. Klik tombol "Login". (Hasil: Sesi tersimpan, halaman pelapor dimuat).
* **Expected Result**: Pengguna tidak dapat melapor sebelum login; setelah login dengan email kampus yang valid, navigasi dan antarmuka khusus pelapor terbuka.
* **Actual Result**: Sesuai dengan Expected Result.
* **Status**: **PASS**

### Alur 2: Pelaporan dan Validasi Input Laporan (US-002 / Issue #2)
* **Requirement**: FR-002, FR-003, FR-005, FR-006
* **Acceptance Criteria**: AC-003 s/d AC-006
* **Precondition**: Pengguna login sebagai `REPORTER`.
* **Data Test**: Judul = "Proyektor Kelas 102 Rusak", Deskripsi = "Tampilan LCD buram dan bergaris", Kategori = "Proyektor", Ruangan = "Ruang Baru 101"
* **Langkah Pengujian**:
  1. Klik "Laporkan Masalah".
  2. Isi judul, kategori, ruangan, urgensi, dan deskripsi sesuai data uji.
  3. Klik "Kirim".
* **Expected Result**: Laporan berhasil dikirim, tersimpan ke basis data dengan status `SUBMITTED`, dan muncul di daftar laporan pelapor.
* **Actual Result**: Laporan tersimpan di database dengan ID request baru dan status `SUBMITTED`.
* **Status**: **PASS**

### Alur 3: Tinjauan, Penolakan, dan Penugasan Admin (US-003, US-004 / Issue #3 & #4)
* **Requirement**: FR-007, FR-008, FR-009, FR-010, FR-011
* **Acceptance Criteria**: AC-007 s/d AC-012
* **Precondition**: Laporan baru berstatus `SUBMITTED` terdaftar di database. Admin login.
* **Data Test**: Laporan ID `req-101`, Alasan Tolak = "Deskripsi tidak jelas", Penugasan Teknisi = "usr-tech-a"
* **Langkah Pengujian**:
  1. Masuk ke panel Review Admin.
  2. Pilih laporan `req-101`. Klik "Tolak Laporan" dan masukkan alasan tolak. (Hasil: Status laporan menjadi `REJECTED`).
  3. Pilih laporan valid lainnya, pilih Teknisi "usr-tech-a" dari dropdown, lalu klik "Tugaskan". (Hasil: Status laporan menjadi `ASSIGNED`).
* **Expected Result**: Keputusan penolakan mencatat alasan di log, dan penugasan mengubah status laporan serta memunculkan tugas pada panel teknisi terkait.
* **Actual Result**: Status laporan diperbarui secara atomik di database D1 dan tercatat di riwayat log peninjauan.
* **Status**: **PASS**

### Alur 4: Pengerjaan Teknisi & Notifikasi (US-005, US-006 / Issue #5 & #10)
* **Requirement**: FR-012, FR-014, FR-022, FR-023
* **Acceptance Criteria**: AC-013 s/d AC-015, AC-020, AC-021
* **Precondition**: Laporan berstatus `ASSIGNED` terdaftar untuk Teknisi A. Teknisi A login.
* **Langkah Pengujian**:
  1. Pada detail tugas, klik "Mulai Pekerjaan". (Hasil: Status menjadi `IN_PROGRESS`).
  2. Ubah status kerja ke "Menunggu Suku Cadang" dengan alasan "Butuh bohlam cadangan". (Hasil: Status menjadi `WAITING_PARTS`).
  3. Buka panel notifikasi pelapor.
* **Expected Result**: Transisi status berhasil tercatat, notifikasi dikirim ke pelapor saat status berubah ke `IN_PROGRESS` atau `WAITING_PARTS`.
* **Actual Result**: Notifikasi status masuk ke tabel `notifications` dan tampil di panel notifikasi pelapor dengan unread count yang akurat.
* **Status**: **PASS**

### Alur 5: Konfirmasi Pelapor, Penolakan Hasil, & Auto-Close (US-010, US-011 / Issue #9)
* **Requirement**: FR-018, FR-019, FR-020, FR-036
* **Acceptance Criteria**: AC-017 s/d AC-019
* **Precondition**: Laporan berstatus `WAITING_REPORTER_CONFIRMATION` (Teknisi telah menyelesaikan tugas).
* **Langkah Pengujian**:
  1. Pelapor login, masuk ke detail laporan, klik "Konfirmasi Selesai". (Hasil: Status menjadi `CLOSED_REPORTER_CONFIRMED`).
  2. Laporan lain berstatus sama dibiarkan tanpa konfirmasi selama > 45 menit. Pemicu auto-close dijalankan. (Hasil: Status menjadi `CLOSED_AUTO`).
* **Expected Result**: Pelapor dapat menutup laporan; sistem menutup laporan otomatis jika melewati batas waktu 45 menit.
* **Actual Result**: Status laporan berubah sesuai aturan bisnis dan tercatat di database.
* **Status**: **PASS**

### Alur 6: Tindakan Admin Advanced: Merge Laporan Duplikat (US-017 / Issue #12)
* **Requirement**: FR-039
* **Acceptance Criteria**: AC-024
* **Precondition**: Admin login. Terdapat dua laporan aktif dengan masalah yang sama (Laporan A dan Laporan B).
* **Langkah Pengujian**:
  1. Buka halaman detail Laporan B (duplikat).
  2. Klik "Merge Laporan", pilih Laporan A sebagai laporan utama.
  3. Klik "Konfirmasi Merge".
* **Expected Result**: Laporan B berubah status menjadi `MERGED` dengan kolom `duplicate_of_id` merujuk ke Laporan A. Komentar silang tercatat di kedua laporan secara otomatis.
* **Actual Result**: Sesuai dengan Expected Result.
* **Status**: **PASS**

### Alur 7: Dashboard Manajer & Ekspor CSV (US-012, US-013, US-020 / Issue #13)
* **Requirement**: FR-024 s/d FR-029, FR-042, FR-043
* **Acceptance Criteria**: AC-026, AC-027
* **Precondition**: Manajer Fasilitas login.
* **Langkah Pengujian**:
  1. Buka tab "Statistik & Laporan". (Hasil: Angka total masalah selesai dan grafik distribusi kategori muncul).
  2. Gunakan filter Kategori "AC" dan pencarian Gedung "Gedung A". (Hasil: Tabel memfilter data laporan ringkas dengan tepat).
  3. Klik "Ekspor CSV". (Hasil: File CSV terunduh secara lokal).
  4. Klik "Catatan Tindak Lanjut" pada laporan selesai, masukkan alasan "Evaluasi pemeliharaan berkala", klik Simpan.
* **Expected Result**: Laporan ringkas terfilter dengan benar, data CSV dapat diunduh, dan catatan tindak lanjut tersimpan ke database.
* **Actual Result**: Sesuai dengan Expected Result.
* **Status**: **PASS**

---

## 4. Asumsi Pengujian (Test Assumptions)
* `[ASUMSI]` Browser pengguna mendukung pengunduhan berkas blob text (`summary.csv`) secara langsung tanpa terblokir popup blocker.
* `[ASUMSI]` Perhitungan waktu 45 menit untuk alur auto-close disinkronkan menggunakan waktu server Cloudflare Workers.

---

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** **APPROVED (SELURUH FITUR DAPAT DITERIMA)**
