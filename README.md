# Campus Service Request and Maintenance System

Aplikasi web berbasis Cloudflare Workers dan D1 Database yang digunakan untuk memantau, mengelola, dan menyelesaikan pelaporan masalah fasilitas di lingkungan kampus. Proyek ini dibangun sebagai bagian dari mata kuliah **Software Engineering** dengan bantuan AI (dari proses Requirements Engineering hingga Deployment). Projek ini memiliki 4 tipe akun yang bisa digunakan yakni: Pelapor, Admin, Teknisi dan Manajer fasilitas. Pelapor bisa berupa student atau dosen, Admin adalah staf yang berwenang dalam pengelolaan laporan masalah, Teknisi adalah teknisi yang terdaftar di sistem dengan perannya masing-masing, Manajer fasilitas adalah manajer yang melihat dashboard dari aplikasi web ini.

---

## 1. Format Pengumpulan

* **Nama**: Hongjoyo, Zacklee Johanes Fijey
* **NIM**: 105022310008
* **Kelas**: Software Engineer
* **Repository URL**: https://github.com/JohanesXD/JohanesXS-AI-Assisted-Campus-Service.git
* **Cloudflare URL**: https://ai-assisted-campus-service.jo-hongjoyo.workers.dev/
* **Commit terakhir**: ea116ee - ui: change active tab background to var(--accent) to prevent white-on-white text in dark mode
* **Jumlah test**: 113
* **AI yang digunakan**: Codex, Antigravity, Devin, Cursor, OpenCode, Kimi
* **Known limitations**: * **Autentikasi Sederhana**: Autentikasi saat ini didasarkan pada pencocokan email dan peran yang disimpan di database (tanpa enkripsi kata sandi yang kompleks atau integrasi sistem Single Sign-On (SSO) resmi Kampus seperti OAuth/SAML).
* **Tidak Ada Unggah Foto/Media**: Sistem saat ini hanya mendukung laporan dan komentar dalam bentuk teks. Belum ada fitur untuk mengunggah foto kerusakan fasilitas (misalnya integrasi dengan penyimpanan Cloudflare R2) untuk memverifikasi kerusakan secara visual.
* **Batas Waktu Konfirmasi Hardcoded**: Batas waktu konfirmasi otomatis setelah laporan diselesaikan oleh teknisi diset keras (hardcoded) selama 45 menit. Di sistem nyata, durasi ini idealnya dapat diatur secara dinamis oleh administrator.
* **Validasi Lokasi Fisik**: Penentuan lokasi masih bergantung pada kejujuran pelapor yang memilih dropdown ruangan secara manual. Belum ada validasi berbasis GPS atau pemindaian QR-Code ruangan untuk memastikan posisi fisik pelapor.
* **Teknisi Hanya Bisa Ditambah lewat sistem**: Teknisi hanya dapat bertambah lewat sistem, jadi jika ada teknisi yang tidak memiliki akun kampus teknisi maka tidak dapat di tambahkan atau di daftarkan.

---

## 2. Pertanyaan Refleksi

### 1. Bagian mana yang paling membantu ketika menggunakan AI?
> **Jawaban**: Bagian skill 1-11,15 karena hasil dari skill itu tinggal saya review

### 2. Kesalahan apa yang paling sering dibuat AI?
> **Jawaban**: Terkadang membuat fitur yang tidak diminta dan pembuatan fitur terhadap tidak sesuai

### 3. Fitur apa yang pernah dibuat AI tetapi tidak terdapat pada requirement?
> **Jawaban**: Fitur yang memperbolehkan administrator untuk melihat dan mengakses apa yang ada di manajer fasilitas

### 4. Test apa yang gagal dan apa penyebabnya?
> **Jawaban**: Test yang gagal adalah penambahan laporan tidak bisa dilaksanakan, penyebabnya adalah belum apply d1 migration campus-maintenance-db

### 5. Perubahan apa yang dilakukan setelah human review?
> **Jawaban**: Perbaikan kode, mengubah beberapa requirements seperti mengganti prioritas, menambah fitur untuk dashboard manajer fasilitas, menambah pergantian teknisi atau butuh bantuan teknisi

### 6. Mengapa output AI tidak boleh langsung dianggap benar?
> **Jawaban**: Karena seringkali jawaban ai tidak sesuai dengan keinginan kita, ai menjawab tanpa ada batasan dan memberikan jawaban yang tidak kita minta

### 7. Bagaimana traceability membantu proyek?
> **Jawaban**: Traceability membantu saya dalam melanjutkan projek di ai lain, karena dengan adanya traceability ai dapat memahami sudah sampai dimana projek kita

### 8. Apa yang akan diperbaiki jika proyek diulang?
> **Jawaban**: Requirement dan Desain
