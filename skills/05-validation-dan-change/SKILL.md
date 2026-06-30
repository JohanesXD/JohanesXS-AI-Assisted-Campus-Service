# Validation dan Change

## Tujuan
Memeriksa kualitas requirement dan menganalisis dampak perubahan requirement.

## Kapan Digunakan
Digunakan saat requirement perlu divalidasi atau ketika ada permintaan perubahan dari stakeholder.

## Input
- `03-requirement-specification.md`
- `04-requirement-prioritization.md`
- `change-request.md`

## Langkah Kerja
1. Baca input.
2. Periksa requirement dari sisi kelengkapan, konsistensi, kejelasan, dan kemampuan diuji.
3. Catat requirement yang bermasalah.
4. Jika ada change request, identifikasi requirement yang terdampak.
5. Analisis dampak perubahan terhadap scope, desain, database, API, UI, test, dan deployment.
6. Berikan rekomendasi terima, tunda, ubah, atau tolak.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `05-requirement-validation.md`
- `05-change-impact-analysis.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement yang sudah ada.
- Jangan menyetujui perubahan yang melewati scope tanpa catatan.
- Semua dampak perubahan harus ditulis jelas.

## Quality Check
- Requirement bermasalah memiliki alasan.
- Change request memiliki keputusan rekomendasi.
- Dampak perubahan mencakup area teknis dan non-teknis.
- Tidak ada requirement yang diubah tanpa jejak.
- Catatan validasi mudah ditindaklanjuti.

## Kondisi Gagal
- Requirement tidak tersedia.
- Change request tidak menjelaskan perubahan yang diminta.
- Dampak perubahan tidak dapat ditelusuri.

## Human Review
Manusia harus memutuskan apakah change request diterima dan kapan perubahan dikerjakan.
