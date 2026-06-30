# Specification

## Tujuan
Membuat functional requirement, non-functional requirement, user story, dan acceptance criteria dari hasil elicitation.

## Kapan Digunakan
Digunakan setelah kebutuhan stakeholder terkumpul dan perlu ditulis dalam bentuk requirement yang rapi.

## Input
- `01-inception-stakeholder.md`
- `02-elicitation-findings.md`
- `02-elicitation-questions.md`

## Langkah Kerja
1. Baca input.
2. Ubah temuan kebutuhan menjadi functional requirement.
3. Ubah batasan kualitas menjadi non-functional requirement.
4. Buat user story untuk kebutuhan pengguna.
5. Buat acceptance criteria untuk setiap requirement yang siap diuji.
6. Tandai requirement yang masih belum jelas.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `03-requirement-specification.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement seperti `FR-001`, `NFR-001`, dan `US-001`.
- Setiap user story harus terhubung ke requirement.
- Jangan melewati scope.

## Quality Check
- Functional requirement berisi perilaku sistem.
- Non-functional requirement berisi kualitas atau batasan sistem.
- User story memakai format peran, tujuan, dan manfaat.
- Acceptance criteria dapat diuji.
- Setiap requirement memiliki ID unik.

## Kondisi Gagal
- Temuan elicitation tidak cukup untuk membuat requirement.
- Requirement penting tidak memiliki sumber.
- Acceptance criteria tidak dapat dibuat karena kebutuhan terlalu kabur.

## Human Review
Manusia harus memeriksa apakah requirement benar-benar mewakili kebutuhan stakeholder.
