# 09 GitHub Issues

Dokumen ini berisi daftar GitHub Issues yang memecah seluruh *requirements* dan desain aplikasi **Campus Service Request and Maintenance System** menjadi unit pekerjaan yang terukur dan dapat diimplementasikan secara bertahap.

---

# [FR-001] Login Akun Kampus dan Kontrol Hak Akses

## Requirement
- **FR-001:** Sistem harus mengizinkan mahasiswa dan dosen login menggunakan akun kampus sebelum membuat atau memantau laporan.
- **NFR-001:** Sistem harus membatasi akses pembuatan dan pemantauan laporan kepada pelapor yang login menggunakan akun kampus.
- **NFR-003:** Sistem harus menjaga pemisahan hak akses berdasarkan peran: pelapor, administrator, teknisi, dan Manajer Fasilitas.

## User Story
- **US-001:** Sebagai mahasiswa atau dosen, saya ingin login menggunakan akun kampus agar hanya pengguna kampus yang dapat membuat dan memantau laporan.

## Acceptance Criteria
- **AC-001:** Jika mahasiswa atau dosen belum login, sistem tidak mengizinkan akses ke halaman pelaporan.
- **AC-002:** Jika pengguna berhasil login dengan akun kampus, sistem mengizinkan akses sesuai dengan role masing-masing (Pelapor, Administrator, Teknisi, atau Manajer Fasilitas).

## Pekerjaan
- [ ] Buat tampilan form login (simulasi role untuk versi awal)
- [ ] Buat API autentikasi dan validasi role
- [ ] Simpan session/token login di frontend
- [ ] Buat test otorisasi akses berdasarkan role
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-002][FR-003][FR-005][FR-006] Pembuatan Laporan Masalah Fasilitas

## Requirement
- **FR-002:** Sistem harus mengizinkan pelapor membuat laporan masalah fasilitas kampus.
- **FR-003:** Sistem harus menyimpan judul masalah, deskripsi, kategori masalah, lokasi ruangan, dan tingkat urgensi pada laporan.
- **FR-005:** Sistem harus menyediakan kategori masalah fasilitas seperti proyektor, internet, AC, kursi, alat laboratorium, kebersihan ruangan, dan kategori fasilitas lainnya.
- **FR-006:** Sistem harus mengizinkan pelapor memilih lokasi dari daftar ruangan yang disediakan sistem.
- **FR-035:** Sistem harus mengelompokkan daftar ruangan berdasarkan gedung dan lantai.

## User Story
- **US-002:** Sebagai pelapor, saya ingin membuat laporan masalah fasilitas agar masalah kampus dapat diketahui dan ditangani.

## Acceptance Criteria
- **AC-003:** Pelapor dapat memilih lokasi dari pilihan bertingkat (Gedung -> Lantai -> Ruangan).
- **AC-004:** Laporan berhasil disimpan jika judul, deskripsi (minimal 20 karakter), kategori, lokasi, dan urgensi diisi lengkap.

## Pekerjaan
- [ ] Buat tampilan Form Pembuatan Laporan dengan pilihan lokasi terstruktur
- [ ] Buat API POST `/api/requests` untuk menyimpan laporan baru
- [ ] Hubungkan form dengan database D1 (`service_requests`)
- [ ] Buat unit/integration test untuk validasi form dan penyimpanan laporan
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-007][FR-008][FR-009] Pemeriksaan dan Penolakan Laporan oleh Administrator

## Requirement
- **FR-007:** Sistem harus mengizinkan administrator memeriksa laporan yang masuk.
- **FR-008:** Sistem harus mengizinkan administrator menolak laporan yang tidak valid.
- **FR-009:** Sistem harus menyimpan alasan penolakan laporan jika laporan ditolak.

## User Story
- **US-003:** Sebagai administrator, saya ingin memeriksa laporan masuk agar laporan yang valid dapat diproses dan laporan tidak valid dapat ditolak.

## Acceptance Criteria
- **AC-005:** Administrator dapat melihat daftar laporan berstatus `SUBMITTED` atau `UNDER_REVIEW`.
- **AC-006:** Jika administrator menolak laporan, sistem wajib meminta alasan penolakan dan mengubah status menjadi `REJECTED`.

