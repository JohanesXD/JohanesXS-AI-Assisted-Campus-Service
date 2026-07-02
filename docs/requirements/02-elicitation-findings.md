# 02 Elicitation Findings

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `outputs/01-inception-stakeholder.md`

## Ringkasan Temuan
Sistem digunakan oleh mahasiswa dan dosen untuk melaporkan masalah fasilitas kampus. Laporan diperiksa oleh administrator, diberikan kepada teknisi, diperbarui progress-nya, dikonfirmasi oleh pelapor, lalu ditutup oleh administrator. Manajer Fasilitas dapat melihat dashboard dan laporan ringkas.

## Stakeholder dan Kebutuhan Awal

| ID | Stakeholder | Kebutuhan Utama |
| --- | --- | --- |
| STK-001 | Mahasiswa | Membuat laporan, melihat progress, memberi komentar, menerima notifikasi, dan memberi konfirmasi. |
| STK-002 | Dosen | Membuat laporan, melihat progress, memberi komentar, menerima notifikasi, dan memberi konfirmasi. |
| STK-003 | Administrator | Memeriksa laporan, menolak laporan tidak valid, menugaskan teknisi, memperbarui progress teknisi, dan menutup laporan. |
| STK-004 | Teknisi | Menerima tugas, memperbarui progress, mengubah status pekerjaan, dan menyelesaikan pekerjaan. |
| STK-005 | Manajer Fasilitas | Melihat dashboard, laporan ringkas, dan memperbarui daftar ruangan. |

## Kebutuhan Awal

| ID | Sumber | Temuan Kebutuhan |
| --- | --- | --- |
| REQ-DRAFT-001 | STK-001, STK-002 | Pelapor harus login menggunakan akun kampus. |
| REQ-DRAFT-002 | STK-001, STK-002 | Pelapor dapat membuat laporan masalah fasilitas kampus. |
| REQ-DRAFT-003 | STK-001, STK-002 | Laporan berisi judul masalah, deskripsi, kategori masalah, dan lokasi ruangan. |
| REQ-DRAFT-004 | STK-001, STK-002 | (Dihapus) Fitur menyertakan bukti atau foto kerusakan ditiadakan untuk efisiensi penyimpanan. |
| REQ-DRAFT-005 | STK-001, STK-002 | Kategori masalah mencakup proyektor, internet, AC, kursi, alat laboratorium, kebersihan ruangan, dan kategori fasilitas lainnya. |
| REQ-DRAFT-006 | STK-001, STK-002 | Pelapor memilih lokasi dari daftar ruangan yang disediakan sistem. |
| REQ-DRAFT-007 | STK-003 | Administrator dapat memeriksa laporan yang masuk. |
| REQ-DRAFT-008 | STK-003 | Administrator dapat menolak laporan yang tidak valid. |
| REQ-DRAFT-009 | STK-003 | Administrator dapat memberikan laporan kepada teknisi. |
| REQ-DRAFT-010 | STK-004 | Teknisi menerima dan menangani laporan yang diberikan kepadanya. |
| REQ-DRAFT-011 | STK-004 | Teknisi dapat memperbarui progress pekerjaan sampai selesai. |
| REQ-DRAFT-012 | STK-003 | Administrator dapat memperbarui progress teknisi. |
| REQ-DRAFT-013 | STK-004 | Teknisi dapat mengubah status menjadi butuh bantuan, tertunda, atau menunggu suku cadang. |
| REQ-DRAFT-014 | STK-001, STK-002 | Pelapor dapat melihat perkembangan laporan. |
| REQ-DRAFT-015 | STK-001, STK-002 | Pelapor dapat memberi komentar tambahan setelah laporan dibuat. |
| REQ-DRAFT-016 | STK-001, STK-002 | Pelapor dapat memberi konfirmasi setelah teknisi menyelesaikan pekerjaan. |
| REQ-DRAFT-017 | STK-003 | Administrator dapat menutup laporan. |
| REQ-DRAFT-018 | STK-003 | Administrator boleh menutup laporan tanpa konfirmasi pelapor. |
| REQ-DRAFT-019 | STK-001, STK-002, STK-003, STK-004 | Sistem mengirim notifikasi perubahan status melalui aplikasi. |
| REQ-DRAFT-020 | STK-001, STK-002 | Pelapor diberi waktu 45 menit untuk memberikan konfirmasi setelah teknisi menyelesaikan pekerjaan. |
| REQ-DRAFT-021 | STK-005 | Manajer Fasilitas dapat melihat dashboard. |
| REQ-DRAFT-022 | STK-005 | Dashboard menampilkan total masalah yang sudah diselesaikan. |
| REQ-DRAFT-023 | STK-005 | Dashboard menampilkan chart kategori masalah yang paling sering muncul. |
| REQ-DRAFT-024 | STK-005 | Manajer Fasilitas dapat melihat laporan ringkas. |
| REQ-DRAFT-025 | STK-001, STK-002 | Laporan perlu menyimpan tingkat urgensi masalah. |
| REQ-DRAFT-026 | STK-005 | Manajer Fasilitas dapat memperbarui daftar ruangan jika ada ruangan baru. |
| REQ-DRAFT-027 | STK-003 | Administrator dapat menolak laporan jika judul tidak sesuai dengan deskripsi dan/atau kategori, laporan tidak memiliki deskripsi, atau lokasi tidak diketahui maupun salah. |
| REQ-DRAFT-028 | STK-003, STK-004 | Satu laporan tidak langsung ditugaskan ke lebih dari satu teknisi, tetapi lebih dari satu teknisi dapat dikerahkan jika teknisi mengubah status menjadi butuh bantuan dan disetujui administrator. |
| REQ-DRAFT-029 | STK-003 | Pembaruan progress oleh administrator perlu catatan alasan, contohnya teknisi sudah memberitahu administrator bahwa masalah selesai dan sudah diperiksa. |
| REQ-DRAFT-030 | STK-003 | Laporan ditutup otomatis setelah pelapor tidak memberi konfirmasi dalam 45 menit. |
| REQ-DRAFT-031 | STK-001, STK-002, STK-003, STK-004 | Notifikasi aplikasi dikirim saat masalah sudah ditangani, membutuhkan suku cadang baru, teknisi butuh bantuan, dan pekerjaan terjeda. |
| REQ-DRAFT-032 | STK-005 | Dashboard dapat difilter atau diurutkan berdasarkan terbaru, terlama, ruangan, dan kategori. |
| REQ-DRAFT-033 | STK-005 | Laporan ringkas mengandung ruangan masalah dan kategori masalah. |

