# Test Planning

## Tujuan
Membuat rencana pengujian berdasarkan requirement, risiko, dan acceptance criteria.

## Kapan Digunakan
Digunakan sebelum automated testing atau acceptance testing dibuat.

## Input
- `03-requirement-specification.md`
- `04-requirement-prioritization.md`
- `09-github-issues.md`
- `06-architecture-design.md`

## Langkah Kerja
1. Baca input.
2. Identifikasi fitur yang harus diuji.
3. Tentukan jenis test yang diperlukan.
4. Buat skenario test untuk requirement penting.
5. Tentukan data test, precondition, langkah, dan expected result.
6. Tandai risiko yang perlu perhatian khusus.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `12-test-plan.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement dan ID issue.
- Prioritaskan test untuk requirement `Must`.
- Jangan membuat skenario di luar scope.

## Quality Check
- Requirement penting memiliki skenario test.
- Expected result jelas dan dapat diverifikasi.
- Data test ditulis jika diperlukan.
- Risiko pengujian dicatat.
- Jenis test sesuai dengan kebutuhan.

## Kondisi Gagal
- Requirement tidak memiliki acceptance criteria.
- Prioritas requirement tidak tersedia.
- Alur sistem belum cukup jelas untuk diuji.

## Human Review
Manusia harus memeriksa apakah rencana test cukup untuk menilai kualitas aplikasi.
