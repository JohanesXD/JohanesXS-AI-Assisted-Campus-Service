# Acceptance Testing

## Tujuan
Menguji alur lengkap pengguna untuk memastikan aplikasi memenuhi acceptance criteria.

## Kapan Digunakan
Digunakan setelah fitur selesai diimplementasikan dan test dasar sudah tersedia.

## Input
- `03-requirement-specification.md`
- `09-github-issues.md`
- `12-test-plan.md`
- Aplikasi yang dapat dijalankan
- Data test penerimaan

## Langkah Kerja
1. Baca input.
2. Pilih alur pengguna berdasarkan user story dan acceptance criteria.
3. Siapkan data test.
4. Jalankan langkah pengujian dari awal sampai akhir.
5. Bandingkan hasil aktual dengan expected result.
6. Catat pass, fail, bug, dan bukti pengujian.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `14-acceptance-test-report.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement, ID user story, dan ID issue.
- Jangan menguji alur di luar scope.
- Catat hasil aktual apa adanya.

## Quality Check
- Setiap alur memiliki precondition dan langkah test.
- Expected result dan actual result ditulis.
- Status pass atau fail jelas.
- Bug ditautkan ke requirement atau issue.
- Bukti pengujian dicatat jika tersedia.

## Kondisi Gagal
- Aplikasi tidak dapat dijalankan.
- Acceptance criteria tidak tersedia.
- Data test tidak cukup untuk menjalankan alur.

## Human Review
Manusia harus memutuskan apakah hasil acceptance testing cukup untuk menerima fitur.
