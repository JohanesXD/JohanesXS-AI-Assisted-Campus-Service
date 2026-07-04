# 11 Implementation Notes: FR-10 - Notifikasi Aplikasi dan Riwayat Baca Notifikasi

## Issue
Closes #10

## Requirement
FR-022: Sistem harus mengirim notifikasi melalui aplikasi saat status laporan berubah pada kondisi yang ditentukan.
FR-023: Sistem harus mengirim notifikasi aplikasi saat masalah sudah ditangani, membutuhkan suku cadang baru, teknisi butuh bantuan, dan pekerjaan terjeda.
FR-037: Sistem harus menyediakan riwayat notifikasi dan status notifikasi sudah dibaca.

## Acceptance Criteria
- AC-020: Setiap perubahan status yang memicu notifikasi akan dicatat ke dalam database notifikasi penerima.
- AC-021: Pengguna memiliki panel notifikasi untuk melihat daftar notifikasi dan menandai notifikasi sebagai sudah dibaca (read_at terisi).

## Perubahan
1. **Database Migration (`database/migrations/0009_notifications.sql`)**:
   - Tabel `notifications` dengan kolom: id, user_id, type, title, message, request_id, is_read, read_at, created_at.
   - Index untuk query unread count dan notifikasi per user.

2. **Worker API (`worker/index.ts`)**:
   - **Helper `createNotification(env, userId, type, title, message, requestId)`** — insert notifikasi ke database.
   - **Helper `notifyStatusChange(env, requestId, newStatus, changedByUserId)`** — menentukan penerima berdasarkan tipe perubahan status dan membuat notifikasi untuk setiap penerima.
     - `SUBMITTED` → semua admin
     - `REJECTED` → pelapor
     - `ASSIGNED` → teknisi yang ditugaskan
     - `IN_PROGRESS` → pelapor
     - `NEED_HELP` → semua admin
     - `WAITING_PARTS` → pelapor
     - `PAUSED` → pelapor
     - `WAITING_REPORTER_CONFIRMATION` → pelapor
     - `CLOSED_REPORTER_CONFIRMED` → semua admin
     - `CLOSED_AUTO` → pelapor
     - `CLOSED_ADMIN` → pelapor
     - `REOPEN_REQUESTED` → semua admin
     - `REOPENED` → pelapor dan teknisi
     - `CANCELLED` → semua admin
   - **Trigger `notifyStatusChange`** dipanggil setelah setiap `recordStatusHistory` pada endpoint: autoClose, reject, resolve, confirm-resolution, reject-resolution, close, reopen, dan create request.
   - **GET `/api/notifications`** — ambil 50 notifikasi terbaru milik user saat ini + `unread_count`.
   - **POST `/api/notifications/:id/read`** — tandai satu notifikasi sebagai dibaca (validasi kepemilikan).
   - **POST `/api/notifications/read-all`** — tandai semua notifikasi user sebagai dibaca.

3. **Frontend (`src/App.tsx`)**:
   - Tipe `NotificationItem`.
   - State: `notifications`, `unreadCount`, `showNotifications`.
   - `fetchNotifications()` dipanggil saat login dan setiap 30 detik (polling).
   - `handleMarkAsRead(notifId)` — tandai satu notifikasi.
   - `handleMarkAllAsRead()` — tandai semua.
   - Icon bell di header dengan badge jumlah unread.
   - Dropdown panel notifikasi: daftar notifikasi, tombol "Tandai semua dibaca", klik notifikasi akan tandai baca + navigasi ke detail laporan.

4. **Testing (`tests/unit/notifications.test.ts`)**:
   - `notifications.test.ts` — 11 test: create, query by user, sorting, unread count, mark as read, mark all as read, recipient determination.

## Test
- [x] Test dijalankan (61 test pass, 11 file)
- [x] Build berhasil
- [ ] Dicoba di browser

## Penggunaan AI
Skill yang digunakan: 10-implementation
Kesalahan AI yang ditemukan: -
Perbaikan manusia: -

## Reviewer
Nama:
Keputusan:
