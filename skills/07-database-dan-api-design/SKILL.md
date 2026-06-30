# Database dan API Design

## Tujuan
Membuat rancangan tabel database dan endpoint API berdasarkan requirement dan arsitektur.

## Kapan Digunakan
Digunakan setelah arsitektur utama aplikasi ditentukan.

## Input
- `03-requirement-specification.md`
- `06-architecture-design.md`
- `aturan-bisnis.md`

## Langkah Kerja
1. Baca input.
2. Identifikasi data utama yang perlu disimpan.
3. Buat daftar tabel, kolom, tipe data, primary key, dan relasi.
4. Buat daftar endpoint API, method, request, response, dan aturan akses.
5. Hubungkan tabel dan endpoint ke ID requirement.
6. Periksa hasil.
7. Berhenti jika informasi tidak cukup.

## Output
- `07-database-design.md`
- `07-api-design.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement yang sudah ada.
- Jangan menyimpan data yang tidak dibutuhkan requirement.
- Jangan membuat endpoint di luar scope.

## Quality Check
- Setiap tabel memiliki tujuan.
- Relasi antar tabel jelas.
- Endpoint memiliki method dan path.
- Request dan response API ditulis cukup rinci.
- Desain database dan API mendukung requirement.

## Kondisi Gagal
- Requirement data tidak jelas.
- Aturan bisnis utama tidak tersedia.
- Hak akses pengguna belum diketahui untuk endpoint penting.

## Human Review
Manusia harus memeriksa struktur data, keamanan endpoint, dan kesesuaian dengan teknologi yang dipakai.
