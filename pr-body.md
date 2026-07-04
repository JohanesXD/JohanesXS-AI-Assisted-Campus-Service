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
- Migration 0009: tabel notifications
- Worker: GET /api/notifications, POST /api/notifications/:id/read, helper createNotification, trigger pada setiap perubahan status
- Frontend: icon bell dengan badge di header, dropdown notifikasi, tombol mark-as-read
- Tests: 12 test baru (notification creation, read flow, recipient determination)

## Test
- [ ] Test dijalankan
- [ ] Build berhasil
- [ ] Dicoba di browser

## Penggunaan AI
Skill yang digunakan: 10-implementation
Kesalahan AI yang ditemukan: -
Perbaikan manusia: -

## Reviewer
Nama:
Keputusan:
