# 03 Requirement Specification

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `outputs/01-inception-stakeholder.md`
- `outputs/02-elicitation-findings.md`
- `outputs/02-elicitation-questions.md`
- Klarifikasi pengguna pada 30 Juni 2026 untuk requirement yang sebelumnya belum dispesifikasikan

## Ringkasan Sistem
Sistem digunakan oleh mahasiswa dan dosen untuk melaporkan masalah fasilitas kampus. Administrator memeriksa laporan, menolak laporan tidak valid, menugaskan teknisi, memperbarui progress teknisi, dan menutup laporan. Teknisi menangani laporan yang diberikan, memperbarui progress, dan menyelesaikan pekerjaan. Pelapor dapat melihat progress, memberi komentar, mengubah atau membatalkan laporan dengan alasan, menerima notifikasi aplikasi, memberi konfirmasi, dan menolak hasil pekerjaan dengan alasan jika masalah belum selesai. Manajer Fasilitas dapat melihat dashboard, laporan ringkas, mengunduh laporan ringkas, memberi catatan tindak lanjut, dan memperbarui daftar ruangan.

## Functional Requirement

| ID | Requirement | Sumber |
| --- | --- | --- |
| FR-001 | Sistem harus mengizinkan mahasiswa dan dosen login menggunakan akun kampus sebelum membuat atau memantau laporan. | REQ-DRAFT-001 |
| FR-002 | Sistem harus mengizinkan pelapor membuat laporan masalah fasilitas kampus. | REQ-DRAFT-002 |
| FR-003 | Sistem harus menyimpan judul masalah, deskripsi, kategori masalah, lokasi ruangan, dan tingkat urgensi pada laporan. | REQ-DRAFT-003, REQ-DRAFT-025 |
| FR-004 | (Dihapus) Fitur menyertakan bukti atau foto kerusakan ditiadakan. | REQ-DRAFT-004 |
| FR-005 | Sistem harus menyediakan kategori masalah fasilitas seperti proyektor, internet, AC, kursi, alat laboratorium, kebersihan ruangan, dan kategori fasilitas lainnya. | REQ-DRAFT-005 |
| FR-006 | Sistem harus mengizinkan pelapor memilih lokasi dari daftar ruangan yang disediakan sistem. | REQ-DRAFT-006 |
| FR-007 | Sistem harus mengizinkan administrator memeriksa laporan yang masuk. | REQ-DRAFT-007 |
| FR-008 | Sistem harus mengizinkan administrator menolak laporan yang tidak valid. | REQ-DRAFT-008, REQ-DRAFT-027 |
| FR-009 | Sistem harus menyimpan alasan penolakan laporan jika laporan ditolak. | REQ-DRAFT-027 |
| FR-010 | Sistem harus mengizinkan administrator menugaskan laporan yang valid kepada teknisi. | REQ-DRAFT-009 |
| FR-011 | Sistem harus mengizinkan teknisi melihat dan menangani laporan yang diberikan kepadanya. | REQ-DRAFT-010 |
| FR-012 | Sistem harus mengizinkan teknisi memperbarui progress pekerjaan sampai selesai. | REQ-DRAFT-011 |
| FR-013 | Sistem harus mengizinkan administrator memperbarui progress teknisi dengan catatan alasan. | REQ-DRAFT-012, REQ-DRAFT-029 |
| FR-014 | Sistem harus mengizinkan teknisi mengubah status pekerjaan menjadi butuh bantuan, tertunda, atau menunggu suku cadang. | REQ-DRAFT-013 |
| FR-015 | Sistem harus mengizinkan lebih dari satu teknisi dikerahkan jika teknisi menyatakan butuh bantuan dan administrator menyetujuinya. | REQ-DRAFT-028 |
| FR-016 | Sistem harus mengizinkan pelapor melihat perkembangan laporan. | REQ-DRAFT-014 |
| FR-017 | Sistem harus mengizinkan pelapor memberi komentar tambahan setelah laporan dibuat. | REQ-DRAFT-015 |
| FR-018 | Sistem harus mengizinkan pelapor memberi konfirmasi setelah teknisi menyelesaikan pekerjaan. | REQ-DRAFT-016 |
| FR-019 | Sistem harus memberi batas waktu 45 menit kepada pelapor untuk memberikan konfirmasi setelah pekerjaan selesai. | REQ-DRAFT-020 |
| FR-020 | Sistem harus menutup laporan secara otomatis jika pelapor tidak memberi konfirmasi dalam 45 menit setelah pekerjaan selesai. | REQ-DRAFT-030 |
| FR-021 | Sistem harus mengizinkan administrator menutup laporan. | REQ-DRAFT-017, REQ-DRAFT-018 |
| FR-022 | Sistem harus mengirim notifikasi melalui aplikasi saat status laporan berubah pada kondisi yang ditentukan. | REQ-DRAFT-019, REQ-DRAFT-031 |
| FR-023 | Sistem harus mengirim notifikasi aplikasi saat masalah sudah ditangani, membutuhkan suku cadang baru, teknisi butuh bantuan, dan pekerjaan terjeda. | REQ-DRAFT-031 |
| FR-024 | Sistem harus menyediakan dashboard untuk Manajer Fasilitas. | REQ-DRAFT-021 |
| FR-025 | Dashboard harus menampilkan total masalah yang sudah diselesaikan. | REQ-DRAFT-022 |
| FR-026 | Dashboard harus menampilkan chart kategori masalah yang paling sering muncul. | REQ-DRAFT-023 |
| FR-027 | Dashboard harus dapat difilter atau diurutkan berdasarkan terbaru, terlama, ruangan, dan kategori. | REQ-DRAFT-032 |
| FR-028 | Sistem harus menyediakan laporan ringkas untuk Manajer Fasilitas. | REQ-DRAFT-024 |
| FR-029 | Laporan ringkas harus mengandung ruangan masalah dan kategori masalah. | REQ-DRAFT-033 |
| FR-030 | Sistem harus mengizinkan Manajer Fasilitas memperbarui daftar ruangan jika ada ruangan baru. | REQ-DRAFT-026 |
| FR-031 | Sistem harus mengizinkan pelapor mengubah laporan setelah dikirim dengan menyertakan alasan perubahan. | Klarifikasi pengguna 30 Juni 2026 |
| FR-032 | Sistem harus menampilkan perubahan laporan dan alasan perubahan kepada administrator untuk menentukan apakah laporan tetap valid atau tidak valid. | Klarifikasi pengguna 30 Juni 2026 |
| FR-033 | Sistem harus mengizinkan administrator menutup laporan yang menjadi tidak valid setelah perubahan pelapor. | Klarifikasi pengguna 30 Juni 2026 |
| FR-034 | Sistem harus mengizinkan pelapor membatalkan laporan dengan menyertakan alasan pembatalan. | Klarifikasi pengguna 30 Juni 2026 |
| FR-035 | Sistem harus mengelompokkan daftar ruangan berdasarkan gedung dan lantai. | Klarifikasi pengguna 30 Juni 2026 |
| FR-036 | Sistem harus mengizinkan pelapor menolak hasil pekerjaan dengan menyertakan alasan, lalu laporan dapat dibuka ulang sesuai ketentuan administrator. | Klarifikasi pengguna 30 Juni 2026 |
| FR-037 | Sistem harus menyediakan riwayat notifikasi dan status notifikasi sudah dibaca. | Klarifikasi pengguna 30 Juni 2026 |
| FR-038 | Sistem harus mengizinkan administrator mengedit kategori, lokasi, atau deskripsi laporan sebelum menugaskan teknisi dengan menyertakan alasan. | Klarifikasi pengguna 30 Juni 2026 |
| FR-039 | Sistem harus mengizinkan administrator menggabungkan laporan duplikat. | Klarifikasi pengguna 30 Juni 2026 |
| FR-040 | Sistem harus mengizinkan administrator mengganti teknisi setelah laporan berjalan dengan persetujuan teknisi lama dan teknisi baru. | Klarifikasi pengguna 30 Juni 2026, Human review 1 Juli 2026 |
| FR-041 | Sistem harus mengizinkan teknisi memperkirakan waktu penyelesaian dengan menyertakan penjelasan. | Klarifikasi pengguna 30 Juni 2026, Human review 1 Juli 2026 |
| FR-042 | Sistem harus mengizinkan laporan ringkas diunduh. | Klarifikasi pengguna 30 Juni 2026 |
| FR-043 | Sistem harus mengizinkan Manajer Fasilitas memberi catatan tindak lanjut dengan menyertakan alasan. | Klarifikasi pengguna 30 Juni 2026 |

