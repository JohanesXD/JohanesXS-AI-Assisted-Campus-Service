# Elicitation

## Tujuan
Menyusun pertanyaan elicitation dan menemukan kebutuhan stakeholder berdasarkan konteks proyek.

## Kapan Digunakan
Digunakan setelah stakeholder dan scope awal diketahui, sebelum requirement ditulis secara formal.

## Input
- `01-inception-stakeholder.md`
- `catatan-wawancara.md`
- `dokumen-proses-bisnis.md`

## Langkah Kerja
1. Baca input.
2. Kelompokkan stakeholder berdasarkan peran.
3. Susun pertanyaan untuk menggali kebutuhan, masalah, batasan, data, aturan bisnis, dan alur kerja.
4. Catat jawaban atau kebutuhan yang sudah ditemukan.
5. Tandai kebutuhan yang belum jelas.
6. Periksa hasil.
7. Berhenti jika informasi tidak cukup.

## Output
- `02-elicitation-questions.md`
- `02-elicitation-findings.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID stakeholder seperti `STK-001`.
- Gunakan ID kebutuhan awal seperti `REQ-DRAFT-001`.
- Jangan melewati scope.

## Quality Check
- Pertanyaan disusun sesuai stakeholder.
- Pertanyaan mencakup kebutuhan fungsional dan non-fungsional.
- Temuan kebutuhan memiliki sumber stakeholder.
- Kebutuhan yang belum jelas ditandai.
- Tidak ada pertanyaan yang keluar dari scope proyek.

## Kondisi Gagal
- Tidak ada stakeholder yang bisa diberi pertanyaan.
- Input terlalu sedikit untuk membuat pertanyaan yang relevan.
- Scope proyek tidak tersedia.

## Human Review
Manusia harus memeriksa apakah pertanyaan elicitation sesuai konteks dan tidak mengarahkan jawaban stakeholder.
