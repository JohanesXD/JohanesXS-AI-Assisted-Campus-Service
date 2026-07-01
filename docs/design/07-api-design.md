# 07 API Design

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `docs/requirements/03-requirement-specification.md`
- `docs/design/06-architecture-design.md`
- `docs/design/07-database-design.md`
- `worker/index.ts`

## Status API di Repo Saat Ini
Repo sudah memiliki Worker API dasar di:

- `worker/index.ts`

Endpoint yang sudah ada:

| Method | Path | Status | Catatan |
| --- | --- | --- | --- |
| GET | `/api/health` | Ada | Mengecek status API. |
| GET | `/api/requests` | Ada | Mengambil daftar laporan dasar dari tabel `service_requests`. |
| POST | `/api/requests` | Ada | Membuat laporan dasar dengan title, description, location, dan category. |

API saat ini cukup untuk tutorial awal, tetapi belum mencakup role, detail laporan, pemeriksaan admin, assignment teknisi, lifecycle status, notifikasi, audit trail, dashboard, export CSV, dan catatan tindak lanjut.

## Catatan Desain
Desain ini adalah target endpoint API. Implementasi dapat dilakukan bertahap berdasarkan prioritas requirement.

ASUMSI: Pada versi awal, role pengguna dapat dikirim melalui session internal, token sederhana, atau header simulasi selama belum ada integrasi akun kampus nyata. Implementasi final tetap harus membatasi akses berdasarkan role.

ASUMSI: Semua response error memakai format `{ "error": "pesan error" }`.

## Format Response Umum

### Sukses
```json
{
  "data": {}
}
```

### Error
```json
{
  "error": "Pesan error."
}
```

## Auth dan User API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | Publik | Login atau simulasi login akun kampus. | FR-001 |
| GET | `/api/me` | Semua role | Mengambil profil pengguna login. | FR-001, NFR-003 |
| GET | `/api/users/technicians` | ADMIN | Mengambil daftar teknisi aktif. | FR-010, FR-040 |

### POST `/api/auth/login`
Request:
```json
{
  "campusAccountId": "student001",
  "role": "REPORTER"
}
```

Response:
```json
{
  "data": {
    "id": "user-id",
    "name": "Nama Pengguna",
    "role": "REPORTER"
  }
}
```

## Request Management API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/api/requests` | Semua role | Mengambil daftar laporan sesuai role dan filter. | FR-016, FR-027 |
| POST | `/api/requests` | REPORTER | Membuat laporan baru. | FR-002 sampai FR-006 |
| GET | `/api/requests/:id` | Role terkait | Melihat detail laporan. | FR-011, FR-016 |
| PATCH | `/api/requests/:id` | REPORTER | Mengubah laporan dengan alasan. | FR-031, FR-032 |
| POST | `/api/requests/:id/cancel` | REPORTER | Membatalkan laporan dengan alasan. | FR-034 |
| POST | `/api/requests/:id/comments` | REPORTER | Menambahkan komentar. | FR-017 |

### GET `/api/requests`
Query:
- `status`
- `categoryId`
- `roomId`
- `sort=latest|oldest`
- `q`

Response:
```json
{
  "data": [
    {
      "id": "request-id",
      "requestNumber": "CSR-001",
      "title": "AC tidak dingin",
      "category": "AC",
      "room": "Gedung A Lantai 2 Ruang 201",
      "urgency": "MEDIUM",
      "status": "SUBMITTED",
      "createdAt": "2026-07-01T00:00:00Z"
    }
  ]
}
```

### POST `/api/requests`
Request:
```json
{
  "title": "AC tidak dingin",
  "description": "AC di ruangan tidak dingin sejak pagi.",
  "categoryId": "category-id",
  "roomId": "room-id",
  "urgency": "MEDIUM",
  "damagePhotoUrl": "https://example.com/photo.jpg"
}
```

Response:
```json
{
  "data": {
    "id": "request-id",
    "requestNumber": "CSR-001",
    "status": "SUBMITTED"
  }
}
```

Aturan:
1. `title`, `description`, `categoryId`, `roomId`, dan `urgency` wajib.
2. `damagePhotoUrl` opsional.
3. Status awal adalah `SUBMITTED`.
4. Sistem membuat status history dan audit log.

## Admin Review API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| POST | `/api/admin/requests/:id/start-review` | ADMIN | Memulai pemeriksaan laporan. | FR-007 |
| POST | `/api/admin/requests/:id/reject` | ADMIN | Menolak laporan tidak valid dengan alasan. | FR-008, FR-009 |
| PATCH | `/api/admin/requests/:id` | ADMIN | Mengedit kategori, lokasi, atau deskripsi dengan alasan. | FR-038 |
| POST | `/api/admin/requests/:id/approve` | ADMIN | Menyatakan laporan valid sebelum assignment. | FR-007, FR-010 |
| POST | `/api/admin/requests/:id/close` | ADMIN | Menutup laporan. | FR-021, FR-033 |
| POST | `/api/admin/requests/:id/reopen` | ADMIN | Membuka ulang laporan. | FR-036 |
| POST | `/api/admin/requests/:id/merge` | ADMIN | Menggabungkan laporan duplikat. | FR-039 |