## Non-Functional Requirement

| ID | Requirement | Sumber |
| --- | --- | --- |
| NFR-001 | Sistem harus membatasi akses pembuatan dan pemantauan laporan kepada pelapor yang login menggunakan akun kampus. | REQ-DRAFT-001 |
| NFR-002 | Sistem harus menyediakan notifikasi di dalam aplikasi, bukan melalui email, WhatsApp, atau kanal eksternal pada scope awal. | REQ-DRAFT-019, ASUMSI dari elicitation |
| NFR-003 | Sistem harus menjaga pemisahan hak akses berdasarkan peran: pelapor, administrator, teknisi, dan Manajer Fasilitas. | STK-001 sampai STK-005 |
| NFR-004 | Sistem harus menyimpan jejak informasi penting pada laporan, termasuk status, progress, teknisi yang ditugaskan, komentar, konfirmasi, alasan penolakan, alasan perubahan, alasan pembatalan, alasan penolakan hasil pekerjaan, persetujuan penggantian teknisi, dan catatan alasan pembaruan progress administrator. | Data yang ditemukan, Klarifikasi pengguna 30 Juni 2026 |
| NFR-005 | Sistem tidak mencakup pembayaran, biaya perbaikan, pengadaan barang, integrasi sistem akademik, integrasi notifikasi eksternal, penilaian kinerja teknisi, atau dashboard analitik tingkat lanjut pada scope awal. | Di Luar Scope Awal |
| NFR-006 | Sistem harus dapat digunakan melalui browser modern pada perangkat desktop dan ponsel dengan tampilan yang responsif. | Referensi tugas proyek Software Engineering |

