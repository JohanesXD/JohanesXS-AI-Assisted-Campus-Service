# Architecture Design

## Tujuan
Menentukan bagian utama aplikasi, tanggung jawab setiap bagian, dan hubungan antar bagian.

## Kapan Digunakan
Digunakan setelah requirement cukup stabil dan sebelum desain database, API, UI, atau implementasi detail.

## Input
- `03-requirement-specification.md`
- `04-requirement-prioritization.md`
- `05-requirement-validation.md`

## Langkah Kerja
1. Baca input.
2. Identifikasi fitur utama dari requirement.
3. Tentukan komponen utama aplikasi.
4. Jelaskan tanggung jawab setiap komponen.
5. Jelaskan hubungan antar komponen.
6. Catat keputusan arsitektur dan alasannya.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `06-architecture-design.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement sebagai dasar keputusan.
- Jangan membuat komponen di luar kebutuhan.
- Jangan melewati scope.

## Quality Check
- Komponen utama mendukung requirement prioritas.
- Setiap komponen memiliki tanggung jawab jelas.
- Hubungan antar komponen mudah dipahami.
- Keputusan arsitektur memiliki alasan.
- Risiko arsitektur dicatat.

## Kondisi Gagal
- Requirement belum cukup jelas.
- Scope aplikasi belum diketahui.
- Tidak ada informasi batasan teknologi atau platform.

## Human Review
Manusia harus memeriksa apakah arsitektur sesuai kemampuan tim, waktu, dan teknologi yang tersedia.
