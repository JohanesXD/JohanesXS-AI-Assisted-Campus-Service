# 12 Test Plan: Campus Service Request and Maintenance System

## 1. Pendahuluan
Dokumen ini menetapkan rencana pengujian (*test plan*) untuk sistem **Campus Service Request and Maintenance System**. Tujuan utama dari rencana ini adalah untuk memverifikasi fungsionalitas, kontrol hak akses berbasis peran, transisi status laporan, pengiriman notifikasi, analitik manajer fasilitas, dan integritas data terhadap persyaratan yang dispesifikasikan dalam `03-requirement-specification.md`.

---

## 2. Fitur yang Harus Diuji (Scope & Requirement Trace)

Fitur-fitur yang tercakup dalam pengujian ini dikelompokkan berdasarkan peran pengguna:

### A. Fitur Pelapor (Reporter)
* **Login Akun Kampus** (FR-001, US-001)
* **Pembuatan Laporan Masalah** (FR-002, FR-003, FR-005, FR-006, US-002)
* **Pemantauan Progress & Timeline Laporan** (FR-016, US-009)
* **Komentar Tambahan** (FR-017, US-009)
* **Edit & Batal Laporan Aktif** (FR-031, FR-034, US-015)
* **Konfirmasi/Penolakan Penyelesaian** (FR-018, FR-019, FR-036, US-010, US-016)

### B. Fitur Administrator (Admin)
* **Peninjauan Laporan Masuk** (FR-007, US-003)
* **Penolakan Laporan dengan Alasan** (FR-008, FR-009, US-003)
* **Edit Data Laporan sebelum Ditugaskan** (FR-038, US-017)
* **Penugasan Teknisi Utama & Tambahan** (FR-010, FR-015, US-004, US-007)
* **Pembaruan Progress Kerja dengan Alasan** (FR-013, US-008)
* **Penggabungan Laporan Duplikat** (FR-039, US-017)
* **Penggantian Teknisi (*Reassignment*)** (FR-040, US-017)
* **Penutupan Laporan Manual** (FR-021, FR-033, US-011)

### C. Fitur Teknisi (Technician)
* **Pemantauan Tugas Masuk** (FR-011, US-005)
* **Pembaruan Progress & Status Khusus** (FR-012, FR-014, US-006)
* **Pengisian Estimasi Waktu Selesai** (FR-041, US-018)
* **Persetujuan Penggantian Teknisi** (FR-040, US-017)

### D. Fitur Manajer Fasilitas (Facility Manager)
* **Dashboard Analitis & Metrik Kategori** (FR-024, FR-025, FR-026, FR-027, US-012)
* **Laporan Ringkas & Ekspor CSV** (FR-028, FR-029, FR-042, US-013, US-020)
* **Evaluasi Catatan Tindak Lanjut** (FR-043, US-020)
* **Pembaruan Daftar Ruangan Kampus** (FR-030, US-014)

---

## 3. Jenis Pengujian (Test Types)

1. **Unit Testing**:
   * Memvalidasi modul logic independen seperti validasi email kampus (`auth-validation.test.ts`) dan pemformatan data ekspor.
2. **Integration Testing**:
   * Menguji interaksi router API Workers terhadap *mock* D1 database environment menggunakan **Vitest** untuk memverifikasi kebenaran respons HTTP dan transaksi basis data.
3. **End-to-End (E2E) Manual Testing**:
   * Melakukan verifikasi UI responsif dan interaksi penuh multi-role langsung melalui browser modern.

---

## 4. Skenario Pengujian Kunci (Prioritas "Must")

### Skenario 1: Login Akun Kampus & Validasi Email (FR-001 / Issue #1)
* **Precondition**: Pengguna berada pada halaman utama dan belum melakukan autentikasi.
* **Data Test**:
  * Email valid: `mahasiswa@student.unklab.ac.id`, `dosen@campus.ac.id`
  * Email tidak valid: `luar@gmail.com`, `penyusup@outlook.com`
* **Langkah Kerja**:
  1. Masukkan alamat email ke kolom input login.
  2. Pilih peran (*role*) simulasi.
  3. Klik tombol "Login".
