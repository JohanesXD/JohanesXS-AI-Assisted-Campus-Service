# 11 Code Review: FR-12, FR-13 & FR-14 - Advanced Admin, FM Dashboard & Room Management

## Issue
- GitHub Issues: #12, #13, #14
- Requirements: FR-038, FR-039, FR-040, FR-024 s/d FR-029, FR-030, FR-042, FR-043
- User Story: US-017, US-012, US-013, US-020, US-014
- Acceptance Criteria: AC-024, AC-025, AC-026, AC-027, AC-028

---

## 1. Kesesuaian Acceptance Criteria

| ID AC | AC Deskripsi | Status | Hasil Review Kode |
| :--- | :--- | :---: | :--- |
| **AC-024** | Admin dapat menggabungkan laporan duplikat ke laporan utama. | ✅ Lulus | Endpoint `POST /api/admin/requests/:id/merge` memvalidasi status laporan, memperbarui `status = 'MERGED'`, mengeset `duplicate_of_id`, serta menulis komentar silang secara atomik. |
| **AC-025** | Penggantian teknisi memerlukan persetujuan teknisi lama & baru. | ✅ Lulus | Menggunakan status `REPLACEMENT_PENDING` di `request_assignments`. Logika *dual-approval* di `/reassign/approve` memastikan status berubah menjadi `ACTIVE` hanya ketika kedua timestamp (`old_technician_approved_at` dan `new_technician_approved_at`) bernilai non-null. |
| **AC-026** | Filter dashboard analitis dan ekspor data ke file CSV. | ✅ Lulus | Endpoint `GET /api/reports/summary.csv` memproses parameter filter pencarian (kategori, ruangan, tanggal) dan menghasilkan *stream* string format CSV yang valid secara dinamis. |
| **AC-027** | Catatan tindak lanjut dengan alasan wajib minimal 5 karakter. | ✅ Lulus | Endpoint `POST /api/reports/:id/follow-up` memvalidasi panjang input `reason` (melemparkan status HTTP 422 jika < 5 karakter) sebelum menyimpan catatan ke tabel `facility_manager_notes`. |
| **AC-028** | FM dapat menambahkan ruangan baru (gedung, lantai, nama). | ✅ Lulus | Endpoint `POST /api/rooms` memvalidasi kelengkapan data input serta keunikan ruangan (menolak kombinasi gedung, lantai, dan nama ruangan yang sama). |

---

## 2. Temuan & Prioritas Kualitas Kode

### [Low] Temuan 1: Variabel Tidak Terpakai (Unused Locals)
* **Lokasi**: `src/App.tsx`
* **Dampak**: Menyebabkan kegagalan kompilasi perintah `npm run build` karena konfigurasi TypeScript ketat (`noUnusedLocals`).
* **Status**: **SUDAH DIPERBAIKI**. Variabel-variabel seperti `adminEditError`, `mergeError`, dan `reassignError` telah dihapus dari kode, dan destructuring `asgnId` diabaikan menggunakan placeholder `,`.

### [Low] Temuan 2: Typings Pelengkap `ServiceRequest`
* **Lokasi**: `src/App.tsx`
* **Dampak**: Properti tambahan seperti `category_id`, `room_id`, `technician_name`, dan `pending_reassignment` memicu error typecheck karena tidak tercantum dalam deklarasi objek `ServiceRequest`.
* **Status**: **SUDAH DIPERBAIKI**. Properti tersebut telah didefinisikan secara opsional pada type definition di baris 5-27.

### [Medium] Temuan 3: Konflik Urutan Jalur Router (*Route Priority*)
* **Lokasi**: `worker/index.ts`
* **Dampak**: Endpoint `POST /api/requests/:id/reassign/approve` sempat terblokir/terhijack oleh router generik `POST /api/requests` di atasnya sehingga mengembalikan error 403.
* **Status**: **SUDAH DIPERBAIKI**. Penangan jalur `/reassign/approve` telah digeser ke bagian atas router (sebelum pengecekan generik `url.pathname.startsWith("/api/requests")`).

---

## 3. Cakupan Pengujian (Test Coverage)
* Seluruh endpoint dan alur kerja baru telah diuji menggunakan mock database D1 yang handal di [admin-advanced.test.ts](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/tests/unit/admin-advanced.test.ts) dan [facility-manager.test.ts](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/tests/unit/facility-manager.test.ts).
* Seluruh 15 file test suite berjalan lancar dengan hasil **107/107 passed**.

---

## 4. Rekomendasi
* Menyetujui merge pull request untuk cabang fitur FR-12, FR-13, dan FR-14 karena seluruh acceptance criteria telah terpenuhi, tidak ada risiko regresi, dan status build produksi sukses.

---

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** **APPROVED (SIAP MERGE)**