## User Story

| ID | User Story | Requirement Terkait |
| --- | --- | --- |
| US-001 | Sebagai mahasiswa atau dosen, saya ingin login menggunakan akun kampus agar hanya pengguna kampus yang dapat membuat dan memantau laporan. | FR-001, NFR-001 |
| US-002 | Sebagai pelapor, saya ingin membuat laporan masalah fasilitas agar masalah kampus dapat diketahui dan ditangani. | FR-002, FR-003, FR-005, FR-006 |
| US-003 | Sebagai administrator, saya ingin memeriksa laporan masuk agar laporan yang valid dapat diproses dan laporan tidak valid dapat ditolak. | FR-007, FR-008, FR-009 |
| US-004 | Sebagai administrator, saya ingin menugaskan laporan kepada teknisi agar pekerjaan perbaikan dapat dimulai. | FR-010 |
| US-005 | Sebagai teknisi, saya ingin melihat laporan yang diberikan kepada saya agar saya dapat menangani masalah fasilitas. | FR-011 |
| US-006 | Sebagai teknisi, saya ingin memperbarui progress dan status pekerjaan agar pelapor dan administrator mengetahui perkembangan pekerjaan. | FR-012, FR-014, FR-022, FR-023 |
| US-007 | Sebagai teknisi, saya ingin meminta bantuan melalui status butuh bantuan agar administrator dapat mengerahkan lebih dari satu teknisi jika diperlukan. | FR-014, FR-015 |
| US-008 | Sebagai administrator, saya ingin memperbarui progress teknisi dengan catatan alasan agar progress tetap akurat ketika teknisi sudah memberi informasi kepada administrator. | FR-013 |
| US-009 | Sebagai pelapor, saya ingin melihat perkembangan laporan dan memberi komentar tambahan agar saya dapat mengikuti proses penanganan masalah. | FR-016, FR-017 |
| US-010 | Sebagai pelapor, saya ingin memberi konfirmasi setelah pekerjaan selesai agar administrator dapat mengetahui apakah laporan dapat ditutup. | FR-018, FR-019 |
| US-011 | Sebagai administrator, saya ingin laporan dapat ditutup otomatis setelah 45 menit tanpa konfirmasi agar laporan selesai tidak tertahan terlalu lama. | FR-020, FR-021 |
| US-012 | Sebagai Manajer Fasilitas, saya ingin melihat dashboard agar saya dapat memantau total masalah selesai dan kategori masalah yang sering muncul. | FR-024, FR-025, FR-026, FR-027 |
| US-013 | Sebagai Manajer Fasilitas, saya ingin melihat laporan ringkas agar saya dapat mengetahui ruangan dan kategori masalah. | FR-028, FR-029 |
| US-014 | Sebagai Manajer Fasilitas, saya ingin memperbarui daftar ruangan agar pilihan lokasi laporan tetap sesuai kondisi kampus. | FR-030 |
| US-015 | Sebagai pelapor, saya ingin mengubah atau membatalkan laporan dengan alasan agar laporan yang saya kirim tetap sesuai kondisi sebenarnya. | FR-031, FR-032, FR-033, FR-034 |
| US-016 | Sebagai pelapor, saya ingin menolak hasil pekerjaan dengan alasan agar laporan dapat dibuka ulang jika masalah belum selesai. | FR-036 |
| US-017 | Sebagai administrator, saya ingin memperbaiki data laporan, menggabungkan laporan duplikat, dan mengganti teknisi sesuai aturan agar pengelolaan laporan tetap akurat. | FR-038, FR-039, FR-040 |
| US-018 | Sebagai teknisi, saya ingin menambahkan estimasi waktu dengan penjelasan agar progress pekerjaan lebih jelas. | FR-041 |
| US-019 | Sebagai pengguna sistem, saya ingin melihat riwayat notifikasi dan status sudah dibaca agar saya dapat melacak informasi yang sudah diterima. | FR-037 |
| US-020 | Sebagai Manajer Fasilitas, saya ingin mengunduh laporan ringkas dan memberi catatan tindak lanjut agar hasil pemantauan dapat digunakan untuk tindakan berikutnya. | FR-042, FR-043 |

