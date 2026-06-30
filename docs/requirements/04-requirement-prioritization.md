# 04 Requirement Prioritization

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `outputs/01-inception-stakeholder.md`
- `outputs/02-elicitation-findings.md`
- `outputs/02-elicitation-questions.md`
- `outputs/03-requirement-specification.md`

## Catatan Input
File `catatan-konflik-kebutuhan.md` tidak ditemukan pada folder output.

ASUMSI: Konflik kebutuhan dianalisis dari requirement formal, aturan bisnis, dan klarifikasi pengguna pada 30 Juni 2026.

## Ringkasan Prioritas

| Prioritas | Jumlah Requirement Formal | Makna |
| --- | ---: | --- |
| Must | 30 | Wajib ada agar alur inti pelaporan, pemeriksaan, penugasan, progress, konfirmasi, penutupan, dan validasi perubahan laporan dapat berjalan. |
| Should | 17 | Penting untuk operasional yang lebih lengkap, tetapi tidak menghentikan alur inti bila ditunda. |
| Could | 2 | Bermanfaat untuk pelaporan dan pengelolaan, tetapi dapat menjadi peningkatan setelah versi awal. |
| Won't | 0 | Tidak ada requirement formal yang dikeluarkan dari scope pada tahap ini. |

## Prioritas Functional Requirement

| ID | Prioritas | Alasan Singkat |
| --- | --- | --- |
| FR-001 | Must | Login akun kampus adalah dasar kontrol akses pelapor. |
| FR-002 | Must | Pembuatan laporan adalah fungsi inti sistem. |
| FR-003 | Must | Data laporan wajib diperlukan untuk memproses masalah fasilitas. |
| FR-004 | Should | Bukti foto membantu pemeriksaan, tetapi bersifat opsional. |
| FR-005 | Must | Kategori masalah diperlukan untuk klasifikasi dan dashboard. |
| FR-006 | Must | Lokasi ruangan diperlukan agar teknisi mengetahui tempat masalah. |
| FR-007 | Must | Pemeriksaan laporan adalah langkah awal proses administrator. |
| FR-008 | Must | Penolakan laporan tidak valid diperlukan untuk menjaga kualitas laporan. |
| FR-009 | Must | Alasan penolakan diperlukan agar keputusan administrator dapat ditelusuri. |
| FR-010 | Must | Penugasan teknisi memulai pekerjaan perbaikan. |
| FR-011 | Must | Teknisi harus dapat melihat tugas agar dapat menangani laporan. |
| FR-012 | Must | Progress pekerjaan diperlukan untuk memantau penyelesaian. |
| FR-013 | Should | Pembaruan progress oleh administrator penting sebagai dukungan operasional, tetapi bukan alur utama teknisi. |
| FR-014 | Must | Status khusus membantu menangani kondisi pekerjaan yang tidak langsung selesai. |
| FR-015 | Should | Bantuan teknisi tambahan penting untuk kasus tertentu, tetapi bergantung pada status butuh bantuan. |
| FR-016 | Must | Pelapor harus dapat melihat perkembangan laporan. |
| FR-017 | Should | Komentar pelapor membantu klarifikasi, tetapi alur inti tetap berjalan tanpa komentar tambahan. |
| FR-018 | Must | Konfirmasi pelapor diperlukan sebelum penutupan normal. |
| FR-019 | Must | Batas 45 menit adalah aturan bisnis utama setelah pekerjaan selesai. |
| FR-020 | Must | Penutupan otomatis mencegah laporan selesai tertahan terlalu lama. |
| FR-021 | Must | Administrator harus dapat menutup laporan untuk menyelesaikan siklus layanan. |
| FR-022 | Must | Notifikasi perubahan status menjaga stakeholder tetap mengetahui perkembangan. |
| FR-023 | Must | Kondisi notifikasi utama sudah ditentukan oleh elicitation. |
| FR-024 | Must | Dashboard adalah kebutuhan utama Manajer Fasilitas. |
| FR-025 | Must | Total masalah selesai adalah metrik utama dashboard. |
| FR-026 | Should | Chart kategori membantu analisis ringkas, tetapi dashboard dasar masih dapat berjalan dengan angka total. |
| FR-027 | Should | Filter dan urutan meningkatkan pemantauan, tetapi dapat disederhanakan pada versi awal. |
| FR-028 | Must | Laporan ringkas adalah kebutuhan utama Manajer Fasilitas. |
| FR-029 | Must | Ruangan dan kategori adalah isi minimum laporan ringkas yang sudah disepakati. |
| FR-030 | Could | Pembaruan daftar ruangan oleh Manajer Fasilitas berguna, tetapi dapat dilakukan manual oleh admin sistem pada versi awal jika diperlukan. |
| FR-031 | Should | Perubahan laporan membantu koreksi pelapor, tetapi bukan syarat alur laporan dasar. |
| FR-032 | Must | Administrator harus dapat membaca perubahan laporan untuk menjaga validitas proses. |
| FR-033 | Must | Laporan yang menjadi tidak valid setelah perubahan harus dapat ditutup. |
| FR-034 | Should | Pembatalan laporan dengan alasan penting untuk kasus salah lapor, tetapi dapat menyusul setelah alur inti stabil. |
| FR-035 | Should | Pengelompokan gedung dan lantai meningkatkan kemudahan memilih ruangan. |
| FR-036 | Must | Penolakan hasil pekerjaan dan pembukaan ulang mencegah laporan ditutup saat masalah belum selesai. |
| FR-037 | Should | Riwayat dan status baca notifikasi memperjelas komunikasi, tetapi notifikasi dasar lebih prioritas. |
| FR-038 | Should | Edit data laporan oleh administrator membantu validasi sebelum penugasan. |
| FR-039 | Should | Penggabungan laporan duplikat mengurangi pekerjaan berulang. |
| FR-040 | Should | Penggantian teknisi membantu operasional saat tugas berjalan, dengan kontrol persetujuan teknisi. |
| FR-041 | Should | Foto hasil pekerjaan dan estimasi waktu memperkaya bukti progress. |
| FR-042 | Should | Unduh laporan ringkas berguna untuk pelaporan manajemen. |
| FR-043 | Should | Catatan tindak lanjut Manajer Fasilitas penting untuk operasional lanjutan setelah laporan ringkas ditinjau. |

