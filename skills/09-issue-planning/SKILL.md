# Issue Planning

## Tujuan
Mengubah requirement menjadi GitHub Issues yang kecil, jelas, dan dapat dikerjakan.

## Kapan Digunakan
Digunakan setelah requirement, prioritas, dan desain awal tersedia.

## Input
- `03-requirement-specification.md`
- `04-requirement-prioritization.md`
- `06-architecture-design.md`
- `07-api-design.md`
- `08-ui-design.md`

## Langkah Kerja
1. Baca input.
2. Pilih requirement sesuai prioritas.
3. Pecah requirement menjadi issue kecil.
4. Tulis judul issue, deskripsi, task teknis, acceptance criteria, dependency, dan label.
5. Hubungkan setiap issue ke ID requirement.
6. Periksa hasil.
7. Berhenti jika informasi tidak cukup.

## Output
- `09-github-issues.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement yang sudah ada.
- Satu issue harus memiliki hasil yang jelas.
- Jangan membuat issue di luar scope.

## Quality Check
- Setiap issue dapat dikerjakan secara mandiri atau memiliki dependency jelas.
- Acceptance criteria issue dapat diuji.
- Issue memiliki label prioritas atau jenis pekerjaan.
- Tidak ada requirement prioritas tinggi yang terlewat tanpa catatan.
- Ukuran issue tidak terlalu besar.

## Kondisi Gagal
- Requirement belum diprioritaskan.
- Desain terlalu kosong untuk membuat task teknis.
- Acceptance criteria tidak tersedia.

## Human Review
Manusia harus memeriksa apakah issue realistis untuk waktu dan kemampuan tim.
