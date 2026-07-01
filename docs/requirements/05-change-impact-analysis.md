# 05 Change Impact Analysis

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `outputs/03-requirement-specification.md`
- `outputs/04-requirement-prioritization.md`
- Klarifikasi pengguna pada 30 Juni 2026

## Change Request
File `change-request.md` tidak ditemukan.

ASUMSI: Change request yang dianalisis adalah klarifikasi pengguna pada 30 Juni 2026 terhadap requirement yang sebelumnya belum dispesifikasikan, yaitu:

1. Pelapor dapat mengubah laporan dengan alasan.
2. Pelapor dapat membatalkan laporan dengan alasan.
3. Daftar ruangan dikelompokkan berdasarkan gedung dan lantai.
4. Pelapor dapat menolak hasil pekerjaan dengan alasan dan laporan dapat dibuka ulang sesuai ketentuan administrator.
5. Notifikasi memiliki riwayat dan status sudah dibaca.
6. Administrator dapat mengedit kategori, lokasi, atau deskripsi dengan alasan.
7. Administrator dapat menggabungkan laporan duplikat.
8. Administrator dapat mengganti teknisi setelah laporan berjalan dengan persetujuan teknisi.
9. Teknisi dapat menyertakan URL foto hasil pekerjaan atau memperkirakan waktu penyelesaian dengan penjelasan.
10. Laporan ringkas dapat diunduh.
11. Manajer Fasilitas dapat memberi catatan tindak lanjut dengan alasan.

## Requirement Terdampak

| Perubahan | Requirement Baru atau Terdampak | Prioritas |
| --- | --- | --- |
| Ubah laporan dengan alasan dan validasi ulang admin | FR-031, FR-032, FR-033, NFR-004, US-015 | Should, Must |
| Batalkan laporan dengan alasan | FR-034, NFR-004, US-015 | Should |
| Kelompok gedung dan lantai | FR-035, FR-006 | Should |
| Tolak hasil pekerjaan dan buka ulang | FR-036, FR-018, FR-019, FR-020, FR-021, NFR-004, US-016 | Must |
| Riwayat notifikasi dan status baca | FR-037, FR-022, FR-023, US-019 | Should |
| Edit laporan oleh administrator | FR-038, FR-007, FR-008, FR-009, NFR-004, US-017 | Should |
| Gabungkan laporan duplikat | FR-039, NFR-004, US-017 | Should |
| Ganti teknisi dengan persetujuan | FR-040, FR-010, FR-011, NFR-004, US-017 | Should |
| URL foto hasil pekerjaan atau estimasi waktu | FR-041, FR-012, FR-014, US-018 | Should |
| Unduh laporan ringkas | FR-042, FR-028, FR-029, US-020 | Should |
| Catatan tindak lanjut Manajer Fasilitas | FR-043, FR-028, FR-029, US-020 | Should |

## Dampak Scope

| Area | Dampak | Catatan |
| --- | --- | --- |
| Scope requirement | Bertambah | Requirement formal bertambah dari `FR-001` sampai `FR-030` menjadi `FR-001` sampai `FR-043`. |
| Scope versi awal | Bertambah terbatas | `FR-036` masuk Must karena memengaruhi kebenaran penutupan laporan. Sebagian fitur lain dapat menjadi Should. |
| Scope teknis | Bertambah | Perlu riwayat perubahan, status tambahan, relasi duplikat, notifikasi terbaca, dan catatan tindak lanjut. |
| Risiko scope creep | Rendah sampai sedang | Upload foto diputuskan tetap opsional dan memakai URL, sedangkan unduhan laporan memakai CSV. |

## Dampak Desain Arsitektur

| Area | Dampak |
| --- | --- |
| Modul request lifecycle | Perlu state machine yang menangani submitted, under review, assigned, in progress, resolved, waiting confirmation, reopened, cancelled, rejected, dan closed. |
| Modul audit trail | Perlu mencatat alasan perubahan, pembatalan, edit admin, penolakan hasil, penggantian teknisi, dan catatan tindak lanjut. |
| Modul notification | Perlu mendukung riwayat notifikasi dan status sudah dibaca. |
| Modul reporting | Perlu mendukung export laporan ringkas dan catatan tindak lanjut. |
| Modul room management | Perlu model gedung, lantai, dan ruangan. |
| Modul assignment | Perlu mekanisme penggantian teknisi dengan persetujuan. |