## Pekerjaan
- [ ] Buat tampilan halaman antrean review untuk Administrator
- [ ] Buat API POST `/api/requests/:id/reject` dengan parameter alasan penolakan
- [ ] Simpan alasan penolakan pada kolom `rejection_reason` di database
- [ ] Buat unit test untuk validasi alasan penolakan wajib diisi
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-010][FR-011] Penugasan Laporan kepada Teknisi

## Requirement
- **FR-010:** Sistem harus mengizinkan administrator menugaskan laporan yang valid kepada teknisi.
- **FR-011:** Sistem harus mengizinkan teknisi melihat dan menangani laporan yang diberikan kepadanya.

## User Story
- **US-004:** Sebagai administrator, saya ingin menugaskan laporan kepada teknisi agar pekerjaan perbaikan dapat dimulai.
- **US-005:** Sebagai teknisi, saya ingin melihat laporan yang diberikan kepada saya agar saya dapat menangani masalah fasilitas.

## Acceptance Criteria
- **AC-007:** Administrator dapat memilih teknisi aktif dari dropdown saat menugaskan laporan.
- **AC-008:** Laporan yang ditugaskan akan berubah status menjadi `ASSIGNED` dan muncul di halaman "Tugas Saya" milik teknisi terkait.

## Pekerjaan
- [ ] Buat tampilan dialog penugasan teknisi pada halaman Admin
- [ ] Buat tampilan halaman "Tugas Saya" untuk role Teknisi
- [ ] Buat API POST `/api/requests/:id/assign` untuk menugaskan teknisi
- [ ] Simpan data penugasan ke database (`request_assignments`)
- [ ] Buat integration test untuk proses penugasan dan visibilitas tugas teknisi
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-012][FR-014][FR-041] Pembaruan Progress Pekerjaan dan Estimasi oleh Teknisi

## Requirement
- **FR-012:** Sistem harus mengizinkan teknisi memperbarui progress pekerjaan sampai selesai.
- **FR-014:** Sistem harus mengizinkan teknisi mengubah status pekerjaan menjadi butuh bantuan, tertunda, atau menunggu suku cadang.
- **FR-041:** Sistem harus mengizinkan teknisi memperkirakan waktu penyelesaian dengan menyertakan penjelasan.

## User Story
- **US-006:** Sebagai teknisi, saya ingin memperbarui progress dan status pekerjaan agar pelapor dan administrator mengetahui perkembangan pekerjaan.
- **US-018:** Sebagai teknisi, saya ingin menambahkan estimasi waktu dengan penjelasan agar progress pekerjaan lebih jelas.

## Acceptance Criteria
- **AC-009:** Teknisi dapat mengubah status pekerjaan menjadi `IN_PROGRESS`, `NEED_HELP`, `WAITING_PARTS`, atau `PAUSED` disertai catatan progres.
- **AC-010:** Teknisi dapat memasukkan tanggal/waktu estimasi selesai (`estimated_completion_at`) disertai catatan penjelasan.

## Pekerjaan
- [ ] Buat form update progress di halaman tugas teknisi
- [ ] Buat API POST `/api/requests/:id/progress` untuk mencatat progress teknisi
- [ ] Simpan data progress and estimasi ke database (`technician_progress`)
- [ ] Buat test untuk pengubahan status dan penyimpanan catatan progress/estimasi
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-013] Pembaruan Progress Laporan oleh Administrator

## Requirement
- **FR-013:** Sistem harus mengizinkan administrator memperbarui progress teknisi dengan catatan alasan.

## User Story
- **US-008:** Sebagai administrator, saya ingin memperbarui progress teknisi dengan catatan alasan agar progress tetap akurat ketika teknisi sudah memberi informasi kepada administrator.

## Acceptance Criteria
- **AC-011:** Administrator dapat memperbarui progress laporan yang sedang berjalan atas nama teknisi.
- **AC-012:** Sistem wajib meminta catatan alasan dari administrator saat melakukan pembaruan progress tersebut.

## Pekerjaan
- [ ] Buat form update progress khusus Administrator pada detail laporan
- [ ] Buat API POST `/api/admin/requests/:id/progress` dengan validasi alasan wajib
- [ ] Simpan riwayat perubahan progress ke database disertai aktor pembuat
- [ ] Buat unit/integration test untuk memverifikasi hak akses admin dan validasi alasan
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-015] Pengerahan Teknisi Tambahan (Kolaborasi)

## Requirement
- **FR-015:** Sistem harus mengizinkan lebih dari satu teknisi dikerahkan jika teknisi menyatakan butuh bantuan dan administrator menyetujuinya.

