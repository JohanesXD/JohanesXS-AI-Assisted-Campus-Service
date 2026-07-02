# 02 Elicitation Questions

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `outputs/01-inception-stakeholder.md`

## Tujuan Elicitation
Menggali kebutuhan stakeholder terkait pelaporan masalah fasilitas kampus, pemeriksaan laporan, penugasan teknisi, pembaruan progress, konfirmasi pelapor, penutupan laporan, notifikasi aplikasi, dan dashboard Manajer Fasilitas.

## Kelompok Stakeholder

| ID | Stakeholder | Kelompok Peran |
| --- | --- | --- |
| STK-001 | Mahasiswa | Pelapor |
| STK-002 | Dosen | Pelapor |
| STK-003 | Administrator | Pemeriksa dan pengelola laporan |
| STK-004 | Teknisi | Pelaksana perbaikan |
| STK-005 | Manajer Fasilitas | Pemantau layanan fasilitas |

## Pertanyaan untuk STK-001 Mahasiswa dan STK-002 Dosen

### Kebutuhan Pelaporan
1. Saat membuat laporan, informasi apa saja yang perlu Anda lihat agar yakin laporan berhasil dikirim?
2. Apakah pelapor perlu dapat mengubah laporan setelah dikirim?
3. Apakah pelapor perlu dapat membatalkan laporan?

### Kategori dan Lokasi
1. Kategori masalah fasilitas apa saja yang perlu tersedia selain proyektor, internet, AC, kursi, alat laboratorium, dan kebersihan ruangan?
2. Apakah daftar ruangan perlu dikelompokkan berdasarkan gedung, lantai, atau jenis ruangan?
3. Apa yang harus dilakukan jika ruangan yang dicari tidak ada dalam daftar?

### Progress dan Konfirmasi
1. Informasi progress apa saja yang perlu terlihat oleh pelapor?
2. Apakah pelapor perlu melihat nama teknisi yang menangani laporan?
3. Setelah teknisi menyelesaikan pekerjaan, bagaimana bentuk konfirmasi yang paling jelas bagi pelapor?
4. Jika pelapor tidak setuju bahwa pekerjaan sudah selesai, apa yang harus terjadi pada laporan?

### Notifikasi
1. Apakah notifikasi perlu ditampilkan sebagai daftar riwayat di aplikasi?
2. Apakah pelapor perlu menandai notifikasi sebagai sudah dibaca?

## Pertanyaan untuk STK-003 Administrator

### Pemeriksaan Laporan
1. Kriteria apa yang membuat laporan dianggap valid?
2. Apakah administrator perlu mengedit kategori, lokasi, atau deskripsi laporan sebelum menugaskan teknisi?
3. Apakah administrator perlu menggabungkan laporan yang duplikat?

### Penugasan Teknisi
1. Informasi apa yang dibutuhkan administrator untuk memilih teknisi?
2. Apakah administrator perlu melihat beban kerja teknisi sebelum menugaskan laporan?
3. Apakah administrator dapat mengganti teknisi setelah laporan berjalan?

### Pembaruan Progress Teknisi
1. Dalam kondisi apa administrator perlu memperbarui progress teknisi?
2. Apakah pelapor dan teknisi perlu menerima notifikasi saat administrator memperbarui progress?

### Penutupan Laporan
1. Kapan administrator boleh menutup laporan tanpa konfirmasi pelapor?
2. Data apa saja yang harus tersimpan saat laporan ditutup?

## Pertanyaan untuk STK-004 Teknisi

### Penerimaan Tugas
1. Informasi apa yang perlu dilihat teknisi saat menerima laporan?
2. Apakah teknisi perlu menerima notifikasi saat mendapat tugas baru?
3. Apakah teknisi dapat menolak atau mengembalikan tugas kepada administrator?

### Progress Pekerjaan
1. Apakah ada status progress lain selain butuh bantuan, tertunda, menunggu suku cadang, pekerjaan terjeda, dan masalah sudah ditangani?
2. Apakah teknisi perlu menambahkan catatan progress?
3. Apakah teknisi perlu mengunggah foto hasil pekerjaan? (Ditiadakan untuk efisiensi penyimpanan).
4. Apakah teknisi perlu memperkirakan waktu penyelesaian?

