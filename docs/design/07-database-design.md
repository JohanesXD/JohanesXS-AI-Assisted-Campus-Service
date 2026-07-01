# 07 Database Design

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `docs/requirements/03-requirement-specification.md`
- `docs/design/06-architecture-design.md`
- `docs/requirements/05-change-impact-analysis.md`
- `database/migrations/0001_initial.sql`

## Status Database di Repo Saat Ini
Repo sudah memiliki database migration awal:

- `database/migrations/0001_initial.sql`

Migration tersebut berisi satu tabel:

| Tabel Saat Ini | Status | Catatan |
| --- | --- | --- |
| `service_requests` | Ada | Mendukung pembuatan dan daftar laporan dasar, tetapi belum cukup untuk role, ruangan terstruktur, kategori, assignment teknisi, status history, komentar, notifikasi, audit trail, dashboard lengkap, dan export CSV. |

## Catatan Desain
Desain ini adalah rancangan target berdasarkan requirement dan arsitektur. Implementasi dapat dilakukan bertahap melalui migration baru agar tidak merusak database awal.

ASUMSI: Autentikasi akun kampus pada versi awal memakai tabel `users` dan role internal sampai integrasi akun kampus nyata ditentukan.

ASUMSI: Foto kerusakan dan foto hasil pekerjaan disimpan sebagai URL opsional, bukan file binary.

ASUMSI: Semua timestamp disimpan sebagai `TEXT` ISO-8601 agar sederhana digunakan di Cloudflare D1.

## Ringkasan Tabel Target

| Tabel | Tujuan | Requirement Terkait |
| --- | --- | --- |
| `users` | Menyimpan pengguna dan role. | FR-001, NFR-001, NFR-003 |
| `categories` | Menyimpan kategori masalah fasilitas. | FR-005 |
| `rooms` | Menyimpan daftar ruangan berdasarkan gedung dan lantai. | FR-006, FR-030, FR-035 |
| `service_requests` | Menyimpan data utama laporan. | FR-002, FR-003, FR-004, FR-016 |
| `request_status_history` | Menyimpan riwayat status laporan. | FR-012, FR-014, FR-018 sampai FR-021, FR-036, NFR-004 |
| `request_comments` | Menyimpan komentar pelapor dan catatan umum. | FR-017 |
| `request_assignments` | Menyimpan teknisi utama/tambahan dan riwayat assignment. | FR-010, FR-011, FR-015, FR-040 |
| `technician_progress` | Menyimpan update progress teknisi, estimasi, dan URL foto hasil pekerjaan. | FR-012, FR-014, FR-041 |
| `notifications` | Menyimpan notifikasi aplikasi dan status dibaca. | FR-022, FR-023, FR-037 |
| `audit_logs` | Menyimpan jejak aksi penting dan alasan. | FR-009, FR-013, FR-031 sampai FR-034, FR-038 sampai FR-040, FR-043, NFR-004 |
| `request_duplicates` | Menyimpan relasi laporan duplikat dengan laporan utama. | FR-039 |
| `manager_follow_up_notes` | Menyimpan catatan tindak lanjut Manajer Fasilitas. | FR-043 |

## Enumerasi Nilai

### Role Pengguna
| Nilai | Keterangan |
| --- | --- |
| `REPORTER` | Mahasiswa atau dosen sebagai pelapor. |
| `ADMIN` | Administrator. |
| `TECHNICIAN` | Teknisi. |
| `FACILITY_MANAGER` | Manajer Fasilitas. |

