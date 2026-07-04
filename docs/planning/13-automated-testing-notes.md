# 13 Automated Testing Notes: Campus Service Request and Maintenance System

## 1. Pendahuluan
Dokumen ini mendokumentasikan implementasi pengujian otomatis (*automated testing*) untuk sistem **Campus Service Request and Maintenance System**. Pengujian otomatis dirancang untuk memverifikasi kebenaran API Workers, transisi status laporan, pengiriman notifikasi, fungsionalitas admin advanced, dasbor manajer fasilitas, dan modul penunjang lainnya.

---

## 2. Framework Pengujian
* **Framework**: **Vitest** (v4.1.9)
* **Konfigurasi**: Ditentukan dalam file `package.json` di bawah skrip `"test": "vitest run"`.
* **Strategi Basis Data**: Kueri Cloudflare D1 Database di-*mock* menggunakan `vi.fn()` yang mereplikasi fungsi SQLite. Ini memungkinkan verifikasi transaksi data secara deterministik tanpa bergantung pada server database eksternal.

---

## 3. Berkas Pengujian yang Diimplementasikan

Berikut adalah daftar berkas pengujian otomatis yang ada pada repositori, lengkap dengan fokus cakupannya:

| File Pengujian | Jumlah Test Case | Fokus Pengujian | ID Requirement Terkait |
| :--- | :---: | :--- | :--- |
| `tests/unit/auth-validation.test.ts` | 4 | Validasi email kampus (`.ac.id`, `campus.ac.id`) | FR-001 |
| `tests/unit/request-validation.test.ts` | 4 | Validasi deskripsi dan data saat pembuatan laporan | FR-002, FR-003 |
| `tests/unit/admin-action.test.ts` | 4 | Alur pemeriksaan dan penolakan laporan oleh admin | FR-007, FR-008, FR-009 |
| `tests/unit/technician-assignment.test.ts` | 3 | Penugasan teknisi utama dan pemantauan tugas | FR-010, FR-011 |
| `tests/unit/technician-progress.test.ts` | 4 | Pembaruan progress dan status khusus teknisi | FR-012, FR-014 |
| `tests/unit/additional-technician.test.ts` | 6 | Kolaborasi penugasan teknisi tambahan | FR-015 |
| `tests/unit/reporter-comment.test.ts` | 4 | Pemberian komentar tambahan oleh pelapor | FR-017 |
| `tests/unit/closure-flow.test.ts` | 12 | Konfirmasi pelapor, penolakan hasil, dan auto-close | FR-018, FR-019, FR-020, FR-036 |
| `tests/unit/notifications.test.ts` | 12 | Pemicu notifikasi status dan riwayat baca | FR-022, FR-023, FR-037 |
| `tests/unit/admin-advanced.test.ts` | 5 | Fitur admin advanced (edit, merge, reassign) | FR-038, FR-039, FR-040 |
| `tests/unit/facility-manager.test.ts` | 5 | Dashboard analitis, laporan ringkas, ekspor CSV | FR-024 s/d FR-029, FR-042 |
| `tests/unit/room-management.test.ts` | 15 | Pengelolaan ruangan berdasarkan gedung & lantai | FR-030, FR-035 |
| `tests/unit/reporter-edit-cancel.test.ts` | 20 | Edit & pembatalan laporan aktif oleh pelapor | FR-031, FR-032, FR-033, FR-034 |
| `tests/unit/comments.test.ts` | 4 | Thread komentar global | FR-017 |
| `tests/unit/status-history.test.ts` | 5 | Riwayat perubahan status laporan | FR-016 |

---

## 4. Hasil Eksekusi Pengujian (Test Log)

Pengujian dijalankan secara otomatis dengan hasil sebagai berikut:

```text
> campus-maintenance@0.0.0 test
> vitest run

 RUN  v4.1.9 C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service

 ✓ tests/unit/notifications.test.ts (12 tests) 12ms
 ✓ tests/unit/technician-assignment.test.ts (3 tests) 5ms
 ✓ tests/unit/reporter-edit-cancel.test.ts (20 tests) 10ms
 ✓ tests/unit/status-history.test.ts (5 tests) 6ms
 ✓ tests/unit/technician-progress.test.ts (4 tests) 7ms
 ✓ tests/unit/reporter-comment.test.ts (4 tests) 7ms
 ✓ tests/unit/closure-flow.test.ts (12 tests) 10ms
 ✓ tests/unit/additional-technician.test.ts (6 tests) 7ms
 ✓ tests/unit/facility-manager.test.ts (5 tests) 49ms
 ✓ tests/unit/auth-validation.test.ts (4 tests) 7ms
 ✓ tests/unit/comments.test.ts (4 tests) 7ms
 ✓ tests/unit/admin-advanced.test.ts (5 tests) 55ms
 ✓ tests/unit/request-validation.test.ts (4 tests) 7ms
 ✓ tests/unit/admin-action.test.ts (4 tests) 7ms
 ✓ tests/unit/room-management.test.ts (15 tests) 69ms

 Test Files  15 passed (15)
      Tests  107 passed (107)
   Start at  16:02:14
   Duration  537ms (transform 919ms, setup 0ms, import 1.50s, tests 264ms, environment 2ms)
```

---

## 5. Asumsi Pengujian (Test Assumptions)
* `[ASUMSI]` Basis data SQLite D1 yang di-*mock* mereplikasi perilaku database SQLite Cloudflare secara presisi (termasuk tipe kembalian kosong, baris terpengaruh, dan penanganan nilai NULL).
* `[ASUMSI]` Waktu UTC yang diperoleh dari objek `Date` di lingkungan pengujian sinkron dengan zona waktu basis data pada Workers.

---

## Reviewer
* **Nama:** JohanesXD
* **Keputusan:** **APPROVED (LULUS PENGUJIAN OTOMATIS)**
