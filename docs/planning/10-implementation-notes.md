# 10 Implementation Notes: FR-001 - Login Akun Kampus

## Issue
Closes #1

## Requirement
- **FR:** FR-001 (Login dengan akun kampus sebelum membuat/memantau laporan), NFR-001 (Akses terbatas untuk user login), NFR-003 (Pemisahan role REPORTER, ADMIN, TECHNICIAN, FACILITY_MANAGER).
- **AC:** AC-001 (Sistem menghalangi akses pelaporan jika belum login), AC-002 (Akses halaman sesuai role setelah login).

## Perubahan
1. **Database Migration (`0002_core_reference.sql`)**: Membuat tabel `users`, `categories`, dan `rooms` beserta data awal (*seed data*) untuk pengujian role.
2. **Worker API (`worker/index.ts`)**:
   - Menambahkan endpoint `POST /api/auth/login` untuk autentikasi dan pendaftaran otomatis akun kampus.
   - Menambahkan otorisasi global berbasis header `X-User-Email` dan `X-User-Role` untuk endpoint `/api/requests`.
3. **Frontend (`src/App.tsx` & `src/App.css`)**:
   - Membuat Form Login dengan validasi email kampus (harus `.ac.id` / `campus.ac.id`) dan dropdown pilihan peran (simulasi role).
   - Menyimpan sesi pengguna di `localStorage` dan menampilkan navigasi *header* global dengan tombol Logout.
   - Membuat tampilan halaman terpisah berdasarkan role (Reporter, Admin, Teknisi, Manajer Fasilitas).
4. **Testing (`package.json` & `tests/unit/auth-validation.test.ts`)**:
   - Memasang `vitest` dan membuat unit test untuk memvalidasi format email kampus.

## Test
* [x] Test dijalankan
* [x] Build berhasil
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** Mencoba menulis file non-artifact menggunakan metadata artifact (mengakibatkan error path), serta mencoba mengeksekusi skrip npm lewat PowerShell saat Execution Policy dinonaktifkan.
* **Perbaikan manusia:** Mengarahkan penulisan file `09-github-issues.md` ke folder yang benar (`docs/planning/`) dan mengarahkan eksekusi perintah terminal melalui `cmd.exe`.

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