## User Story
- **US-007:** Sebagai teknisi, saya ingin meminta bantuan melalui status butuh bantuan agar administrator dapat mengerahkan lebih dari satu teknisi jika diperlukan.

## Acceptance Criteria
- **AC-013:** Jika laporan berstatus `NEED_HELP`, administrator dapat menambahkan teknisi tambahan (`ADDITIONAL`) ke laporan tersebut.
- **AC-014:** Laporan yang ditugaskan ke beberapa teknisi akan muncul di antrean "Tugas Saya" milik seluruh teknisi yang terlibat.

## Pekerjaan
- [ ] Buat tombol dan form "Tambah Teknisi" pada tampilan detail laporan untuk Admin
- [ ] Buat API POST `/api/requests/:id/assign-additional`
- [ ] Simpan assignment tambahan ke database (`request_assignments` dengan tipe `ADDITIONAL`)
- [ ] Buat test untuk memastikan teknisi tambahan dapat melihat dan mengupdate laporan
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-016][FR-017] Pemantauan Progres dan Komentar Tambahan oleh Pelapor

## Requirement
- **FR-016:** Sistem harus mengizinkan pelapor melihat perkembangan laporan.
- **FR-017:** Sistem harus mengizinkan pelapor memberi komentar tambahan setelah laporan dibuat.

## User Story
- **US-009:** Sebagai pelapor, saya ingin melihat perkembangan laporan dan memberi komentar tambahan agar saya dapat mengikuti proses penanganan masalah.

## Acceptance Criteria
- **AC-015:** Pelapor dapat melihat status saat ini dan riwayat perpindahan status (timeline) pada detail laporan.
- **AC-016:** Pelapor dapat menulis komentar baru yang akan langsung muncul pada thread komentar detail laporan.

## Pekerjaan
- [ ] Buat komponen Timeline dan Thread Komentar pada halaman Detail Laporan
- [ ] Buat API GET `/api/requests/:id/comments` dan POST `/api/requests/:id/comments`
- [ ] Simpan komentar pelapor ke database D1 (`request_comments`)
- [ ] Buat unit test untuk validasi isi komentar tidak boleh kosong
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-018][FR-019][FR-020][FR-021][FR-036] Konfirmasi Hasil Pekerjaan dan Penutupan Laporan

## Requirement
- **FR-018:** Sistem harus mengizinkan pelapor memberi konfirmasi setelah teknisi menyelesaikan pekerjaan.
- **FR-019:** Sistem harus memberi batas waktu 45 menit kepada pelapor untuk memberikan konfirmasi setelah pekerjaan selesai.
- **FR-020:** Sistem harus menutup laporan secara otomatis jika pelapor tidak memberi konfirmasi dalam 45 menit setelah pekerjaan selesai.
- **FR-021:** Sistem harus mengizinkan administrator menutup laporan.
- **FR-036:** Sistem harus mengizinkan pelapor menolak hasil pekerjaan dengan menyertakan alasan, lalu laporan dapat dibuka ulang sesuai ketentuan administrator.

## User Story
- **US-010:** Sebagai pelapor, saya ingin memberi konfirmasi setelah pekerjaan selesai agar administrator dapat mengetahui apakah laporan dapat ditutup.
- **US-011:** Sebagai administrator, saya ingin laporan dapat ditutup otomatis setelah 45 menit tanpa konfirmasi agar laporan selesai tidak tertahan terlalu lama.
- **US-016:** Sebagai pelapor, saya ingin menolak hasil pekerjaan dengan alasan agar laporan dapat dibuka ulang jika masalah belum selesai.

## Acceptance Criteria
- **AC-017:** Pelapor dapat mengklik "Konfirmasi Selesai" (mengubah status ke `CLOSED_REPORTER_CONFIRMED`) atau "Tolak Hasil" dengan alasan (mengubah status ke `REOPEN_REQUESTED`).
- **AC-018:** Laporan berstatus `RESOLVED` secara otomatis berubah menjadi `CLOSED_AUTO` jika melebihi batas waktu 45 menit tanpa respons pelapor.
- **AC-019:** Administrator dapat membuka kembali laporan yang ditolak hasilnya (`REOPENED`) atau menutupnya secara paksa (`CLOSED_ADMIN`).