## Dampak Database

| Perubahan | Dampak Database |
| --- | --- |
| Ubah dan batalkan laporan | Tambah tabel atau kolom riwayat perubahan laporan, alasan perubahan, alasan pembatalan, dan status `cancelled` atau sejenisnya. |
| Gedung dan lantai | Tabel room perlu kolom `building` dan `floor`, atau tabel terpisah untuk building, floor, room. |
| Penolakan hasil dan reopen | Tambah status laporan, alasan penolakan hasil, riwayat reopen, dan aktor yang memutuskan. |
| Riwayat notifikasi | Tambah tabel notifications dengan `recipient_id`, `message`, `read_at`, `created_at`, dan referensi laporan. |
| Edit admin | Tambah audit trail untuk perubahan kategori, lokasi, atau deskripsi serta alasan edit. |
| Laporan duplikat | Tambah `parent_request_id` atau tabel `request_duplicates`. |
| Penggantian teknisi | Tambah tabel assignment history dan status persetujuan penggantian. |
| URL foto atau estimasi teknisi | Tambah kolom estimasi, penjelasan, dan URL foto hasil pekerjaan jika tersedia. Tidak perlu menyimpan file foto asli. |
| Unduh laporan ringkas | Tidak wajib menambah tabel jika unduhan dihasilkan dari query. |
| Catatan tindak lanjut | Tambah tabel manager follow-up notes dengan alasan, pembuat, dan waktu. |

## Dampak API

| Perubahan | Endpoint atau Perilaku API yang Dibutuhkan |
| --- | --- |
| Ubah laporan | `PATCH /api/requests/:id` dengan alasan perubahan dan validasi role pelapor. |
| Validasi ulang perubahan | Endpoint admin untuk menerima atau menutup laporan yang berubah. |
| Batalkan laporan | `POST /api/requests/:id/cancel` dengan alasan. |
| Tolak hasil pekerjaan | `POST /api/requests/:id/reject-resolution` dengan alasan. |
| Buka ulang laporan | `POST /api/requests/:id/reopen` oleh administrator. |
| Riwayat notifikasi | `GET /api/notifications` dan `POST /api/notifications/:id/read`. |
| Edit admin | `PATCH /api/admin/requests/:id` dengan alasan edit. |
| Gabungkan duplikat | `POST /api/admin/requests/:id/merge` dengan referensi laporan utama. |
| Ganti teknisi | Endpoint pengajuan dan persetujuan penggantian teknisi oleh teknisi lama dan teknisi baru. |
| URL foto hasil atau estimasi | Endpoint update progress teknisi dengan penjelasan dan URL foto jika digunakan. |
| Unduh laporan ringkas | `GET /api/reports/summary.csv` atau endpoint serupa. |
| Catatan tindak lanjut | Endpoint untuk membuat dan melihat catatan tindak lanjut Manajer Fasilitas. |

## Dampak UI

| Perubahan | Dampak UI |
| --- | --- |
| Ubah laporan | Form edit laporan dan field alasan perubahan. |
| Batalkan laporan | Tombol batalkan dan dialog alasan pembatalan. |
| Gedung dan lantai | Dropdown atau pilihan bertingkat gedung, lantai, dan ruangan. |
| Tolak hasil pekerjaan | Tombol tolak hasil dan form alasan saat laporan resolved. |
| Riwayat notifikasi | Halaman atau panel notification center dengan status dibaca. |
| Edit admin | Form admin untuk edit kategori, lokasi, deskripsi, dan alasan. |
| Gabungkan duplikat | UI pilih laporan utama dan konfirmasi penggabungan. |
| Ganti teknisi | UI pengajuan penggantian dan UI persetujuan untuk teknisi lama serta teknisi baru. |
| URL foto hasil atau estimasi | Form update progress teknisi berisi estimasi, penjelasan, dan URL foto opsional. |
| Unduh laporan ringkas | Tombol unduh pada halaman laporan ringkas. |
| Catatan tindak lanjut | Form catatan tindak lanjut dan daftar catatan pada laporan ringkas atau detail laporan. |