## Prioritas Non-Functional Requirement

| ID | Prioritas | Alasan Singkat |
| --- | --- | --- |
| NFR-001 | Must | Pembatasan akses pelapor menjaga sistem hanya digunakan pengguna kampus. |
| NFR-002 | Must | Kanal notifikasi dalam aplikasi menentukan batas scope versi awal. |
| NFR-003 | Must | Pemisahan hak akses mencegah peran melakukan aksi yang tidak sesuai. |
| NFR-004 | Must | Jejak informasi penting diperlukan untuk audit proses laporan. |
| NFR-005 | Could | Batasan di luar scope perlu dicatat, tetapi bukan fitur yang harus dibangun. |
| NFR-006 | Should | Tampilan responsif penting agar pelapor, teknisi, administrator, dan Manajer Fasilitas dapat memakai sistem dari desktop maupun ponsel. |

## Prioritas User Story

| ID | Prioritas | Requirement Terkait | Alasan Singkat |
| --- | --- | --- | --- |
| US-001 | Must | FR-001, NFR-001 | Login diperlukan sebelum pelaporan dan pemantauan. |
| US-002 | Must | FR-002, FR-003, FR-004, FR-005, FR-006 | Pelaporan adalah nilai utama untuk mahasiswa dan dosen. |
| US-003 | Must | FR-007, FR-008, FR-009 | Administrator harus dapat memvalidasi laporan. |
| US-004 | Must | FR-010 | Penugasan menghubungkan laporan dengan pekerjaan teknisi. |
| US-005 | Must | FR-011 | Teknisi perlu melihat tugas yang diberikan. |
| US-006 | Must | FR-012, FR-014, FR-022, FR-023 | Progress dan status adalah inti pemantauan pekerjaan. |
| US-007 | Should | FR-014, FR-015 | Bantuan tambahan diperlukan pada kasus tertentu. |
| US-008 | Should | FR-013 | Administrator dapat menjaga progress tetap akurat saat dibutuhkan. |
| US-009 | Should | FR-016, FR-017 | Pemantauan wajib, komentar tambahan bersifat pendukung. |
| US-010 | Must | FR-018, FR-019 | Konfirmasi pelapor dan batas waktu adalah aturan utama penutupan. |
| US-011 | Must | FR-020, FR-021 | Penutupan otomatis dan manual menyelesaikan siklus laporan. |
| US-012 | Must | FR-024, FR-025, FR-026, FR-027 | Dashboard dibutuhkan untuk pemantauan manajer fasilitas. |
| US-013 | Must | FR-028, FR-029 | Laporan ringkas adalah kebutuhan informasi minimum. |
| US-014 | Could | FR-030 | Pengelolaan daftar ruangan dapat ditunda jika daftar awal tersedia. |
| US-015 | Should | FR-031, FR-032, FR-033, FR-034 | Perubahan dan pembatalan laporan membantu koreksi laporan dengan kontrol administrator. |
| US-016 | Must | FR-036 | Penolakan hasil pekerjaan mencegah masalah yang belum selesai tertutup begitu saja. |
| US-017 | Should | FR-038, FR-039, FR-040 | Pengelolaan laporan oleh administrator membantu akurasi operasional. |
| US-018 | Should | FR-041 | Bukti hasil pekerjaan dan estimasi membuat progress teknisi lebih jelas. |
| US-019 | Should | FR-037 | Riwayat notifikasi membantu pengguna melacak informasi sistem. |
| US-020 | Should | FR-042, FR-043 | Unduhan dan catatan tindak lanjut membantu pemanfaatan laporan oleh Manajer Fasilitas. |

