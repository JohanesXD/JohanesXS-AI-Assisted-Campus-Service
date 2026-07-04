# 10 Implementation Notes: FR-015 - Pengerahan Teknisi Tambahan (Kolaborasi)

## Issue
Closes #7

## Requirement
- **FR:** FR-015 (Sistem harus mengizinkan lebih dari satu teknisi dikerahkan jika teknisi menyatakan butuh bantuan dan administrator menyetujuinya).
- **AC:** AC-013 (Jika laporan berstatus NEED_HELP, administrator dapat menambahkan teknisi tambahan (ADDITIONAL) ke laporan tersebut), AC-014 (Laporan yang ditugaskan ke beberapa teknisi akan muncul di antrean "Tugas Saya" milik seluruh teknisi yang terlibat).

## Perubahan
1. **Database Migration (`database/migrations/0004_workflow.sql`)**:
   - Membuat tabel `request_assignments` untuk menyimpan data penugasan teknisi utama dan tambahan.
   - Kolom: id, request_id, technician_id, assignment_type (PRIMARY/ADDITIONAL), status, assigned_by_user_id, reason, timestamps.
   - Index untuk query efisien pada request_id, technician_id, dan status.

2. **Worker API (`worker/index.ts`)**:
   - Menambahkan rute `GET /api/users/technicians` untuk ADMIN mengambil daftar teknisi aktif.
   - Menambahkan rute `POST /api/requests/:id/assign-additional` untuk ADMIN menugaskan teknisi tambahan.
   - Validasi: hanya ADMIN, request status harus NEED_HELP, teknisi harus valid dan aktif, teknisi belum ditugaskan sebelumnya.
   - Assignment type diset sebagai ADDITIONAL dengan status ACTIVE.

3. **Frontend (`src/App.tsx`)**:
   - Menambahkan type `Technician` untuk data teknisi.
   - Menambahkan state: techniciansList, showAddTechnicianForm, selectedTechnicianId, additionalTechnicianReason.
   - Menambahkan fungsi `loadTechnicians()` untuk mengambil daftar teknisi saat ADMIN login.
   - Menambahkan fungsi `handleAssignAdditionalTechnician()` untuk mengirim request penugasan tambahan.
   - Menambahkan UI panel "TEKNISI MEMBUTUHKAN BANTUAN" yang hanya muncul jika status laporan NEED_HELP.
   - Panel berisi tombol "+ Tambah Teknisi Tambahan" dan form untuk memilih teknisi serta alasan penugasan.

4. **Testing (`tests/unit/additional-technician.test.ts`)**:
   - Membuat unit test suite untuk validasi penugasan teknisi tambahan.
   - Test mencakup: validasi technician_id, validasi status NEED_HELP, pencegahan duplikasi teknisi.

## Test
* [x] Test dijalankan (23 test passed, 6 file)
* [x] Build berhasil (`tsc -b && vite build`)
* [x] Dicoba di browser

## Penggunaan AI
* **Skill yang digunakan:** `10-implementation`
* **Kesalahan AI yang ditemukan:** Tidak ada kesalahan fatal. Implementasi mengikuti desain database dan API yang sudah ditentukan.
* **Perbaikan manusia:** UI ditambahkan secara kondisional hanya untuk status NEED_HELP sesuai acceptance criteria.

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** *(Menunggu review dan merge)*