## Dampak Test

| Jenis Test | Dampak |
| --- | --- |
| Unit test | Tambah validasi alasan wajib, status transition, permission role, dan format export. |
| Integration test | Tambah test API untuk edit, cancel, reopen, merge duplicate, notification read, dan technician reassignment. |
| Acceptance test | Tambah skenario pelapor menolak hasil pekerjaan, admin membuka ulang, dan Manajer Fasilitas memberi catatan tindak lanjut. |
| Regression test | Pastikan alur utama submitted sampai closed tetap berjalan setelah status baru ditambahkan. |

## Dampak Deployment

| Area | Dampak |
| --- | --- |
| Migration D1 | Perlu migration baru untuk tabel riwayat, notifikasi, ruangan, assignment history, dan catatan tindak lanjut. |
| Cloudflare free tier | Aman untuk fitur berbasis D1 dan Worker. Foto hasil pekerjaan memakai URL sehingga tidak membutuhkan storage file tambahan pada versi awal. |
| CI/CD | Test bertambah, tetapi tidak mengubah strategi deployment. |
| Data seed | Perlu seed gedung, lantai, ruangan, kategori, role, dan teknisi contoh untuk pengujian. |

## Risiko

| Risiko | Tingkat | Mitigasi |
| --- | --- | --- |
| Status laporan menjadi terlalu kompleks | Tinggi | Definisikan state machine sebelum desain database dan API. |
| Upload foto memperbesar scope teknis | Rendah | Jadikan opsional dan gunakan URL, bukan penyimpanan file asli. |
| Audit trail tidak lengkap | Sedang | Buat tabel riwayat yang dipakai semua aksi penting. |
| Penggabungan duplikat menghilangkan data | Sedang | Jangan hapus laporan duplikat; simpan relasi ke laporan utama. |
| Penggantian teknisi membingungkan | Sedang | Simpan persetujuan teknisi lama dan teknisi baru sebelum assignment berubah. |

## Rekomendasi Keputusan

| Perubahan | Rekomendasi | Alasan |
| --- | --- | --- |
| FR-031 sampai FR-033 | Terima | Membuat perubahan laporan tetap terkendali oleh validasi administrator. |
| FR-034 | Terima | Pembatalan dengan alasan menjaga riwayat dan mengurangi laporan tidak perlu. |
| FR-035 | Terima | Membantu pemilihan lokasi dan sesuai klarifikasi pengguna. |
| FR-036 | Terima | Penting agar laporan tidak ditutup jika pekerjaan belum benar-benar selesai. |
| FR-037 | Terima bertahap | Berguna, tetapi bisa dibangun setelah notifikasi dasar. |
| FR-038 sampai FR-040 | Terima bertahap | Penting untuk admin, tetapi perlu audit trail dan aturan persetujuan. |
| FR-041 | Terima dengan perubahan | Estimasi waktu diterima; foto hasil pekerjaan tetap opsional dan disimpan sebagai URL untuk menghemat storage file. |
| FR-042 | Terima | Format unduhan laporan ringkas menggunakan CSV. |
| FR-043 | Terima | Sudah dinaikkan menjadi Should oleh human review. |

## Quality Check
- Requirement terdampak ditautkan ke ID requirement.
- Dampak mencakup scope, desain, database, API, UI, test, dan deployment.
- Tidak ada requirement yang diubah tanpa jejak.
- Rekomendasi keputusan diberikan untuk setiap kelompok perubahan.
- Asumsi ditandai dengan label `ASUMSI`.

## Keputusan Human Review
Keputusan berikut diberikan pengguna pada 1 Juli 2026:

1. Analisis change request implisit diterima sebagai pengganti `change-request.md`.
2. Foto hasil pekerjaan pada `FR-041` diubah agar memakai URL untuk menghemat pemakaian storage file.
3. Format unduhan laporan ringkas pada `FR-042` menggunakan CSV.
4. Status final untuk cancelled, reopened, closed otomatis, dan closed admin sudah benar.

## Human Review
Human review tahap change impact sudah dilakukan oleh pengguna pada 1 Juli 2026. Tidak ada pertanyaan dampak perubahan yang masih terbuka pada tahap ini.
