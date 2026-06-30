# Inception dan Stakeholder

## Tujuan
Memahami masalah awal, tujuan aplikasi, stakeholder, batasan scope, asumsi, dan pertanyaan terbuka sebelum requirement dibuat.

## Kapan Digunakan
Digunakan pada tahap paling awal proyek, saat ide aplikasi masih umum dan tim perlu memahami konteks masalah.

## Input
- `project-brief.md`
- `catatan-wawancara-awal.md`
- `daftar-stakeholder-awal.md`

## Langkah Kerja
1. Baca input.
2. Identifikasi masalah utama yang ingin diselesaikan.
3. Tuliskan tujuan proyek.
4. Daftarkan stakeholder dan kepentingannya.
5. Tentukan scope awal dan hal yang berada di luar scope.
6. Tandai asumsi dan pertanyaan terbuka.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `01-inception-stakeholder.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai semua asumsi dengan label `ASUMSI`.
- Gunakan ID stakeholder seperti `STK-001`.
- Jangan melewati scope yang tertulis pada input.
- Jika ada informasi yang belum jelas, tulis sebagai pertanyaan terbuka.

## Quality Check
- Masalah utama tertulis jelas.
- Tujuan proyek dapat diukur secara sederhana.
- Stakeholder memiliki ID dan peran.
- Scope dan out of scope dipisahkan.
- Asumsi dan pertanyaan terbuka tidak dicampur dengan fakta.

## Kondisi Gagal
- Input tidak menjelaskan masalah proyek.
- Stakeholder utama tidak dapat dikenali.
- Scope terlalu kosong untuk dianalisis.

## Human Review
Manusia harus memeriksa apakah masalah, stakeholder, dan scope awal sudah sesuai dengan kondisi nyata.
