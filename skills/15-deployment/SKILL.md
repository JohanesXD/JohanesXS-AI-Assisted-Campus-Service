# Deployment

## Tujuan
Mempublikasikan aplikasi ke lingkungan tujuan dan memeriksa hasil deployment.

## Kapan Digunakan
Digunakan setelah fitur lulus review dan pengujian yang diperlukan.

## Input
- Kode proyek final
- `14-acceptance-test-report.md`
- Dokumentasi konfigurasi deployment
- Daftar environment variable
- Catatan versi rilis

## Langkah Kerja
1. Baca input.
2. Periksa kesiapan kode, konfigurasi, environment variable, dan dependency.
3. Jalankan proses build jika diperlukan.
4. Jalankan proses deployment sesuai dokumentasi proyek.
5. Verifikasi aplikasi pada lingkungan tujuan.
6. Catat URL, versi, status, dan masalah yang ditemukan.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `15-deployment-report.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement atau ID release jika tersedia.
- Jangan mengubah konfigurasi produksi tanpa persetujuan.
- Jangan melewati scope rilis.

## Quality Check
- Build berhasil atau alasan gagal dicatat.
- Deployment memiliki target lingkungan yang jelas.
- URL atau lokasi hasil deployment dicatat.
- Pemeriksaan dasar aplikasi dilakukan.
- Masalah deployment ditulis dengan langkah reproduksi.

## Kondisi Gagal
- Konfigurasi deployment tidak tersedia.
- Environment variable penting tidak diketahui.
- Build gagal dan tidak bisa diperbaiki tanpa keputusan manusia.
- Akses deployment tidak tersedia.

## Human Review
Manusia harus memeriksa konfigurasi rahasia, target deployment, dan hasil akhir sebelum aplikasi dipakai pengguna.
