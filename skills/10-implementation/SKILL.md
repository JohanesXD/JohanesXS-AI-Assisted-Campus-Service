# Implementation

## Tujuan
Mengerjakan satu issue menjadi kode sesuai requirement dan acceptance criteria.

## Kapan Digunakan
Digunakan saat tim memilih satu GitHub Issue untuk diimplementasikan.

## Input
- `09-github-issues.md`
- `03-requirement-specification.md`
- `06-architecture-design.md`
- `07-database-design.md`
- `07-api-design.md`
- `08-ui-design.md`
- Kode proyek yang sudah ada

## Langkah Kerja
1. Baca input.
2. Pilih satu issue yang akan dikerjakan.
3. Pahami file kode yang terkait.
4. Buat perubahan kode paling kecil yang memenuhi acceptance criteria.
5. Tambahkan validasi atau penanganan error jika diperlukan requirement.
6. Jalankan pemeriksaan yang tersedia.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- Perubahan kode proyek
- `10-implementation-notes.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement dan ID issue.
- Jangan mengubah bagian kode yang tidak terkait.
- Jangan melewati scope issue.

## Quality Check
- Kode memenuhi acceptance criteria issue.
- Perubahan kode kecil dan terarah.
- Tidak ada fitur tambahan di luar issue.
- Error umum ditangani.
- Pemeriksaan atau test yang relevan dijalankan jika tersedia.

## Kondisi Gagal
- Issue tidak jelas.
- Kode proyek tidak tersedia.
- Acceptance criteria tidak dapat diuji.
- Perubahan membutuhkan keputusan desain baru yang belum disetujui.

## Human Review
Manusia harus memeriksa kode, keputusan teknis, dan hasil pemeriksaan sebelum digabungkan.