## Acceptance Criteria

### FR-001 Login Akun Kampus
1. Jika mahasiswa atau dosen belum login, sistem tidak mengizinkan pengguna membuat laporan.
2. Jika mahasiswa atau dosen berhasil login dengan akun kampus, sistem mengizinkan pengguna mengakses fitur pelaporan.

### FR-002, FR-003, FR-005, FR-006 Pembuatan Laporan
1. Jika pelapor mengisi judul masalah, deskripsi, kategori masalah, lokasi ruangan, dan tingkat urgensi, sistem dapat menyimpan laporan.
2. Jika pelapor tidak mengisi deskripsi, sistem tidak dapat mengirim laporan sebagai laporan valid.
3. Jika pelapor memilih kategori masalah dari daftar kategori fasilitas, sistem menyimpan kategori tersebut pada laporan.
4. Jika pelapor memilih lokasi dari daftar ruangan, sistem menyimpan lokasi tersebut pada laporan.
5. (Dihapus) Bukti atau foto kerusakan ditiadakan.

### FR-007, FR-008, FR-009 Pemeriksaan dan Penolakan Laporan
1. Administrator dapat melihat laporan yang masuk.
2. Administrator dapat menolak laporan jika judul tidak sesuai dengan deskripsi dan/atau kategori.
3. Administrator dapat menolak laporan jika deskripsi kosong.
4. Administrator dapat menolak laporan jika lokasi tidak diketahui atau salah.
5. Jika administrator menolak laporan, sistem menyimpan alasan penolakan.

### FR-010, FR-011 Penugasan Teknisi
1. Administrator dapat menugaskan laporan valid kepada teknisi.
2. Setelah laporan ditugaskan, teknisi yang ditunjuk dapat melihat laporan tersebut.
3. Teknisi lain yang tidak ditugaskan tidak dianggap sebagai teknisi utama laporan tersebut.

### FR-012, FR-014 Progress Teknisi
1. Teknisi dapat memperbarui progress pekerjaan pada laporan yang ditugaskan kepadanya.
2. Teknisi dapat mengubah status menjadi butuh bantuan.
3. Teknisi dapat mengubah status menjadi tertunda.
4. Teknisi dapat mengubah status menjadi menunggu suku cadang.
5. Perubahan progress atau status tersimpan pada laporan.

### FR-013 Progress oleh Administrator
1. Administrator dapat memperbarui progress teknisi.
2. Sistem meminta catatan alasan saat administrator memperbarui progress teknisi.
3. Sistem menyimpan catatan alasan pembaruan progress administrator.

### FR-015 Bantuan Teknisi Tambahan
1. Jika teknisi mengubah status menjadi butuh bantuan, administrator dapat menyetujui bantuan tambahan.
2. Jika administrator menyetujui bantuan tambahan, lebih dari satu teknisi dapat dikerahkan untuk laporan tersebut.
3. Jika status bukan butuh bantuan, sistem tidak menggunakan aturan pengerahan teknisi tambahan.

### FR-016, FR-017 Pemantauan dan Komentar Pelapor
1. Pelapor dapat melihat perkembangan laporan miliknya.
2. Pelapor dapat memberi komentar tambahan setelah laporan dibuat.
3. Komentar tambahan tersimpan pada laporan.

### FR-018, FR-019, FR-020 Konfirmasi Pelapor dan Penutupan Otomatis
1. Setelah teknisi menyelesaikan pekerjaan, pelapor dapat memberi konfirmasi.
2. Sistem memberi waktu 45 menit untuk konfirmasi pelapor setelah pekerjaan selesai.
3. Jika pelapor tidak memberi konfirmasi dalam 45 menit, sistem menutup laporan secara otomatis.