### Penyelesaian Pekerjaan
1. Informasi apa yang harus diisi teknisi saat menyatakan pekerjaan selesai?
2. Apa yang terjadi jika pelapor menolak hasil pekerjaan?
3. Apakah teknisi perlu melihat riwayat laporan sebelumnya untuk ruangan atau fasilitas yang sama?

## Pertanyaan untuk STK-005 Manajer Fasilitas

### Dashboard
1. Total masalah yang sudah diselesaikan perlu ditampilkan untuk periode apa: harian, mingguan, bulanan, atau semua waktu?
2. Chart kategori masalah yang paling sering muncul perlu ditampilkan dalam bentuk apa?
3. Apakah dashboard perlu menampilkan jumlah laporan baru, sedang diproses, tertunda, dan ditutup?

### Laporan Ringkas
1. Selain ruangan masalah dan kategori masalah, informasi apa lagi yang harus ada dalam laporan ringkas?
2. Apakah laporan ringkas perlu dapat diunduh?
3. Apakah laporan ringkas perlu menampilkan masalah yang paling lama belum selesai?
4. Apakah laporan ringkas perlu menampilkan teknisi atau unit yang menangani laporan?

## Pertanyaan Non-Functional untuk Semua Stakeholder
1. Siapa saja yang boleh mengakses sistem?
2. Apakah ada batasan perangkat, misalnya harus nyaman digunakan di ponsel?
3. Apakah ada kebutuhan keamanan khusus untuk data laporan?
4. Berapa cepat sistem diharapkan menampilkan perubahan status?
5. Berapa lama riwayat laporan perlu disimpan?
6. Apakah sistem harus tetap dapat digunakan saat jaringan kampus lambat?

## Pertanyaan yang Belum Jelas
1. Apakah kategori masalah dibuat tetap oleh sistem atau dapat ditambah administrator atau Manajer Fasilitas?
2. (Dihapus) Apakah bukti atau foto kerusakan dapat digunakan? (Tidak didukung).
3. Apakah Manajer Fasilitas hanya melihat data dan memperbarui daftar ruangan, atau dapat memberi catatan tindak lanjut?

## Pertanyaan yang Sudah Terjawab dari Elicitation Findings
1. Pelapor harus login menggunakan akun kampus.
2. Laporan berisi judul masalah, deskripsi, kategori, lokasi ruangan, dan tingkat urgensi (fitur bukti/foto ditiadakan).
3. (Dihapus) Bukti atau foto kerusakan ditiadakan.
4. Pelapor memilih lokasi dari daftar ruangan yang disediakan sistem.
5. Daftar ruangan dapat diperbarui oleh Manajer Fasilitas jika ada ruangan baru.
6. Administrator dapat menolak laporan jika judul tidak sesuai dengan deskripsi dan/atau kategori, laporan tanpa deskripsi, atau lokasi tidak diketahui maupun salah.
7. Satu laporan tidak langsung diberikan kepada lebih dari satu teknisi, tetapi lebih dari satu teknisi dapat dikerahkan jika teknisi mengubah status menjadi butuh bantuan dan disetujui administrator.
8. Pembaruan progress oleh administrator harus memiliki catatan alasan.
9. Jika pelapor tidak memberi konfirmasi dalam 45 menit, laporan ditutup otomatis.
10. Notifikasi aplikasi dipicu saat masalah sudah ditangani, membutuhkan suku cadang baru, teknisi butuh bantuan, dan pekerjaan terjeda.
11. Dashboard dapat difilter atau diurutkan berdasarkan terbaru, terlama, ruangan, dan kategori.
12. Laporan ringkas mengandung ruangan masalah dan kategori masalah.

## Quality Check
- Pertanyaan disusun sesuai stakeholder.
- Pertanyaan mencakup kebutuhan fungsional dan non-fungsional.
- Pertanyaan tidak keluar dari scope proyek.
- Pertanyaan yang belum jelas ditandai.
- Pertanyaan tidak mengubah jawaban yang sudah diberikan pengguna.

## Human Review
Manusia perlu memeriksa apakah pertanyaan elicitation ini sudah sesuai dengan konteks kampus dan tidak mengarahkan stakeholder pada jawaban tertentu.