### Status Laporan
| Nilai | Keterangan |
| --- | --- |
| `SUBMITTED` | Laporan baru dikirim. |
| `UNDER_REVIEW` | Laporan sedang diperiksa administrator. |
| `REJECTED` | Laporan ditolak karena tidak valid. |
| `ASSIGNED` | Laporan valid dan sudah ditugaskan. |
| `IN_PROGRESS` | Teknisi sedang menangani laporan. |
| `NEED_HELP` | Teknisi membutuhkan bantuan. |
| `WAITING_PARTS` | Pekerjaan menunggu suku cadang. |
| `PAUSED` | Pekerjaan terjeda. |
| `RESOLVED` | Teknisi menyatakan pekerjaan selesai. |
| `WAITING_REPORTER_CONFIRMATION` | Sistem menunggu konfirmasi pelapor. |
| `REOPEN_REQUESTED` | Pelapor menolak hasil pekerjaan dan meminta pembukaan ulang. |
| `REOPENED` | Administrator membuka ulang laporan. |
| `CANCELLED` | Pelapor membatalkan laporan dengan alasan. |
| `CLOSED_AUTO` | Laporan ditutup otomatis setelah 45 menit tanpa konfirmasi. |
| `CLOSED_ADMIN` | Laporan ditutup administrator. |
| `CLOSED_REPORTER_CONFIRMED` | Laporan ditutup setelah pelapor mengonfirmasi selesai. |

### Urgensi
| Nilai | Keterangan |
| --- | --- |
| `LOW` | Dampak rendah. |
| `MEDIUM` | Dampak sedang. |
| `HIGH` | Dampak tinggi. |
| `URGENT` | Perlu perhatian cepat. |

## Detail Tabel

### `users`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID pengguna. |
| `campus_account_id` | TEXT | UNIQUE | Ya | Identitas akun kampus atau simulasi akun kampus. |
| `name` | TEXT |  | Ya | Nama pengguna. |
| `email` | TEXT | UNIQUE | Ya | Email kampus atau email pengguna. |
| `role` | TEXT |  | Ya | `REPORTER`, `ADMIN`, `TECHNICIAN`, atau `FACILITY_MANAGER`. |
| `is_active` | INTEGER |  | Ya | `1` aktif, `0` tidak aktif. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |
| `updated_at` | TEXT |  | Ya | Waktu diperbarui. |

### `categories`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID kategori. |
| `name` | TEXT | UNIQUE | Ya | Nama kategori, misalnya Internet, AC, Proyektor. |
| `is_active` | INTEGER |  | Ya | Status aktif. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |

### `rooms`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID ruangan. |
| `building` | TEXT |  | Ya | Nama gedung. |
| `floor` | TEXT |  | Ya | Lantai. |
| `room_name` | TEXT |  | Ya | Nama atau nomor ruangan. |
| `is_active` | INTEGER |  | Ya | Status aktif. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |
| `updated_at` | TEXT |  | Ya | Waktu diperbarui. |

Index yang disarankan:
- `idx_rooms_building_floor` pada `building`, `floor`.
- UNIQUE `building`, `floor`, `room_name`.

### `service_requests`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID laporan. |
| `request_number` | TEXT | UNIQUE | Ya | Nomor laporan, misalnya `CSR-...`. |
| `reporter_id` | TEXT | FK `users.id` | Ya | Pelapor. |
| `title` | TEXT |  | Ya | Judul masalah. |
| `description` | TEXT |  | Ya | Deskripsi masalah. |
| `category_id` | TEXT | FK `categories.id` | Ya | Kategori masalah. |
| `room_id` | TEXT | FK `rooms.id` | Ya | Lokasi ruangan. |
| `urgency` | TEXT |  | Ya | `LOW`, `MEDIUM`, `HIGH`, `URGENT`. |
| `status` | TEXT |  | Ya | Status laporan saat ini. |
| `damage_photo_url` | TEXT |  | Tidak | URL foto kerusakan opsional. |
| `rejection_reason` | TEXT |  | Tidak | Alasan penolakan laporan. |
| `cancel_reason` | TEXT |  | Tidak | Alasan pembatalan pelapor. |
| `resolution_rejected_reason` | TEXT |  | Tidak | Alasan pelapor menolak hasil pekerjaan. |
| `resolved_at` | TEXT |  | Tidak | Waktu teknisi menyatakan selesai. |
| `confirmation_due_at` | TEXT |  | Tidak | Batas 45 menit konfirmasi pelapor. |
| `closed_at` | TEXT |  | Tidak | Waktu laporan ditutup. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |
| `updated_at` | TEXT |  | Ya | Waktu diperbarui. |

