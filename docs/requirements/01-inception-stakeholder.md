# 01 Inception dan Stakeholder

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
Deskripsi proyek dari pengguna pada 29 Juni 2026.
Tambahan klarifikasi stakeholder dan pertanyaan terbuka dari pengguna pada 29 Juni 2026.

## Masalah Utama
Mahasiswa atau dosen membutuhkan cara yang jelas untuk melaporkan masalah fasilitas kampus, seperti proyektor rusak, internet bermasalah, AC tidak dingin, kursi rusak, alat laboratorium bermasalah, atau ruangan kotor.

Saat ini masalah fasilitas perlu diterima, diperiksa, diberikan kepada teknisi, dipantau progresnya, dikonfirmasi oleh pelapor, lalu ditutup oleh administrator.

## Tujuan Proyek
1. Menyediakan sistem untuk mahasiswa atau dosen agar dapat membuat laporan masalah fasilitas kampus.
2. Membantu administrator memeriksa laporan dan menugaskannya kepada teknisi.
3. Membantu teknisi memperbarui progres perbaikan sampai pekerjaan selesai.
4. Membantu pelapor melihat perkembangan laporan dan memberikan konfirmasi.
5. Membantu administrator menutup laporan setelah proses selesai.
6. Membantu manajer fasilitas melihat dashboard dan laporan ringkas.

## Stakeholder

| ID | Stakeholder | Peran | Kepentingan |
| --- | --- | --- | --- |
| STK-001 | Mahasiswa | Pelapor | Melaporkan masalah fasilitas kampus dan melihat perkembangan laporan. |
| STK-002 | Dosen | Pelapor | Melaporkan masalah fasilitas kampus dan melihat perkembangan laporan. |
| STK-003 | Administrator | Pemeriksa dan pengelola laporan | Memeriksa laporan, memberikan laporan kepada teknisi, memperbarui progress teknisi, dan menutup laporan. |
| STK-004 | Teknisi | Pelaksana perbaikan | Menerima tugas perbaikan dan memperbarui progres sampai pekerjaan selesai. |
| STK-005 | Manajer Fasilitas | Pemantau layanan fasilitas | Melihat dashboard dan laporan ringkas terkait permintaan layanan fasilitas kampus. |

## Scope Awal
Sistem mencakup:
1. Pembuatan laporan masalah fasilitas oleh mahasiswa atau dosen.
2. Kategori contoh masalah fasilitas, seperti proyektor, internet, AC, kursi, alat laboratorium, dan kebersihan ruangan.
3. Pemeriksaan laporan oleh administrator.
4. Penugasan laporan kepada teknisi.
5. Pembaruan progres pekerjaan oleh teknisi.
6. Pemantauan perkembangan laporan oleh pelapor.
7. Konfirmasi dari pelapor setelah pekerjaan selesai.
8. Penutupan laporan oleh administrator.
9. Pembaruan progress teknisi oleh administrator.
10. Dashboard dan laporan ringkas untuk manajer fasilitas.
11. Pemilihan lokasi fasilitas dari daftar ruangan yang disediakan sistem.
12. Notifikasi perubahan status melalui aplikasi.

## Di Luar Scope Awal
Hal berikut belum termasuk scope karena belum disebutkan pada input:
1. Sistem pembayaran atau biaya perbaikan.
2. Inventaris lengkap fasilitas kampus.
3. Pengadaan barang atau suku cadang.
4. Integrasi dengan sistem akademik kampus.
5. Integrasi dengan email, WhatsApp, atau notifikasi eksternal.
6. Penilaian kinerja teknisi.
7. Dashboard analitik tingkat lanjut di luar laporan ringkas manajer fasilitas.

## Alur Proses Awal
1. Mahasiswa atau dosen membuat laporan masalah fasilitas.
2. Administrator memeriksa laporan.
3. Administrator memberikan laporan kepada teknisi.
4. Teknisi memperbarui progres pekerjaan.
5. Administrator dapat memperbarui progress teknisi.
6. Teknisi menyelesaikan pekerjaan.
7. Pelapor melihat perkembangan dan memberikan konfirmasi.
8. Administrator menutup laporan.
9. Manajer fasilitas melihat dashboard dan laporan ringkas.

## ASUMSI
1. ASUMSI: Mahasiswa dan dosen menggunakan sistem sebagai pelapor dengan hak akses yang sama pada tahap awal.
2. ASUMSI: Administrator memiliki hak untuk memeriksa, menugaskan, memperbarui progress teknisi, dan menutup laporan.
3. ASUMSI: Teknisi hanya menangani laporan yang diberikan kepadanya.
4. ASUMSI: Konfirmasi pelapor diperlukan sebelum administrator menutup laporan.
5. ASUMSI: Satu laporan ditangani oleh satu teknisi pada tahap awal.

## Pertanyaan Terbuka yang Sudah Terjawab
1. Apakah pelapor harus login menggunakan akun kampus?
   - Jawaban: Iya, pelapor mahasiswa maupun dosen harus menggunakan akun kampus.
2. Data apa saja yang wajib diisi saat membuat laporan?
   - Jawaban: Judul masalah, deskripsi, dan kategori masalah fasilitas seperti proyektor, internet, AC, alat laboratorium, dan sebagainya.
3. Apakah laporan harus menyertakan foto atau bukti kerusakan?
   - Jawaban: Tidak harus, tetapi jika tersedia maka pelapor dapat menyertakan bukti atau foto kerusakan.
4. Apakah lokasi fasilitas menggunakan daftar ruangan tetap atau input manual?
   - Jawaban: Iya, lokasi fasilitas menggunakan daftar ruangan manual.
5. Apakah administrator dapat menolak laporan yang tidak valid?
   - Jawaban: Iya.
6. Apakah teknisi dapat mengubah status menjadi butuh bantuan, tertunda, atau menunggu suku cadang?
   - Jawaban: Iya.
7. Apakah pelapor dapat memberi komentar tambahan setelah laporan dibuat?
   - Jawaban: Iya.
8. Apakah sistem perlu mengirim notifikasi saat status laporan berubah?
   - Jawaban: Iya.
9. Berapa lama pelapor diberi waktu untuk memberikan konfirmasi setelah teknisi menyelesaikan pekerjaan?
   - Jawaban: 45 menit.
10. Apakah administrator boleh menutup laporan tanpa konfirmasi pelapor?
   - Jawaban: Iya.

## Pertanyaan Terbuka yang Masih Perlu Klarifikasi
Tidak ada untuk tahap inception. Semua pertanyaan terbuka awal sudah dijawab.

## Klarifikasi Tambahan
1. Daftar ruangan manual berarti pengguna memilih lokasi dari daftar ruangan yang disediakan sistem.
2. Dashboard Manajer Fasilitas menampilkan total masalah yang sudah diselesaikan, chart kategori masalah yang paling sering muncul, dan laporan ringkas.
3. Notifikasi dikirim melalui aplikasi.

## Quality Check
- Masalah utama sudah tertulis jelas.
- Tujuan proyek sudah dapat diukur secara sederhana.
- Stakeholder memiliki ID dan peran.
- Scope dan di luar scope sudah dipisahkan.
- Asumsi dan pertanyaan terbuka tidak dicampur dengan fakta.

## Human Review
Bagian yang perlu diperiksa manusia:
1. Apakah stakeholder sudah lengkap.
2. Apakah scope awal sesuai kebutuhan kampus.
3. Apakah asumsi dapat diterima.
4. Apakah pertanyaan terbuka yang tersisa perlu dijawab sebelum masuk ke elicitation.