## Pekerjaan
- [ ] Buat panel aksi konfirmasi (dengan hitung mundur 45 menit) pada detail laporan pelapor
- [ ] Buat API konfirmasi (`/confirm`, `/reject-resolution`, `/reopen`, `/close`)
- [ ] Buat background task/scheduler untuk penutupan otomatis 45 menit
- [ ] Buat integration test untuk alur penutupan otomatis dan penolakan hasil oleh pelapor
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-022][FR-023][FR-037] Notifikasi Aplikasi dan Riwayat Baca Notifikasi

## Requirement
- **FR-022:** Sistem harus mengirim notifikasi melalui aplikasi saat status laporan berubah pada kondisi yang ditentukan.
- **FR-023:** Sistem harus mengirim notifikasi aplikasi saat masalah sudah ditangani, membutuhkan suku cadang baru, teknisi butuh bantuan, dan pekerjaan terjeda.
- **FR-037:** Sistem harus menyediakan riwayat notifikasi dan status notifikasi sudah dibaca.
- **NFR-002:** Sistem harus menyediakan notifikasi di dalam aplikasi, bukan melalui email atau WhatsApp.

## User Story
- **US-019:** Sebagai pengguna sistem, saya ingin melihat riwayat notifikasi dan status sudah dibaca agar saya dapat melacak informasi yang sudah diterima.

## Acceptance Criteria
- **AC-020:** Setiap perubahan status yang memicu notifikasi akan dicatat ke dalam database notifikasi penerima.
- **AC-021:** Pengguna memiliki panel notifikasi untuk melihat daftar notifikasi dan menandai notifikasi sebagai sudah dibaca (`read_at` terisi).

## Pekerjaan
- [ ] Buat komponen Notification Drawer/Center di navigasi header
- [ ] Buat API GET `/api/notifications` dan POST `/api/notifications/:id/read`
- [ ] Hubungkan trigger perubahan status di backend dengan modul notifikasi
- [ ] Buat test untuk memastikan notifikasi terkirim ke aktor yang tepat
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-031][FR-032][FR-033][FR-034] Perubahan dan Pembatalan Laporan oleh Pelapor

## Requirement
- **FR-031:** Sistem harus mengizinkan pelapor mengubah laporan setelah dikirim dengan menyertakan alasan perubahan.
- **FR-032:** Sistem harus menampilkan perubahan laporan dan alasan perubahan kepada administrator untuk menentukan apakah laporan tetap valid atau tidak valid.
- **FR-033:** Sistem harus mengizinkan administrator menutup laporan yang menjadi tidak valid setelah perubahan pelapor.
- **FR-034:** Sistem harus mengizinkan pelapor membatalkan laporan dengan menyertakan alasan pembatalan.

## User Story
- **US-015:** Sebagai pelapor, saya ingin mengubah atau membatalkan laporan dengan alasan agar laporan yang saya kirim tetap sesuai kondisi sebenarnya.

## Acceptance Criteria
- **AC-022:** Pelapor dapat membatalkan laporan berstatus awal (status berubah ke `CANCELLED` disertai alasan).
- **AC-023:** Jika pelapor mengubah isi laporan, sistem mencatat alasan perubahan, mengembalikan status ke pemeriksaan admin, dan memunculkan notifikasi perubahan ke Admin.

## Pekerjaan
- [ ] Buat form edit laporan dan tombol batalkan laporan bagi Pelapor
- [ ] Buat API edit (`PATCH /api/requests/:id`) dan batalkan (`POST /api/requests/:id/cancel`)
- [ ] Simpan riwayat perubahan di database (`audit_logs` dan `status_history`)
- [ ] Buat integration test untuk memvalidasi alur pembatalan dan review admin setelah edit laporan
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-038][FR-039][FR-040] Manajemen Laporan Lanjutan oleh Administrator

## Requirement
- **FR-038:** Sistem harus mengizinkan administrator mengedit kategori, lokasi, atau deskripsi laporan sebelum menugaskan teknisi dengan menyertakan alasan.
- **FR-039:** Sistem harus mengizinkan administrator menggabungkan laporan duplikat.
- **FR-040:** Sistem harus mengizinkan administrator mengganti teknisi setelah laporan berjalan dengan persetujuan teknisi lama dan teknisi baru.

## User Story
- **US-017:** Sebagai administrator, saya ingin memperbaiki data laporan, menggabungkan laporan duplikat, dan mengganti teknisi sesuai aturan agar pengelolaan laporan tetap akurat.