### FR-021 Penutupan oleh Administrator
1. Administrator dapat menutup laporan.
2. Administrator boleh menutup laporan tanpa konfirmasi pelapor.
3. Status laporan berubah menjadi tertutup setelah administrator menutup laporan.

### FR-022, FR-023 Notifikasi Aplikasi
1. Sistem mengirim notifikasi melalui aplikasi saat masalah sudah ditangani.
2. Sistem mengirim notifikasi melalui aplikasi saat laporan membutuhkan suku cadang baru.
3. Sistem mengirim notifikasi melalui aplikasi saat teknisi butuh bantuan.
4. Sistem mengirim notifikasi melalui aplikasi saat pekerjaan terjeda.

### FR-024, FR-025, FR-026, FR-027 Dashboard Manajer Fasilitas
1. Manajer Fasilitas dapat membuka dashboard.
2. Dashboard menampilkan total masalah yang sudah diselesaikan.
3. Dashboard menampilkan chart kategori masalah yang paling sering muncul.
4. Dashboard dapat difilter atau diurutkan berdasarkan terbaru.
5. Dashboard dapat difilter atau diurutkan berdasarkan terlama.
6. Dashboard dapat difilter berdasarkan ruangan.
7. Dashboard dapat difilter berdasarkan kategori.

### FR-028, FR-029 Laporan Ringkas
1. Manajer Fasilitas dapat melihat laporan ringkas.
2. Laporan ringkas menampilkan ruangan masalah.
3. Laporan ringkas menampilkan kategori masalah.

### FR-030 Daftar Ruangan
1. Manajer Fasilitas dapat menambahkan ruangan baru ke daftar ruangan.
2. Ruangan baru yang ditambahkan tersedia sebagai pilihan lokasi laporan.

### FR-031, FR-032, FR-033 Perubahan Laporan oleh Pelapor
1. Pelapor dapat mengubah laporan setelah laporan dikirim.
2. Sistem meminta alasan perubahan saat pelapor mengubah laporan.
3. Administrator dapat melihat perubahan laporan dan alasan perubahan.
4. Administrator dapat menentukan apakah laporan yang diubah tetap valid atau tidak valid.
5. Jika laporan yang diubah dinilai tidak valid, administrator dapat menutup laporan tersebut.

### FR-034 Pembatalan Laporan oleh Pelapor
1. Pelapor dapat membatalkan laporan.
2. Sistem meminta alasan pembatalan saat pelapor membatalkan laporan.
3. Sistem menyimpan alasan pembatalan pada riwayat laporan.

### FR-035 Pengelompokan Daftar Ruangan
1. Daftar ruangan ditampilkan berdasarkan gedung.
2. Daftar ruangan di dalam gedung ditampilkan berdasarkan lantai.
3. Pelapor dapat memilih ruangan dari kelompok gedung dan lantai yang tersedia.

### FR-036 Penolakan Hasil Pekerjaan oleh Pelapor
1. Pelapor dapat menolak hasil pekerjaan setelah teknisi menyatakan pekerjaan selesai.
2. Sistem meminta alasan penolakan hasil pekerjaan.
3. Administrator dapat membaca alasan penolakan hasil pekerjaan.
4. Administrator dapat membuka ulang laporan sesuai ketentuan yang berlaku.

### FR-037 Riwayat Notifikasi
1. Pengguna dapat melihat riwayat notifikasi di aplikasi.
2. Sistem menampilkan status notifikasi sudah dibaca atau belum dibaca.
3. Pengguna dapat menandai notifikasi sebagai sudah dibaca.

### FR-038 Edit Laporan oleh Administrator
1. Administrator dapat mengedit kategori laporan sebelum menugaskan teknisi.
2. Administrator dapat mengedit lokasi laporan sebelum menugaskan teknisi.
3. Administrator dapat mengedit deskripsi laporan sebelum menugaskan teknisi.
4. Sistem meminta alasan saat administrator mengedit data laporan.
5. Sistem menyimpan alasan edit administrator pada riwayat laporan.

### FR-039 Penggabungan Laporan Duplikat
1. Administrator dapat menandai laporan sebagai duplikat dari laporan lain.
2. Administrator dapat menggabungkan laporan duplikat.
3. Sistem menyimpan hubungan antara laporan duplikat dan laporan utama.

