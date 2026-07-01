# 08 UI Design

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `docs/requirements/03-requirement-specification.md`
- `docs/design/06-architecture-design.md`
- `docs/design/07-api-design.md`
- `docs/design/07-database-design.md`

## Catatan Input
File `profil-pengguna.md` tidak ditemukan.

ASUMSI: Profil pengguna diturunkan dari aktor sistem pada requirement dan arsitektur, yaitu Pelapor, Administrator, Teknisi, dan Manajer Fasilitas.

## Prinsip UX
1. UI harus membantu pengguna menyelesaikan pekerjaan utama dengan langkah sesedikit mungkin.
2. Setiap role hanya melihat menu dan aksi yang relevan dengan tugasnya.
3. Status laporan harus selalu terlihat jelas karena status adalah pusat alur sistem.
4. Form harus memberi validasi langsung untuk field wajib dan alasan yang wajib diisi.
5. Aksi berisiko seperti batal, tolak, tutup, merge duplikat, dan ganti teknisi harus memakai dialog konfirmasi.
6. Laporan harus mudah dicari melalui filter status, kategori, ruangan, dan urutan waktu.
7. Tampilan harus responsif untuk desktop dan ponsel sesuai `NFR-006`.
8. Bahasa UI harus ringkas, langsung, dan sesuai konteks kampus.

## Profil Pengguna dan Tugas Utama

| Role | Kebutuhan UX | Tugas Utama |
| --- | --- | --- |
| Pelapor | Cepat membuat laporan, mudah melihat status, dan mudah memberi tanggapan saat pekerjaan selesai. | Login, membuat laporan, melihat laporan, komentar, ubah/batalkan laporan, konfirmasi atau tolak hasil. |
| Administrator | Perlu layar kerja yang padat, mudah memfilter laporan, dan cepat mengambil keputusan valid/tidak valid. | Review laporan, edit data, reject, assign teknisi, merge duplikat, close/reopen. |
| Teknisi | Butuh daftar tugas yang jelas, prioritas terlihat, dan update progress cepat dari ponsel. | Melihat tugas, update progress/status, isi estimasi, URL foto, resolve, approve replacement. |
| Manajer Fasilitas | Butuh ringkasan, filter, export CSV, dan catatan tindak lanjut. | Melihat dashboard, laporan ringkas, export CSV, update ruangan, catatan tindak lanjut. |

## Struktur Navigasi

### Navigasi Global
| Menu | Role | Tujuan |
| --- | --- | --- |
| Dashboard | Semua role sesuai konteks | Ringkasan pekerjaan masing-masing role. |
| Laporan | REPORTER, ADMIN, TECHNICIAN | Daftar laporan sesuai role. |
| Buat Laporan | REPORTER | Form laporan baru. |
| Tugas Saya | TECHNICIAN | Daftar tugas teknisi. |
| Review Admin | ADMIN | Antrian laporan yang perlu keputusan admin. |
| Notifikasi | Semua role | Riwayat notifikasi dan status dibaca. |
| Laporan Ringkas | FACILITY_MANAGER | Laporan ringkas, filter, export CSV. |
| Ruangan | FACILITY_MANAGER | Kelola daftar ruangan. |

### Navigasi Detail Laporan
| Bagian | Isi |
| --- | --- |
| Ringkasan | Nomor laporan, status, urgensi, kategori, ruangan, pelapor, teknisi. |
| Timeline | Riwayat status dan audit ringkas. |
| Progress | Update teknisi dan catatan admin. |
| Komentar | Komentar pelapor. |
| Aksi | Tombol sesuai role dan status laporan. |

## Daftar Halaman