## Acceptance Criteria
- **AC-024:** Admin dapat menggabungkan laporan duplikat ke laporan utama (menghubungkan id laporan duplikat ke laporan utama).
- **AC-025:** Penggantian teknisi di tengah jalan memerlukan konfirmasi persetujuan (`approved`) dari teknisi lama dan teknisi baru sebelum assignment baru aktif.

## Pekerjaan
- [ ] Buat form edit admin, dialog merge duplikat, dan UI penggantian teknisi
- [ ] Buat API merge (`/merge`), edit admin (`/admin/edit`), dan ganti teknisi (`/reassign`)
- [ ] Simpan persetujuan teknisi lama/baru di database D1 (`request_assignments`)
- [ ] Buat integration test untuk alur persetujuan penggantian teknisi dan penggabungan duplikat
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-024][FR-025][FR-026][FR-027][FR-028][FR-029][FR-042][FR-043] Dashboard dan Pelaporan untuk Manajer Fasilitas

## Requirement
- **FR-024:** Sistem harus menyediakan dashboard untuk Manajer Fasilitas.
- **FR-025:** Dashboard harus menampilkan total masalah yang sudah diselesaikan.
- **FR-026:** Dashboard harus menampilkan chart kategori masalah yang paling sering muncul.
- **FR-027:** Dashboard harus dapat difilter atau diurutkan berdasarkan terbaru, terlama, ruangan, dan kategori.
- **FR-028:** Sistem harus menyediakan laporan ringkas untuk Manajer Fasilitas.
- **FR-029:** Laporan ringkas harus mengandung ruangan masalah dan kategori masalah.
- **FR-042:** Sistem harus mengizinkan laporan ringkas diunduh (format CSV).
- **FR-043:** Sistem harus mengizinkan Manajer Fasilitas memberi catatan tindak lanjut dengan menyertakan alasan.

## User Story
- **US-012:** Sebagai Manajer Fasilitas, saya ingin melihat dashboard agar saya dapat memantau total masalah selesai dan kategori masalah yang sering muncul.
- **US-013:** Sebagai Manajer Fasilitas, saya ingin melihat laporan ringkas agar saya dapat mengetahui ruangan dan kategori masalah.
- **US-020:** Sebagai Manajer Fasilitas, saya ingin mengunduh laporan ringkas dan memberi catatan tindak lanjut agar hasil pemantauan dapat digunakan untuk tindakan berikutnya.

## Acceptance Criteria
- **AC-026:** Manajer Fasilitas dapat memfilter dashboard berdasarkan waktu, ruangan, dan kategori serta mengunduh data laporan ringkas ke format file CSV.
- **AC-027:** Manajer Fasilitas dapat menambahkan catatan tindak lanjut dengan alasan wajib pada laporan yang telah ditinjau.

## Pekerjaan
- [ ] Buat halaman Dashboard dan Laporan Ringkas untuk Manajer Fasilitas
- [ ] Buat tombol export CSV di frontend dan API endpoint `/api/reports/summary.csv`
- [ ] Buat API POST `/api/reports/:id/follow-up` untuk mencatat tindak lanjut Manajer
- [ ] Buat unit test untuk validasi data export CSV dan alasan wajib pada catatan tindak lanjut
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai

---

# [FR-030] Pembaruan Daftar Ruangan Kampus

## Requirement
- **FR-030:** Sistem harus mengizinkan Manajer Fasilitas memperbarui daftar ruangan jika ada ruangan baru.

## User Story
- **US-014:** Sebagai Manajer Fasilitas, saya ingin memperbarui daftar ruangan agar pilihan lokasi laporan tetap sesuai kondisi kampus.

## Acceptance Criteria
- **AC-028:** Manajer Fasilitas dapat menambahkan ruangan baru dengan memasukkan nama gedung, lantai, dan nama/nomor ruangan. Ruangan baru langsung muncul pada dropdown pembuatan laporan.

## Pekerjaan
- [ ] Buat halaman manajemen ruangan untuk Manajer Fasilitas
- [ ] Buat API POST `/api/rooms` untuk menambahkan ruangan baru
- [ ] Simpan data ruangan ke database (`rooms`)
- [ ] Buat test untuk memastikan duplikasi ruangan (gedung, lantai, nama sama) ditolak sistem
- [ ] Update traceability matrix

## Selesai Jika
- [ ] Acceptance criteria terpenuhi
- [ ] Test lulus
- [ ] Human review selesai
