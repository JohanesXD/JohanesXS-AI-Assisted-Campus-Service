# Campus Service Request and Maintenance System

## Ringkasan Studi Kasus
Campus Service Request and Maintenance System adalah aplikasi web untuk membantu mahasiswa dan dosen melaporkan masalah fasilitas kampus. Contoh masalah yang dapat dilaporkan meliputi proyektor rusak, internet bermasalah, AC tidak dingin, kursi rusak, alat laboratorium bermasalah, dan ruangan kotor.

Laporan yang masuk diperiksa oleh administrator. Jika laporan valid, administrator menugaskan laporan kepada teknisi. Teknisi memperbarui progress pekerjaan sampai masalah dinyatakan selesai. Pelapor dapat melihat perkembangan laporan, memberi komentar, memberi konfirmasi, atau menolak hasil pekerjaan dengan alasan jika masalah belum selesai. Administrator kemudian menutup laporan atau membuka ulang laporan sesuai ketentuan. Manajer Fasilitas dapat melihat dashboard, laporan ringkas, dan catatan tindak lanjut.

## Tujuan Proyek
1. Menyediakan sistem pelaporan masalah fasilitas kampus untuk mahasiswa dan dosen.
2. Membantu administrator memeriksa, menolak, mengedit, menggabungkan, menugaskan, dan menutup laporan.
3. Membantu teknisi melihat tugas, memperbarui progress, mengubah status pekerjaan, dan menyelesaikan pekerjaan.
4. Membantu pelapor memantau status, memberi komentar, mengubah atau membatalkan laporan dengan alasan, dan memberi konfirmasi.
5. Membantu Manajer Fasilitas melihat dashboard, laporan ringkas, unduhan laporan, dan catatan tindak lanjut.
6. Menjaga traceability dari requirement, desain, issue, implementasi, test, sampai deployment.

## Aktor Sistem

| Aktor | Tanggung Jawab Utama |
| --- | --- |
| Pelapor | Membuat laporan, melihat status, memberi komentar, mengubah atau membatalkan laporan dengan alasan, memberi konfirmasi, dan menolak hasil pekerjaan jika masalah belum selesai. |
| Administrator | Memeriksa laporan, menolak laporan tidak valid, mengedit data laporan dengan alasan, menggabungkan laporan duplikat, menugaskan teknisi, mengganti teknisi dengan persetujuan, dan menutup laporan. |
| Teknisi | Melihat tugas, memperbarui progress, mengubah status pekerjaan, meminta bantuan, memberi estimasi, dan menandai pekerjaan selesai. |
| Manajer Fasilitas | Melihat dashboard, laporan ringkas, mengunduh laporan, memperbarui daftar ruangan, dan memberi catatan tindak lanjut. |

## Fitur Wajib Proyek
1. Membuat laporan baru.
2. Melihat daftar dan detail laporan.
3. Mencari, menyaring, dan mengurutkan laporan.
4. Memeriksa laporan oleh administrator.
5. Menentukan kategori, lokasi, dan tingkat urgensi.
6. Menugaskan teknisi.
7. Mengubah status pekerjaan.
8. Menambahkan komentar atau catatan.
9. Menyimpan riwayat status dan alasan perubahan penting.
10. Menutup laporan dan membuka kembali laporan.
11. Menampilkan dashboard sederhana.
12. Menyediakan laporan ringkas untuk Manajer Fasilitas.

## Fitur Tidak Wajib atau Dibatasi
1. Upload foto bersifat opsional dan dapat ditunda jika memerlukan storage tambahan.
2. Email notification tidak termasuk scope awal.
3. Login menggunakan Google tidak termasuk scope awal.
4. QR code ruangan tidak termasuk scope awal.
5. AI untuk menentukan kategori tidak termasuk scope awal.
6. Inventory spare part dan vendor management tidak termasuk scope awal.

## Alur Status Dasar
1. `Submitted`
2. `Under Review`
3. `Assigned`
4. `In Progress`
5. `Resolved`
6. `Closed`

Status tambahan dapat digunakan untuk kebutuhan proyek, misalnya `Rejected`, `Cancelled`, `Waiting Reporter Confirmation`, `Reopened`, `Closed Auto`, atau `Closed Admin`, selama dijelaskan pada requirement, business rules, desain, dan test.

## Teknologi Target
1. Frontend: React.
2. Backend/API: Cloudflare Workers.
3. Database: Cloudflare D1.
4. Deployment: Cloudflare Workers atau Pages sesuai konfigurasi proyek.
5. Version control dan evidence: GitHub.

## Work Product

| Tahap | Output |
| --- | --- |
| Requirements | Inception, elicitation, specification, prioritization, validation, change impact analysis, dan traceability. |
| Design | Architecture design, database design, API design, UI flow, dan wireframe. |
| Planning | GitHub Issues dan rencana pengerjaan. |
| Coding | Source code, branch, commit, dan pull request. |
| Testing | Test plan, automated test, integration test, dan acceptance test. |
| Deployment | URL Cloudflare, bukti test, release note, dan known limitations. |
| AI Evidence | Prompt/invocation, output AI, human review, dan hasil final. |

## Aturan Penggunaan AI
1. AI digunakan untuk membantu pekerjaan kecil dan terstruktur.
2. Output AI harus diperiksa oleh manusia.
3. Keputusan akhir requirement, desain, kode, test, dan deployment tetap menjadi tanggung jawab manusia.
4. Perubahan hasil AI harus dicatat agar traceability tetap jelas.
5. Jangan membuat fitur di luar scope tanpa alasan dan human review.

## Minimum Ketentuan Proyek

| Item | Minimum |
| --- | ---: |
| Functional requirement | 12 |
| Non-functional requirement | 6 |
| Business rule | 5 |
| User story | 10 |
| Acceptance criteria | 2 untuk setiap user story |
| GitHub Issues | 10 |
| Pull Request | 6 |
| Automated test | 20 |
| Change request | 1 |
| Deployment | 1 URL publik |

## Referensi Dokumen Internal
Dokumen requirement dan hasil kerja awal proyek disimpan di:

- `docs/requirements/01-inception-stakeholder.md`
- `docs/requirements/02-elicitation-findings.md`
- `docs/requirements/02-elicitation-questions.md`
- `docs/requirements/03-requirement-specification.md`
- `docs/requirements/04-requirement-prioritization.md`
- `docs/requirements/05-requirement-validation.md`
- `docs/requirements/05-change-impact-analysis.md`

Reusable AI skills proyek disimpan di folder `skills/`.
