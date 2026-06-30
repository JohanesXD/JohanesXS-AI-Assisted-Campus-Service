# Automated Testing

## Tujuan
Membuat unit test dan integration test untuk memeriksa perilaku kode secara otomatis.

## Kapan Digunakan
Digunakan setelah implementasi tersedia dan rencana pengujian sudah dibuat.

## Input
- Kode proyek yang sudah ada
- `12-test-plan.md`
- `09-github-issues.md`
- `03-requirement-specification.md`

## Langkah Kerja
1. Baca input.
2. Pilih skenario yang cocok untuk unit test dan integration test.
3. Pahami framework test yang digunakan proyek.
4. Buat atau ubah test sesuai skenario.
5. Jalankan test yang relevan.
6. Catat hasil test.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- Perubahan file test proyek
- `13-automated-testing-notes.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement dan ID issue.
- Jangan mengubah kode produksi kecuali diperlukan untuk membuat kode dapat diuji.
- Jangan membuat test di luar scope requirement.

## Quality Check
- Test memeriksa expected result yang jelas.
- Test memiliki nama yang mudah dipahami.
- Test mencakup kasus normal dan kasus gagal yang penting.
- Test dapat dijalankan ulang.
- Hasil test dicatat.

## Kondisi Gagal
- Framework test tidak tersedia atau tidak jelas.
- Kode yang akan diuji tidak tersedia.
- Skenario test tidak dapat diotomatisasi tanpa keputusan tambahan.

## Human Review
Manusia harus memeriksa apakah test otomatis benar-benar mewakili perilaku yang diharapkan.