* **Expected Result**:
  * Email valid diizinkan masuk, token simulasi disimpan di `localStorage`, dan dasbor sesuai role ditampilkan.
  * Email tidak valid ditolak dengan pesan kesalahan format domain kampus.

### Skenario 2: Alur Pembuatan Laporan Masalah (FR-002, FR-003 / Issue #2)
* **Precondition**: Pengguna telah login sebagai pelapor (`REPORTER`).
* **Data Test**:
  * Judul: "Lampu Kelas Mati"
  * Deskripsi: "Lampu LCD di depan papan tulis kelas 201 mati total."
  * Kategori: "Alat Laboratorium" (atau kategori lain dari sistem)
  * Ruangan: "Ruang Baru 101"
  * Urgensi: "HIGH"
* **Langkah Kerja**:
  1. Buka form "Laporkan Masalah".
  2. Isi seluruh kolom wajib (Judul, Deskripsi, Kategori, Ruangan, Urgensi).
  3. Klik tombol "Kirim Laporan".
* **Expected Result**:
  * Laporan berhasil disimpan ke database dengan status `SUBMITTED`, nomor laporan otomatis terbuat (contoh: `REQ-20260704-XXXX`), dan notifikasi dikirim ke admin.

### Skenario 3: Transisi Status Penugasan & Pengerjaan Teknisi (FR-010, FR-012 / Issue #4 & #5)
* **Precondition**: Laporan berstatus `SUBMITTED` telah disetujui admin dan ditugaskan ke Teknisi A.
* **Data Test**: `status = 'ASSIGNED'`, `technician_id = 'usr-tech-a'`
* **Langkah Kerja**:
  1. Teknisi A login dan membuka halaman tugasnya.
  2. Klik tombol "Mulai Pengerjaan" pada laporan tersebut.
  3. Perbarui progress dengan deskripsi "Pengecekan kabel sirkuit utama".
* **Expected Result**:
  * Status laporan berubah menjadi `IN_PROGRESS`. Log aktivitas dan notifikasi berhasil terkirim ke pelapor.

### Skenario 4: Batas Waktu & Penutupan Otomatis 45 Menit (FR-019, FR-020 / Issue #9)
* **Precondition**: Teknisi menyatakan laporan `RESOLVED` (Pekerjaan Selesai).
* **Data Test**: `resolved_at` diset ke 46 menit yang lalu, status laporan `WAITING_REPORTER_CONFIRMATION`.
* **Langkah Kerja**:
  1. Pemicu rutin `runAutoClose` (scheduler/cron) dijalankan.
* **Expected Result**:
  * Status laporan berubah otomatis menjadi `CLOSED_AUTO` karena melewati batas 45 menit tanpa respons dari pelapor.

---

## 5. Risiko Pengujian & Rencana Mitigasi

| Risiko Pengujian | Dampak | Rencana Mitigasi |
| :--- | :---: | :--- |
| **Peralihan Hak Akses yang Longgar** | Tinggi | Melakukan pengujian penetrasi *mock* peran di mana request dari teknisi/pelapor dikirim ke endpoint admin (`/api/admin/*`) untuk memastikan respons yang dikembalikan konsisten bernilai HTTP 403 Forbidden. |
| **Race Condition dalam Persetujuan Penggantian Teknisi** | Sedang | Memvalidasi kueri basis data pada endpoint `/reassign/approve` menggunakan status atomik di database (`REPLACEMENT_PENDING`), memastikan transisi status `ASSIGNED` hanya terpicu jika kedua entitas memberikan lampu hijau secara non-null. |
| **Kegagalan Ekspor File CSV Berukuran Besar** | Rendah | Menguji endpoint ekspor analitis (`/api/reports/summary.csv`) dengan volume data mock 50+ baris guna menguji performa pembentukan stream teks secara real-time. |

---

## 6. Asumsi Pengujian (Test Assumptions)
* `[ASUMSI]` Browser yang digunakan mendukung fungsionalitas standard seperti `localStorage` dan parsing tipe data berkas CSV bawaan.
* `[ASUMSI]` Lingkungan Workers D1 (SQLite) menggunakan konfigurasi UTC sebagai basis penentuan waktu kedaluwarsa 45 menit.

---

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** **APPROVED (RENCANA SIAP DIJALANKAN)**
