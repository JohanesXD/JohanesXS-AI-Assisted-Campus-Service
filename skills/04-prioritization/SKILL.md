# Prioritization

## Tujuan
Menentukan prioritas requirement dan membantu menyelesaikan konflik kebutuhan antar stakeholder.

## Kapan Digunakan
Digunakan setelah requirement ditulis, sebelum masuk ke desain atau perencanaan issue.

## Input
- `03-requirement-specification.md`
- `01-inception-stakeholder.md`
- `catatan-konflik-kebutuhan.md`

## Langkah Kerja
1. Baca input.
2. Daftarkan semua requirement yang akan diprioritaskan.
3. Nilai kebutuhan berdasarkan nilai bisnis, urgensi, risiko, dan ketergantungan.
4. Kelompokkan prioritas menjadi `Must`, `Should`, `Could`, dan `Won't`.
5. Identifikasi konflik kebutuhan.
6. Berikan opsi penyelesaian konflik.
7. Periksa hasil.
8. Berhenti jika informasi tidak cukup.

## Output
- `04-requirement-prioritization.md`

## Aturan
- Jangan membuat fakta baru.
- Tandai asumsi dengan label `ASUMSI`.
- Gunakan ID requirement yang sudah ada.
- Jangan menghapus requirement tanpa alasan.
- Jangan melewati scope.

## Quality Check
- Semua requirement memiliki prioritas.
- Alasan prioritas tertulis singkat.
- Konflik kebutuhan ditautkan ke ID requirement.
- Opsi penyelesaian konflik tidak memihak tanpa alasan.
- Requirement prioritas tinggi mendukung tujuan proyek.

## Kondisi Gagal
- Requirement belum memiliki ID.
- Tidak ada informasi nilai bisnis atau urgensi.
- Konflik tidak dapat dianalisis karena sumbernya tidak jelas.

## Human Review
Manusia harus menyetujui prioritas akhir dan keputusan konflik kebutuhan.
