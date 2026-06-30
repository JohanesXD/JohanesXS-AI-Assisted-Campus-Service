# Code Review

## Tujuan
Memeriksa kode dan test untuk menemukan bug, risiko, ketidaksesuaian requirement, dan masalah kualitas.

## Kapan Digunakan
Digunakan setelah implementasi selesai dan sebelum kode digabungkan.

## Input
- Kode yang berubah
- `09-github-issues.md`
- `10-implementation-notes.md`
- `03-requirement-specification.md`
- Hasil test jika tersedia

## Langkah Kerja
1. Baca input.
2. Periksa apakah kode memenuhi acceptance criteria.
3. Cari bug, risiko keamanan, masalah validasi, dan kasus tepi.
4. Periksa apakah test mencakup perilaku penting.
5. Tulis temuan dengan tingkat prioritas.
6. Berikan rekomendasi perbaikan.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `11-code-review.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement dan ID issue.
- Fokus pada masalah yang dapat ditindaklanjuti.
- Jangan meminta perubahan di luar scope issue kecuali ada risiko besar.

## Quality Check
- Temuan memiliki lokasi kode atau bagian yang jelas.
- Temuan menjelaskan dampak masalah.
- Rekomendasi perbaikan spesifik.
- Test gap dicatat.
- Tidak mencampur opini gaya dengan bug penting.

## Kondisi Gagal
- Kode yang berubah tidak tersedia.
- Issue atau acceptance criteria tidak tersedia.
- Tidak ada cara menilai hubungan kode dengan requirement.

## Human Review
Manusia harus memutuskan temuan mana yang wajib diperbaiki sebelum merge.