## Alur Bisnis yang Ditemukan
1. Mahasiswa atau dosen login menggunakan akun kampus.
2. Mahasiswa atau dosen membuat laporan masalah fasilitas.
3. Sistem menyimpan laporan dengan kategori dan lokasi ruangan.
4. Administrator memeriksa laporan.
5. Administrator menolak laporan jika tidak valid, atau menugaskan laporan kepada teknisi jika valid.
6. Teknisi menangani laporan yang diberikan kepadanya.
7. Teknisi memperbarui progress pekerjaan.
8. Administrator juga dapat memperbarui progress teknisi.
9. Pelapor melihat progress dan dapat memberi komentar tambahan.
10. Teknisi menyelesaikan pekerjaan.
11. Pelapor diberi waktu 45 menit untuk memberikan konfirmasi.
12. Administrator menutup laporan.
13. Manajer Fasilitas melihat dashboard dan laporan ringkas.
14. Manajer Fasilitas memperbarui daftar ruangan jika ada ruangan baru.

## Data yang Ditemukan
1. Akun kampus pelapor.
2. Judul masalah.
3. Deskripsi masalah.
4. Kategori masalah fasilitas.
5. Lokasi ruangan dari daftar ruangan sistem.
6. (Dihapus) Bukti atau foto kerusakan ditiadakan.
7. Status laporan.
8. Progress pekerjaan.
9. Komentar pelapor.
10. Konfirmasi pelapor.
11. Data teknisi yang ditugaskan.
12. Notifikasi aplikasi.
13. Data ringkasan dashboard.
14. Tingkat urgensi masalah.
15. Alasan penolakan laporan.
16. Catatan alasan pembaruan progress oleh administrator.
17. Data daftar ruangan.