| Halaman | Role | Tujuan | Requirement |
| --- | --- | --- | --- |
| Login | Semua | Masuk menggunakan akun kampus atau simulasi role versi awal. | FR-001 |
| Reporter Dashboard | REPORTER | Ringkasan laporan milik pelapor dan notifikasi terbaru. | FR-016, FR-022 |
| Buat Laporan | REPORTER | Membuat laporan fasilitas. | FR-002 sampai FR-006 |
| Daftar Laporan | REPORTER, ADMIN | Melihat dan memfilter laporan. | FR-016, FR-027 |
| Detail Laporan | Semua role terkait | Melihat detail, timeline, komentar, progress, dan aksi status. | FR-011, FR-016, NFR-004 |
| Edit Laporan | REPORTER | Mengubah laporan dengan alasan. | FR-031, FR-032 |
| Review Admin | ADMIN | Memeriksa laporan masuk dan perubahan laporan. | FR-007 sampai FR-009, FR-032 |
| Assign Teknisi | ADMIN | Menugaskan teknisi utama atau tambahan. | FR-010, FR-015 |
| Ganti Teknisi | ADMIN, TECHNICIAN | Mengajukan dan menyetujui penggantian teknisi. | FR-040 |
| Tugas Teknisi | TECHNICIAN | Melihat tugas teknisi. | FR-011 |
| Update Progress | TECHNICIAN, ADMIN | Mengubah progress/status dengan catatan. | FR-012 sampai FR-014, FR-041 |
| Konfirmasi Hasil | REPORTER | Konfirmasi selesai atau tolak hasil pekerjaan. | FR-018, FR-036 |
| Notifikasi | Semua | Melihat riwayat dan menandai sudah dibaca. | FR-037 |
| Dashboard Manajer | FACILITY_MANAGER | Ringkasan total selesai dan chart kategori. | FR-024 sampai FR-027 |
| Laporan Ringkas | FACILITY_MANAGER | Melihat dan export CSV laporan ringkas. | FR-028, FR-029, FR-042 |
| Kelola Ruangan | FACILITY_MANAGER | Menambah dan memperbarui daftar ruangan. | FR-030, FR-035 |
| Catatan Tindak Lanjut | FACILITY_MANAGER | Menambahkan catatan dengan alasan. | FR-043 |

## Desain Form dan Validasi

### Form Login
| Field | Tipe | Wajib | Validasi |
| --- | --- | --- | --- |
| Email kampus | Email input | Ya | Format email kampus. |
| Role | Select | Ya | Hanya untuk simulasi versi awal. |

Pesan error:
- "Email kampus wajib diisi."
- "Pilih role untuk masuk ke sistem."

### Form Buat Laporan
| Field | Tipe | Wajib | Validasi |
| --- | --- | --- | --- |
| Judul masalah | Text input | Ya | Tidak kosong. |
| Deskripsi | Textarea | Ya | Tidak kosong, cukup menjelaskan masalah. |
| Kategori | Select | Ya | Pilih dari kategori aktif. |
| Gedung | Select | Ya | Pilih gedung. |
| Lantai | Select | Ya | Pilih lantai berdasarkan gedung. |
| Ruangan | Select | Ya | Pilih ruangan berdasarkan gedung dan lantai. |
| Urgensi | Segmented control | Ya | LOW, MEDIUM, HIGH, URGENT. |
| URL foto kerusakan | URL input | Tidak | Jika diisi harus format URL. |

UX penting:
- Gedung, lantai, dan ruangan memakai pilihan bertingkat agar pelapor tidak mengetik lokasi bebas.
- Tombol utama: `Kirim Laporan`.
- Setelah sukses, tampilkan nomor laporan dan link ke detail laporan.

### Form Edit Laporan
| Field | Tipe | Wajib | Validasi |
| --- | --- | --- | --- |
| Judul, deskripsi, kategori, lokasi, urgensi | Input sesuai field awal | Sesuai field | Validasi sama seperti buat laporan. |
| Alasan perubahan | Textarea | Ya | Tidak kosong. |

UX penting:
- Tampilkan ringkasan perubahan sebelum submit.
- Jelaskan bahwa laporan akan diperiksa ulang administrator.

### Form Pembatalan Laporan
| Field | Tipe | Wajib | Validasi |
| --- | --- | --- | --- |
| Alasan pembatalan | Textarea | Ya | Tidak kosong. |