### POST `/api/admin/requests/:id/reject`
Request:
```json
{
  "reason": "Lokasi tidak sesuai dan deskripsi tidak jelas."
}
```

Response:
```json
{
  "data": {
    "id": "request-id",
    "status": "REJECTED"
  }
}
```

Aturan:
1. `reason` wajib.
2. Sistem menyimpan status history dan audit log.
3. Sistem membuat notifikasi untuk pelapor.

## Assignment API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| POST | `/api/admin/requests/:id/assignments` | ADMIN | Menugaskan teknisi utama atau tambahan. | FR-010, FR-011, FR-015 |
| POST | `/api/admin/requests/:id/technician-replacement` | ADMIN | Mengajukan penggantian teknisi. | FR-040 |
| POST | `/api/assignments/:id/approve-replacement` | TECHNICIAN | Menyetujui penggantian teknisi. | FR-040 |
| POST | `/api/assignments/:id/decline-replacement` | TECHNICIAN | Menolak penggantian teknisi. | FR-040 |

### POST `/api/admin/requests/:id/assignments`
Request:
```json
{
  "technicianId": "technician-id",
  "assignmentType": "PRIMARY",
  "reason": "Teknisi sesuai bidang AC."
}
```

Response:
```json
{
  "data": {
    "assignmentId": "assignment-id",
    "requestId": "request-id",
    "status": "ASSIGNED"
  }
}
```

Aturan:
1. Hanya ADMIN yang dapat menugaskan.
2. Assignment utama membuat status laporan menjadi `ASSIGNED`.
3. Assignment tambahan hanya digunakan setelah status `NEED_HELP` dan disetujui admin.

## Technician Work API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/api/technician/requests` | TECHNICIAN | Mengambil tugas teknisi. | FR-011 |
| POST | `/api/requests/:id/progress` | TECHNICIAN, ADMIN | Menambahkan progress pekerjaan. | FR-012, FR-013, FR-014, FR-041 |
| POST | `/api/requests/:id/resolve` | TECHNICIAN | Menandai pekerjaan selesai. | FR-018, FR-019 |

### POST `/api/requests/:id/progress`
Request:
```json
{
  "status": "IN_PROGRESS",
  "note": "Pemeriksaan awal sudah dilakukan.",
  "estimatedCompletionAt": "2026-07-01T09:30:00Z",
  "resultPhotoUrl": "https://example.com/result.jpg"
}
```

Response:
```json
{
  "data": {
    "progressId": "progress-id",
    "requestId": "request-id",
    "status": "IN_PROGRESS"
  }
}
```

Aturan:
1. Teknisi hanya dapat memperbarui laporan yang ditugaskan kepadanya.
2. ADMIN dapat memperbarui progress dengan catatan alasan.
3. `resultPhotoUrl` opsional dan hanya URL.
4. Perubahan status penting membuat notifikasi.

## Reporter Confirmation API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| POST | `/api/requests/:id/confirm-resolution` | REPORTER | Mengonfirmasi pekerjaan selesai. | FR-018 |
| POST | `/api/requests/:id/reject-resolution` | REPORTER | Menolak hasil pekerjaan dengan alasan. | FR-036 |

### POST `/api/requests/:id/reject-resolution`
Request:
```json
{
  "reason": "AC masih tidak dingin setelah diperbaiki."
}
```

Response:
```json
{
  "data": {
    "id": "request-id",
    "status": "REOPEN_REQUESTED"
  }
}
```

Aturan:
1. Pelapor hanya dapat menolak laporan miliknya.
2. `reason` wajib.
3. Penolakan menghentikan proses penutupan otomatis sampai administrator memutuskan.

## Notification API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/api/notifications` | Semua role | Melihat riwayat notifikasi. | FR-037 |
| POST | `/api/notifications/:id/read` | Semua role | Menandai notifikasi sebagai sudah dibaca. | FR-037 |

## Room dan Category API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/api/categories` | Semua role | Mengambil daftar kategori aktif. | FR-005 |
| GET | `/api/rooms` | Semua role | Mengambil daftar ruangan berdasarkan gedung dan lantai. | FR-006, FR-035 |
| POST | `/api/facility-manager/rooms` | FACILITY_MANAGER | Menambah ruangan baru. | FR-030 |
| PATCH | `/api/facility-manager/rooms/:id` | FACILITY_MANAGER | Memperbarui ruangan. | FR-030 |