## Ketergantungan Requirement

| Requirement | Bergantung Pada | Catatan |
| --- | --- | --- |
| FR-002 sampai FR-006 | FR-001 | Pelapor harus login sebelum membuat laporan. |
| FR-007 sampai FR-009 | FR-002, FR-003, FR-005, FR-006 | Administrator memeriksa laporan yang sudah dibuat. |
| FR-010, FR-011 | FR-007, FR-008 | Penugasan hanya terjadi setelah laporan valid. |
| FR-012, FR-014 | FR-010, FR-011 | Progress teknisi hanya ada setelah tugas diberikan. |
| FR-015 | FR-014 | Bantuan tambahan bergantung pada status butuh bantuan. |
| FR-016, FR-017 | FR-002 | Pelapor memantau dan mengomentari laporan yang sudah dibuat. |
| FR-018 sampai FR-021 | FR-012, FR-014 | Konfirmasi dan penutupan terjadi setelah pekerjaan dinyatakan selesai. |
| FR-022, FR-023 | FR-012, FR-014, FR-018, FR-021 | Notifikasi dipicu oleh perubahan status penting. |
| FR-024 sampai FR-029 | FR-002, FR-005, FR-006, FR-021 | Dashboard dan laporan ringkas membutuhkan data laporan, kategori, ruangan, dan status selesai. |
| FR-030 | FR-006 | Daftar ruangan memengaruhi pilihan lokasi laporan. |
| FR-031 sampai FR-034 | FR-002, FR-007, FR-008 | Perubahan dan pembatalan laporan bergantung pada laporan yang sudah dibuat dan validasi administrator. |
| FR-035 | FR-006 | Pengelompokan gedung dan lantai adalah struktur dari daftar ruangan. |
| FR-036 | FR-012, FR-018, FR-021 | Penolakan hasil pekerjaan terjadi setelah pekerjaan dinyatakan selesai dan sebelum laporan ditutup final. |
| FR-037 | FR-022, FR-023 | Riwayat notifikasi membutuhkan notifikasi dasar yang sudah dikirim sistem. |
| FR-038, FR-039 | FR-007, FR-008 | Edit dan penggabungan laporan dilakukan dalam proses pemeriksaan administrator. |
| FR-040 | FR-010, FR-011 | Penggantian teknisi hanya berlaku setelah laporan memiliki teknisi yang berjalan. |
| FR-041 | FR-012, FR-014 | Foto hasil pekerjaan dan estimasi waktu merupakan bagian dari progress teknisi. |
| FR-042 | FR-028, FR-029 | Unduhan laporan ringkas membutuhkan laporan ringkas yang sudah tersedia. |
| FR-043 | FR-028, FR-029 | Catatan tindak lanjut diberikan pada data laporan ringkas atau laporan yang sudah tersedia. |

## Konflik dan Opsi Penyelesaian