Dialog konfirmasi:
- Judul: "Batalkan laporan?"
- Isi: "Laporan yang dibatalkan tidak akan diproses teknisi."

### Form Review Admin
| Aksi | Field Wajib | Validasi |
| --- | --- | --- |
| Terima laporan | Tidak ada atau catatan opsional | Laporan harus memiliki data wajib. |
| Tolak laporan | Alasan penolakan | Tidak kosong. |
| Edit data laporan | Alasan edit | Tidak kosong. |
| Merge duplikat | Laporan utama, alasan | Laporan utama harus dipilih. |

### Form Assign Teknisi
| Field | Tipe | Wajib | Validasi |
| --- | --- | --- | --- |
| Teknisi | Select | Ya | Teknisi aktif. |
| Tipe assignment | Select | Ya | PRIMARY atau ADDITIONAL. |
| Alasan | Textarea | Tidak | Wajib jika penggantian teknisi. |

### Form Update Progress Teknisi
| Field | Tipe | Wajib | Validasi |
| --- | --- | --- | --- |
| Status pekerjaan | Select | Ya | IN_PROGRESS, NEED_HELP, WAITING_PARTS, PAUSED, RESOLVED. |
| Catatan progress | Textarea | Ya | Tidak kosong. |
| Estimasi selesai | Datetime input | Tidak | Waktu valid. |
| URL foto hasil | URL input | Tidak | Jika diisi harus format URL. |

UX penting:
- Status umum dibuat sebagai tombol cepat.
- Jika status `RESOLVED`, tampilkan konfirmasi bahwa pelapor akan diberi waktu 45 menit.

### Form Konfirmasi atau Tolak Hasil
| Aksi | Field | Wajib |
| --- | --- | --- |
| Konfirmasi selesai | Tidak ada | Tidak |
| Tolak hasil | Alasan penolakan | Ya |

UX penting:
- Tampilkan countdown atau teks batas waktu konfirmasi.
- Tombol `Konfirmasi Selesai` dan `Tolak Hasil` harus jelas berbeda.

### Form Catatan Tindak Lanjut
| Field | Tipe | Wajib |
| --- | --- | --- |
| Catatan | Textarea | Ya |
| Alasan | Textarea | Ya |

## Komponen UI

| Komponen | Fungsi |
| --- | --- |
| Status Badge | Menampilkan status laporan dengan warna konsisten. |
| Urgency Badge | Menampilkan tingkat urgensi. |
| Request Table | Daftar laporan dengan filter dan sort. |
| Request Timeline | Riwayat status, audit, dan progress. |
| Role Navigation | Menu sesuai role. |
| Notification Drawer | Riwayat notifikasi dan aksi tandai dibaca. |
| Confirm Dialog | Konfirmasi aksi berisiko. |
| Empty State | Pesan saat belum ada laporan/tugas/notifikasi. |
| CSV Export Button | Unduh laporan ringkas. |
| Responsive Filter Panel | Filter tabel yang rapi di desktop dan collapsible di ponsel. |

## Pola Status Visual

| Status | Tampilan UI |
| --- | --- |
| SUBMITTED, UNDER_REVIEW | Badge netral. |
| ASSIGNED, IN_PROGRESS | Badge aktif. |
| NEED_HELP, WAITING_PARTS, PAUSED | Badge perhatian. |
| RESOLVED, WAITING_REPORTER_CONFIRMATION | Badge menunggu konfirmasi. |
| REOPEN_REQUESTED, REOPENED | Badge peringatan. |
| REJECTED, CANCELLED | Badge nonaktif. |
| CLOSED_AUTO, CLOSED_ADMIN, CLOSED_REPORTER_CONFIRMED | Badge selesai. |

ASUMSI: Warna final akan ditentukan pada implementasi UI, tetapi harus konsisten dan tetap terbaca.