Index yang disarankan:
- `idx_service_requests_status`
- `idx_service_requests_reporter_id`
- `idx_service_requests_room_id`
- `idx_service_requests_category_id`
- `idx_service_requests_created_at`

### `request_status_history`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID riwayat. |
| `request_id` | TEXT | FK `service_requests.id` | Ya | Laporan terkait. |
| `from_status` | TEXT |  | Tidak | Status sebelumnya. |
| `to_status` | TEXT |  | Ya | Status baru. |
| `changed_by_user_id` | TEXT | FK `users.id` | Tidak | Aktor perubahan. |
| `reason` | TEXT |  | Tidak | Alasan perubahan jika ada. |
| `created_at` | TEXT |  | Ya | Waktu perubahan. |

### `request_comments`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID komentar. |
| `request_id` | TEXT | FK `service_requests.id` | Ya | Laporan terkait. |
| `author_id` | TEXT | FK `users.id` | Ya | Pembuat komentar. |
| `comment` | TEXT |  | Ya | Isi komentar. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |

### `request_assignments`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID assignment. |
| `request_id` | TEXT | FK `service_requests.id` | Ya | Laporan terkait. |
| `technician_id` | TEXT | FK `users.id` | Ya | Teknisi. |
| `assignment_type` | TEXT |  | Ya | `PRIMARY` atau `ADDITIONAL`. |
| `status` | TEXT |  | Ya | `ACTIVE`, `REPLACEMENT_PENDING`, `REPLACED`, `DECLINED`. |
| `assigned_by_user_id` | TEXT | FK `users.id` | Ya | Administrator yang menugaskan. |
| `old_technician_approved_at` | TEXT |  | Tidak | Persetujuan teknisi lama. |
| `new_technician_approved_at` | TEXT |  | Tidak | Persetujuan teknisi baru. |
| `reason` | TEXT |  | Tidak | Alasan assignment atau penggantian. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |
| `updated_at` | TEXT |  | Ya | Waktu diperbarui. |

### `technician_progress`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID progress. |
| `request_id` | TEXT | FK `service_requests.id` | Ya | Laporan terkait. |
| `technician_id` | TEXT | FK `users.id` | Ya | Teknisi pembuat update. |
| `status` | TEXT |  | Ya | Status pekerjaan. |
| `note` | TEXT |  | Ya | Catatan progress. |
| `estimated_completion_at` | TEXT |  | Tidak | Estimasi selesai. |
| `result_photo_url` | TEXT |  | Tidak | URL foto hasil pekerjaan opsional. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |

### `notifications`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID notifikasi. |
| `recipient_id` | TEXT | FK `users.id` | Ya | Penerima. |
| `request_id` | TEXT | FK `service_requests.id` | Tidak | Laporan terkait. |
| `type` | TEXT |  | Ya | Jenis notifikasi. |
| `message` | TEXT |  | Ya | Isi notifikasi. |
| `read_at` | TEXT |  | Tidak | Waktu dibaca. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |

### `audit_logs`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID audit. |
| `request_id` | TEXT | FK `service_requests.id` | Tidak | Laporan terkait. |
| `actor_id` | TEXT | FK `users.id` | Tidak | Aktor aksi. |
| `action` | TEXT |  | Ya | Nama aksi. |
| `reason` | TEXT |  | Tidak | Alasan aksi. |
| `before_value` | TEXT |  | Tidak | Data sebelum, JSON string. |
| `after_value` | TEXT |  | Tidak | Data sesudah, JSON string. |
| `created_at` | TEXT |  | Ya | Waktu aksi. |

### `request_duplicates`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID relasi duplikat. |
| `primary_request_id` | TEXT | FK `service_requests.id` | Ya | Laporan utama. |
| `duplicate_request_id` | TEXT | FK `service_requests.id` | Ya | Laporan duplikat. |
| `merged_by_user_id` | TEXT | FK `users.id` | Ya | Administrator. |
| `reason` | TEXT |  | Tidak | Alasan penggabungan. |
| `created_at` | TEXT |  | Ya | Waktu penggabungan. |