### FR-040 Penggantian Teknisi
1. Administrator dapat mengajukan penggantian teknisi setelah laporan berjalan.
2. Teknisi lama harus memberikan persetujuan sebelum penggantian teknisi dilakukan.
3. Teknisi baru harus memberikan persetujuan sebelum penggantian teknisi dilakukan.
4. Jika teknisi lama dan teknisi baru menyetujui, sistem memperbarui teknisi yang menangani laporan.
5. Jika salah satu teknisi tidak menyetujui, penggantian teknisi tidak dilakukan.

### FR-041 Estimasi Teknisi
1. (Dihapus) Fitur menyertakan URL foto hasil pekerjaan ditiadakan.
2. Teknisi dapat mengisi perkiraan waktu penyelesaian.
3. Sistem meminta penjelasan saat teknisi mengisi perkiraan waktu penyelesaian.
4. Sistem menyimpan perkiraan waktu dan penjelasan pada laporan.

### FR-042 Unduh Laporan Ringkas
1. Manajer Fasilitas dapat mengunduh laporan ringkas.
2. File unduhan berisi data laporan ringkas yang ditampilkan sistem.

### FR-043 Catatan Tindak Lanjut Manajer Fasilitas
1. Manajer Fasilitas dapat memberi catatan tindak lanjut pada laporan ringkas atau data laporan.
2. Sistem meminta alasan saat Manajer Fasilitas memberi catatan tindak lanjut.
3. Sistem menyimpan catatan tindak lanjut dan alasannya.

## Requirement yang Sudah Diklarifikasi
Bagian yang sebelumnya belum dispesifikasikan pada `03-requirement-specification.md` sudah dijadikan requirement formal berdasarkan klarifikasi pengguna pada 30 Juni 2026.

## Traceability Ringkas

| Source | Requirement Formal |
| --- | --- |
| REQ-DRAFT-001 | FR-001, NFR-001, US-001 |
| REQ-DRAFT-002 sampai REQ-DRAFT-006, REQ-DRAFT-025 | FR-002 sampai FR-003, FR-005 sampai FR-006, US-002 |
| REQ-DRAFT-007, REQ-DRAFT-008, REQ-DRAFT-027 | FR-007 sampai FR-009, US-003 |
| REQ-DRAFT-009, REQ-DRAFT-010 | FR-010, FR-011, US-004, US-005 |
| REQ-DRAFT-011 sampai REQ-DRAFT-013, REQ-DRAFT-028, REQ-DRAFT-029 | FR-012 sampai FR-015, US-006 sampai US-008 |
| REQ-DRAFT-014 sampai REQ-DRAFT-020, REQ-DRAFT-030 | FR-016 sampai FR-021, US-009 sampai US-011 |
| REQ-DRAFT-019, REQ-DRAFT-031 | FR-022, FR-023 |
| REQ-DRAFT-021 sampai REQ-DRAFT-024, REQ-DRAFT-032, REQ-DRAFT-033 | FR-024 sampai FR-029, US-012, US-013 |
| REQ-DRAFT-026 | FR-030, US-014 |
| Klarifikasi pengguna 30 Juni 2026 | FR-031 sampai FR-043, US-015 sampai US-020 |
| Human review 1 Juli 2026 | FR-040, FR-041 |
| Referensi tugas proyek Software Engineering | NFR-006 |

## ASUMSI
1. ASUMSI: Mahasiswa dan dosen memiliki hak pelaporan yang sama pada tahap awal.
2. ASUMSI: Notifikasi aplikasi berarti notifikasi hanya tampil di dalam sistem.
3. ASUMSI: Laporan ringkas tidak termasuk dashboard analitik tingkat lanjut.

## Quality Check
- Functional requirement berisi perilaku sistem.
- Non-functional requirement berisi batasan akses, scope, dan kualitas pencatatan data.
- User story menggunakan format peran, tujuan, dan manfaat.
- Setiap user story terhubung ke requirement.
- Acceptance criteria dapat diuji.
- Setiap requirement memiliki ID unik.
- Requirement yang sebelumnya belum dispesifikasikan sudah diperbarui berdasarkan klarifikasi pengguna.

## Human Review
Manusia perlu memeriksa apakah `FR`, `NFR`, `US`, dan acceptance criteria sudah mewakili kebutuhan stakeholder sebelum lanjut ke prioritas atau desain.

## Keputusan Human Review
Tanggapan berikut diberikan oleh pengguna pada 2 Juli 2026:
1. FR, NFR, US, dan acceptance criteria sudah mewakili kebutuhan stakeholder.