| ID Konflik | Requirement Terkait | Konflik atau Ketegangan | Opsi Penyelesaian |
| --- | --- | --- | --- |
| CON-001 | FR-018, FR-019, FR-020, FR-021 | Konfirmasi pelapor diperlukan, tetapi administrator juga boleh menutup laporan tanpa konfirmasi dan sistem dapat menutup otomatis setelah 45 menit. | Tetapkan status akhir yang jelas: `menunggu konfirmasi`, `ditutup otomatis`, dan `ditutup admin`. Simpan aktor atau mekanisme penutupan pada riwayat laporan. |
| CON-002 | FR-010, FR-015 | Satu laporan awalnya ditangani teknisi utama, tetapi lebih dari satu teknisi dapat dikerahkan saat butuh bantuan. | Gunakan konsep teknisi utama dan teknisi tambahan. Teknisi tambahan hanya dapat ditambahkan setelah status butuh bantuan disetujui administrator. |
| CON-003 | FR-012, FR-013 | Teknisi dan administrator sama-sama dapat memperbarui progress, sehingga ada risiko riwayat progress tidak jelas. | Simpan setiap update sebagai riwayat dengan aktor, waktu, isi progress, dan catatan alasan khusus untuk update administrator. |
| CON-004 | FR-022, FR-023, NFR-002 | Stakeholder membutuhkan notifikasi, tetapi scope membatasi notifikasi hanya di dalam aplikasi. | Nyatakan bahwa versi awal hanya memakai notification center di aplikasi. Email atau WhatsApp tetap di luar scope sesuai NFR-002 dan NFR-005. |
| CON-005 | FR-006, FR-030 | Pelapor harus memilih ruangan dari daftar, tetapi pembaruan daftar ruangan diprioritaskan rendah. | Pastikan versi awal memiliki seed data daftar ruangan. Pengelolaan ruangan oleh Manajer Fasilitas dapat ditunda bila daftar awal sudah cukup. |
| CON-006 | FR-031, FR-032, FR-033 | Pelapor dapat mengubah laporan, tetapi perubahan dapat membuat laporan tidak valid. | Wajibkan alasan perubahan dan kembalikan laporan ke pemeriksaan administrator sebelum proses lanjut. Jika tidak valid, administrator dapat menutup laporan. |
| CON-007 | FR-018, FR-020, FR-036 | Sistem dapat menutup otomatis setelah 45 menit, tetapi pelapor dapat menolak hasil pekerjaan dengan alasan. | Selama masih dalam jendela konfirmasi, penolakan pelapor menghentikan penutupan otomatis dan mengirim laporan ke keputusan administrator. |
| CON-008 | FR-040 | Administrator dapat mengganti teknisi, tetapi penggantian harus disetujui teknisi. | Gunakan status `menunggu persetujuan penggantian teknisi`; penggantian baru efektif setelah persetujuan tersimpan. |
| CON-009 | FR-038, FR-039 | Administrator dapat mengedit data laporan dan menggabungkan duplikat, sehingga riwayat laporan bisa membingungkan. | Simpan riwayat edit, alasan edit, dan referensi laporan utama saat duplikat digabungkan. |

## Requirement yang Sudah Diklarifikasi
Semua requirement yang sebelumnya belum diprioritaskan sebagai fitur formal sudah masuk ke `FR-031` sampai `FR-043` berdasarkan klarifikasi pengguna pada 30 Juni 2026.

## Rekomendasi Scope Versi Awal

### Minimum Viable Scope
1. Login dan role dasar: pelapor, administrator, teknisi, Manajer Fasilitas.
2. Pembuatan laporan dengan data wajib, kategori, ruangan, urgensi, dan foto opsional.
3. Pemeriksaan, penolakan, dan alasan penolakan oleh administrator.
4. Penugasan laporan valid kepada teknisi.
5. Progress teknisi, status khusus, dan notifikasi aplikasi.
6. Pemantauan laporan oleh pelapor.
7. Konfirmasi pelapor, batas 45 menit, penutupan otomatis, dan penutupan administrator.
8. Penolakan hasil pekerjaan oleh pelapor dengan alasan dan keputusan pembukaan ulang oleh administrator.
9. Dashboard dasar dan laporan ringkas Manajer Fasilitas.

### Ditunda Setelah Versi Awal
1. Pengelolaan daftar ruangan oleh Manajer Fasilitas jika seed data ruangan sudah tersedia.
2. Filter dan chart dashboard lanjutan jika dashboard dasar belum stabil.
3. Komentar tambahan pelapor jika siklus laporan inti belum selesai.
4. Bantuan teknisi tambahan jika alur satu teknisi utama belum stabil.
5. Riwayat notifikasi lengkap dan status sudah dibaca jika notifikasi dasar belum stabil.
6. Unduh laporan ringkas jika laporan ringkas dasar belum stabil.

## Keputusan Human Review
Keputusan berikut diberikan pengguna pada 30 Juni 2026:

1. `FR-030` disetujui berada pada prioritas `Could` karena dapat ditingkatkan jika ada ruangan baru yang belum terdaftar.
2. `FR-017` disetujui berada pada prioritas `Should` karena komentar pelapor membantu administrator memahami masalah.
3. `FR-026` dan `FR-027` dapat ditunda sebagian karena chart dan filter dashboard tidak menghentikan laporan dasar dashboard.
4. `FR-043` dinaikkan dari `Could` menjadi `Should` karena catatan tindak lanjut Manajer Fasilitas penting untuk operasional lebih lanjut.
5. Opsi penyelesaian konflik `CON-001` sampai `CON-009` disetujui.
6. `NFR-006` ditambahkan untuk memenuhi ketentuan minimum NFR dan memastikan sistem nyaman digunakan di browser desktop maupun ponsel.

## Quality Check
- Semua `FR` memiliki prioritas.
- Semua `NFR` memiliki prioritas.
- Semua `US` memiliki prioritas.
- Alasan prioritas ditulis singkat.
- Konflik kebutuhan ditautkan ke ID requirement.
- Opsi penyelesaian konflik tidak menghapus requirement.
- Requirement prioritas tinggi mendukung tujuan utama proyek.

## Human Review
Human review sudah dilakukan oleh pengguna pada 30 Juni 2026. Tidak ada pertanyaan prioritas yang masih terbuka pada tahap ini.