### `manager_follow_up_notes`
| Kolom | Tipe | Key | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `id` | TEXT | PK | Ya | ID catatan. |
| `request_id` | TEXT | FK `service_requests.id` | Tidak | Laporan terkait jika catatan spesifik laporan. |
| `manager_id` | TEXT | FK `users.id` | Ya | Manajer Fasilitas. |
| `note` | TEXT |  | Ya | Catatan tindak lanjut. |
| `reason` | TEXT |  | Ya | Alasan catatan. |
| `created_at` | TEXT |  | Ya | Waktu dibuat. |

## Relasi Utama
1. Satu `users` dengan role `REPORTER` dapat memiliki banyak `service_requests`.
2. Satu `service_requests` memiliki satu `categories` dan satu `rooms`.
3. Satu `service_requests` dapat memiliki banyak `request_status_history`.
4. Satu `service_requests` dapat memiliki banyak `request_comments`.
5. Satu `service_requests` dapat memiliki banyak `request_assignments`.
6. Satu `service_requests` dapat memiliki banyak `technician_progress`.
7. Satu `service_requests` dapat memiliki banyak `notifications`.
8. Satu `service_requests` dapat memiliki banyak `audit_logs`.
9. Satu `service_requests` dapat digabungkan sebagai duplikat melalui `request_duplicates`.
10. Satu `service_requests` dapat memiliki catatan tindak lanjut Manajer Fasilitas.

## Rencana Migration Bertahap

| Migration | Isi | Tujuan |
| --- | --- | --- |
| `0001_initial.sql` | Tabel `service_requests` dasar. | Sudah ada di repo untuk tutorial awal. |
| `0002_core_reference.sql` | `users`, `categories`, `rooms`. | Menambahkan role, kategori, dan lokasi terstruktur. |
| `0003_requests_expand.sql` | Perluasan `service_requests`. | Menambahkan reporter, kategori ID, room ID, urgency, URL foto, dan field lifecycle. |
| `0004_workflow.sql` | `request_status_history`, `request_assignments`, `technician_progress`, `request_duplicates`. | Mendukung lifecycle dan teknisi. |
| `0005_interaction_and_audit.sql` | `request_comments`, `notifications`, `audit_logs`, `manager_follow_up_notes`. | Mendukung komentar, notifikasi, audit, dan catatan tindak lanjut. |

## Traceability Database

| Requirement | Tabel Terkait |
| --- | --- |
| FR-001, NFR-001, NFR-003 | `users` |
| FR-002 sampai FR-006 | `service_requests`, `categories`, `rooms` |
| FR-007 sampai FR-009 | `service_requests`, `request_status_history`, `audit_logs` |
| FR-010, FR-011, FR-015, FR-040 | `request_assignments`, `users`, `audit_logs` |
| FR-012 sampai FR-014, FR-041 | `technician_progress`, `request_status_history`, `service_requests` |
| FR-016 sampai FR-021, FR-031 sampai FR-036 | `service_requests`, `request_status_history`, `request_comments`, `audit_logs` |
| FR-022, FR-023, FR-037 | `notifications` |
| FR-024 sampai FR-029, FR-042 | `service_requests`, `categories`, `rooms` |
| FR-030, FR-035 | `rooms` |
| FR-038, FR-039 | `service_requests`, `request_duplicates`, `audit_logs` |
| FR-043 | `manager_follow_up_notes` |
| NFR-004 | `request_status_history`, `audit_logs` |

## Quality Check
- Setiap tabel memiliki tujuan.
- Relasi antar tabel jelas.
- Desain mendukung status lifecycle dan audit trail.
- Desain tidak menyimpan file foto binary.
- Desain mendukung export CSV tanpa tabel tambahan.

## Human Review
Manusia perlu memeriksa:
1. Apakah tabel target sudah cukup untuk kebutuhan proyek.
2. Apakah migration bertahap dapat diterima.
3. Apakah penggunaan URL untuk foto sudah cukup di sisi database.
4. Apakah status laporan dan role pengguna sudah sesuai.
5. Apakah desain ini terlalu besar untuk versi awal dan perlu dipilah lagi untuk implementasi MVP.