## Aturan Bisnis Awal
1. Pelapor mahasiswa dan dosen harus menggunakan akun kampus.
2. (Dihapus) Bukti atau foto kerusakan ditiadakan.
3. Teknisi bergerak setelah mendapat laporan yang diberikan kepadanya.
4. Pelapor memilih lokasi dari daftar ruangan yang disediakan sistem.
5. Administrator dapat menolak laporan tidak valid.
6. Teknisi dapat menggunakan status butuh bantuan, tertunda, atau menunggu suku cadang.
7. Pelapor dapat memberi komentar tambahan setelah laporan dibuat.
8. Notifikasi dikirim melalui aplikasi.
9. Pelapor memiliki waktu 45 menit untuk memberikan konfirmasi setelah pekerjaan selesai.
10. Administrator boleh menutup laporan tanpa konfirmasi pelapor.
11. Laporan ditutup otomatis jika pelapor tidak memberi konfirmasi dalam 45 menit.
12. Laporan dapat ditolak jika judul tidak sesuai dengan deskripsi dan/atau kategori.
13. Laporan dapat ditolak jika tidak memiliki deskripsi.
14. Laporan dapat ditolak jika lokasi tidak diketahui atau salah.
15. Lebih dari satu teknisi dapat dikerahkan hanya jika teknisi menyatakan butuh bantuan dan disetujui administrator.
16. Pembaruan progress oleh administrator harus memiliki catatan alasan.
17. Notifikasi dikirim saat masalah sudah ditangani, membutuhkan suku cadang baru, teknisi butuh bantuan, dan pekerjaan terjeda.
18. Manajer Fasilitas dapat memperbarui daftar ruangan jika ada ruangan baru.

## Kebutuhan yang Sebelumnya Belum Jelas dan Sudah Terjawab
1. REQ-DRAFT-003: Laporan perlu menyimpan tingkat urgensi.
2. REQ-DRAFT-006: Daftar ruangan dikelola oleh Manajer Fasilitas dan dapat diperbarui jika ada ruangan baru.
3. REQ-DRAFT-008: Alasan penolakan laporan mencakup judul tidak sesuai dengan deskripsi dan/atau kategori, laporan tanpa deskripsi, serta lokasi tidak diketahui atau salah.
4. REQ-DRAFT-009: Satu laporan tidak langsung diberikan kepada lebih dari satu teknisi, tetapi lebih dari satu teknisi dapat dikerahkan jika teknisi mengubah status menjadi butuh bantuan dan disetujui administrator.
5. REQ-DRAFT-012: Pembaruan progress oleh administrator perlu catatan alasan.
6. REQ-DRAFT-017: Penutupan setelah 45 menit dilakukan otomatis.
7. REQ-DRAFT-019: Notifikasi dipicu oleh status masalah sudah ditangani, membutuhkan suku cadang baru, teknisi butuh bantuan, dan pekerjaan terjeda.
8. REQ-DRAFT-021: Dashboard dapat menampilkan data terbaru dan terlama serta berdasarkan ruangan atau kategori.
9. REQ-DRAFT-024: Laporan ringkas mengandung ruangan masalah dan kategori masalah.

## Kebutuhan yang Belum Jelas
Tidak ada untuk tahap elicitation awal. Kebutuhan yang sebelumnya belum jelas sudah dijawab oleh pengguna.

## ASUMSI
1. ASUMSI: Mahasiswa dan dosen memiliki kebutuhan pelaporan yang sama pada tahap awal.
2. ASUMSI: Notifikasi aplikasi berarti notifikasi ditampilkan di dalam sistem, bukan email atau kanal eksternal.
3. ASUMSI: Laporan ringkas tidak termasuk dashboard analitik tingkat lanjut.

## Quality Check
- Temuan kebutuhan memiliki ID `REQ-DRAFT`.
- Setiap temuan kebutuhan memiliki sumber stakeholder.
- Kebutuhan yang sebelumnya belum jelas sudah diberi jawaban.
- Temuan tidak keluar dari scope inception.
- Asumsi dipisahkan dari fakta.

## Human Review
Manusia perlu memeriksa apakah kebutuhan awal sudah mewakili kondisi kampus sebelum masuk ke specification.

## Keputusan Human Review
Tanggapan berikut diberikan oleh pengguna pada 2 Juli 2026:
1. Kebutuhan awal sudah mewakili kondisi kampus.