## Responsif dan Aksesibilitas
1. Layout desktop memakai sidebar atau top navigation dengan area konten lebar.
2. Layout ponsel memakai bottom navigation atau menu ringkas.
3. Tabel pada ponsel berubah menjadi list item ringkas.
4. Tombol aksi utama selalu mudah dijangkau.
5. Semua field form memiliki label jelas.
6. Pesan error ditampilkan dekat field terkait.
7. Teks status tidak hanya bergantung pada warna.
8. Dialog konfirmasi dapat dibatalkan dengan jelas.

## UX Flow Utama

### Pelapor Membuat Laporan
1. Login.
2. Buka `Buat Laporan`.
3. Isi judul, deskripsi, kategori, gedung, lantai, ruangan, urgensi, dan URL foto opsional.
4. Submit laporan.
5. Sistem menampilkan nomor laporan dan status `SUBMITTED`.
6. Pelapor dapat membuka detail laporan.

### Administrator Memproses Laporan
1. Login sebagai ADMIN.
2. Buka `Review Admin`.
3. Pilih laporan.
4. Periksa detail, lokasi, kategori, dan alasan perubahan jika ada.
5. Terima, tolak, edit, merge, atau assign teknisi.
6. Sistem menampilkan status baru dan membuat audit trail.

### Teknisi Menyelesaikan Tugas
1. Login sebagai TECHNICIAN.
2. Buka `Tugas Saya`.
3. Pilih laporan.
4. Update status dan catatan progress.
5. Jika selesai, pilih `RESOLVED`.
6. Sistem memberi notifikasi ke pelapor untuk konfirmasi.

### Pelapor Mengonfirmasi atau Menolak Hasil
1. Pelapor menerima notifikasi.
2. Buka detail laporan.
3. Pilih `Konfirmasi Selesai` atau `Tolak Hasil`.
4. Jika menolak, pelapor wajib mengisi alasan.
5. Administrator memutuskan apakah laporan dibuka ulang.

### Manajer Fasilitas Melihat Laporan
1. Login sebagai FACILITY_MANAGER.
2. Buka dashboard.
3. Gunakan filter kategori, ruangan, atau urutan waktu.
4. Buka laporan ringkas.
5. Unduh CSV jika diperlukan.
6. Tambahkan catatan tindak lanjut dengan alasan.

## Traceability UI

| UI Area | Requirement |
| --- | --- |
| Login dan Role Navigation | FR-001, NFR-001, NFR-003 |
| Form Buat Laporan | FR-002 sampai FR-006 |
| Daftar dan Detail Laporan | FR-011, FR-016, FR-027 |
| Review Admin | FR-007 sampai FR-010, FR-032, FR-038, FR-039 |
| Assignment dan Replacement | FR-010, FR-015, FR-040 |
| Update Progress Teknisi | FR-012 sampai FR-014, FR-041 |
| Konfirmasi dan Reopen | FR-018 sampai FR-021, FR-036 |
| Notifikasi | FR-022, FR-023, FR-037 |
| Dashboard dan Laporan Ringkas | FR-024 sampai FR-029, FR-042 |
| Kelola Ruangan | FR-030, FR-035 |
| Catatan Tindak Lanjut | FR-043 |

## Quality Check
- Setiap halaman terhubung ke kebutuhan pengguna.
- Navigasi mengikuti role dan tugas utama.
- Form memiliki field, validasi, dan pesan error.
- UI tidak meminta data di luar requirement.
- UX mempertimbangkan desktop dan ponsel.
- Aksi berisiko memakai konfirmasi.

## Human Review
Manusia perlu memeriksa:
1. Apakah daftar halaman sudah cukup dan tidak berlebihan.
2. Apakah alur pelapor, administrator, teknisi, dan Manajer Fasilitas mudah dipahami.
3. Apakah field form sudah sesuai kebutuhan kampus.
4. Apakah desain responsif dan mobile-friendly sudah cukup untuk versi awal.
5. Apakah ada istilah UI yang perlu diganti agar lebih mudah dipahami pengguna kampus.