### GET `/api/rooms`
Response:
```json
{
  "data": [
    {
      "building": "Gedung A",
      "floors": [
        {
          "floor": "2",
          "rooms": [
            {
              "id": "room-id",
              "roomName": "Ruang 201"
            }
          ]
        }
      ]
    }
  ]
}
```

## Dashboard dan Reporting API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/api/facility-manager/dashboard` | FACILITY_MANAGER | Mengambil data dashboard. | FR-024 sampai FR-027 |
| GET | `/api/facility-manager/reports/summary` | FACILITY_MANAGER | Mengambil laporan ringkas. | FR-028, FR-029 |
| GET | `/api/facility-manager/reports/summary.csv` | FACILITY_MANAGER | Mengunduh laporan ringkas CSV. | FR-042 |
| POST | `/api/facility-manager/follow-up-notes` | FACILITY_MANAGER | Membuat catatan tindak lanjut. | FR-043 |

### GET `/api/facility-manager/dashboard`
Query:
- `categoryId`
- `roomId`
- `sort=latest|oldest`

Response:
```json
{
  "data": {
    "totalResolved": 12,
    "categoryCounts": [
      {
        "category": "AC",
        "count": 5
      }
    ]
  }
}
```

### GET `/api/facility-manager/reports/summary.csv`
Response:
- Content-Type: `text/csv`
- Body berisi CSV laporan ringkas.

## Audit API

| Method | Path | Role | Tujuan | Requirement |
| --- | --- | --- | --- | --- |
| GET | `/api/requests/:id/audit-logs` | ADMIN, FACILITY_MANAGER | Melihat audit trail laporan. | NFR-004 |
| GET | `/api/requests/:id/status-history` | Role terkait | Melihat riwayat status laporan. | NFR-004, FR-016 |

## Aturan Akses Ringkas

| Role | Boleh Mengakses |
| --- | --- |
| REPORTER | Laporan miliknya, komentar, perubahan, pembatalan, konfirmasi, penolakan hasil, notifikasi miliknya. |
| ADMIN | Semua laporan operasional, review, edit, reject, assign, merge, close, reopen, audit. |
| TECHNICIAN | Tugasnya sendiri, progress, resolve, approval replacement, notifikasi miliknya. |
| FACILITY_MANAGER | Dashboard, laporan ringkas, export CSV, ruangan, catatan tindak lanjut, audit terbatas. |

## Endpoint Prioritas MVP

| Prioritas | Endpoint |
| --- | --- |
| Must | `GET /api/health` |
| Must | `POST /api/auth/login` |
| Must | `GET /api/me` |
| Must | `GET /api/requests` |
| Must | `POST /api/requests` |
| Must | `GET /api/requests/:id` |
| Must | `POST /api/admin/requests/:id/start-review` |
| Must | `POST /api/admin/requests/:id/reject` |
| Must | `POST /api/admin/requests/:id/assignments` |
| Must | `GET /api/technician/requests` |
| Must | `POST /api/requests/:id/progress` |
| Must | `POST /api/requests/:id/resolve` |
| Must | `POST /api/requests/:id/confirm-resolution` |
| Must | `POST /api/requests/:id/reject-resolution` |
| Must | `POST /api/admin/requests/:id/close` |
| Must | `GET /api/facility-manager/dashboard` |
| Must | `GET /api/facility-manager/reports/summary` |

## Traceability API

| Requirement | Endpoint Terkait |
| --- | --- |
| FR-001 | `POST /api/auth/login`, `GET /api/me` |
| FR-002 sampai FR-006 | `POST /api/requests`, `GET /api/categories`, `GET /api/rooms` |
| FR-007 sampai FR-009 | Admin review endpoints |
| FR-010, FR-011, FR-015, FR-040 | Assignment endpoints |
| FR-012 sampai FR-014, FR-041 | Technician work endpoints |
| FR-016 sampai FR-021, FR-031 sampai FR-036 | Request management and reporter confirmation endpoints |
| FR-022, FR-023, FR-037 | Notification endpoints |
| FR-024 sampai FR-029, FR-042, FR-043 | Dashboard and reporting endpoints |
| FR-030, FR-035 | Room endpoints |
| FR-038, FR-039 | Admin edit and merge endpoints |
| NFR-004 | Audit and status history endpoints |

## Quality Check
- Endpoint memiliki method dan path.
- Request dan response utama ditulis cukup rinci.
- Aturan role ditulis.
- Endpoint mendukung requirement dan arsitektur.
- Desain API tidak membuat fitur di luar scope.

## Human Review
Manusia perlu memeriksa:
1. Apakah endpoint target terlalu besar untuk versi awal.
2. Apakah endpoint MVP sudah cukup untuk mulai implementasi.
3. Apakah aturan akses setiap role sudah sesuai.
4. Apakah format CSV sudah cukup untuk laporan ringkas.
5. Apakah API existing boleh diperluas bertahap daripada diganti sekaligus.
