# 05 Requirement Validation

## Nama Proyek
Campus Service Request and Maintenance System

## Sumber Input
- `outputs/03-requirement-specification.md`
- `outputs/04-requirement-prioritization.md`
- Klarifikasi pengguna pada 30 Juni 2026
- Referensi tugas proyek Software Engineering

## Catatan Input
File `change-request.md` tidak ditemukan pada folder output.

ASUMSI: Klarifikasi pengguna pada 30 Juni 2026 diperlakukan sebagai perubahan requirement yang sudah dimasukkan ke `FR-031` sampai `FR-043`.

## Ringkasan Validasi

| Area | Status | Catatan |
| --- | --- | --- |
| Kelengkapan requirement | Lulus | Functional requirement, non-functional requirement, user story, dan acceptance criteria sudah memenuhi jumlah minimum referensi tugas. |
| Konsistensi requirement | Perlu perhatian | Alur penutupan otomatis, penolakan hasil pekerjaan, dan pembukaan ulang perlu status yang jelas pada desain berikutnya. |
| Kejelasan requirement | Cukup jelas | Sebagian besar requirement memakai aktor dan perilaku sistem yang jelas. |
| Kemampuan diuji | Cukup dapat diuji | Acceptance criteria sudah tersedia, tetapi beberapa perlu diturunkan menjadi test case lebih spesifik pada tahap test planning. |
| Traceability | Cukup baik | Requirement formal terhubung ke sumber, user story, dan prioritas. |
| Scope | Terkendali | Mayoritas requirement masih sesuai scope. Upload foto perlu diposisikan sebagai opsional atau ditunda agar tidak membebani Cloudflare free tier. |

## Validasi Kelengkapan

| Item | Hasil | Catatan |
| --- | --- | --- |
| Functional requirement | Lulus | Tersedia `FR-001` sampai `FR-043`, melebihi minimum referensi tugas. |
| Non-functional requirement | Lulus | Tersedia `NFR-001` sampai `NFR-006`, sesuai minimum referensi tugas. |
| User story | Lulus | Tersedia `US-001` sampai `US-020`, melebihi minimum referensi tugas. |
| Acceptance criteria | Lulus bersyarat | Semua kelompok FR memiliki acceptance criteria, tetapi belum semua user story memiliki minimal 2 AC yang ditulis eksplisit per user story. |
| Prioritas requirement | Lulus | Semua `FR`, `NFR`, dan `US` sudah memiliki prioritas pada dokumen 04. |
| Human review | Lulus | Human review prioritas sudah dicatat pada dokumen 04. |

## Requirement Bermasalah atau Perlu Perhatian

| ID | Jenis Masalah | Alasan | Rekomendasi |
| --- | --- | --- | --- |
| NFR-006 | Catatan tambahan | NFR responsif sudah ditambahkan untuk memenuhi minimum 6 NFR dan mendukung penggunaan melalui desktop maupun ponsel. | Pastikan desain UI tahap berikutnya memperhatikan tampilan responsif. |
| FR-004, FR-041 | Scope teknis | Referensi tugas menyebut upload foto tidak wajib karena object storage dapat memerlukan layanan tambahan. Requirement saat ini membuat foto opsional, termasuk foto hasil pekerjaan. | Tetap jadikan foto sebagai opsional dan prioritaskan implementasi berbasis URL/lampiran sederhana atau tunda penyimpanan file asli sampai arsitektur storage disetujui. |
| FR-018, FR-019, FR-020, FR-036 | Konsistensi alur status | Sistem menunggu konfirmasi 45 menit, dapat menutup otomatis, dan juga mengizinkan pelapor menolak hasil pekerjaan. | Pada desain arsitektur, definisikan status `RESOLVED`, `WAITING_REPORTER_CONFIRMATION`, `REOPEN_REQUESTED`, `REOPENED`, `CLOSED_AUTO`, dan `CLOSED_ADMIN` atau padanan yang disetujui. |
| FR-021, FR-033, FR-036 | Kejelasan kewenangan admin | Administrator dapat menutup laporan, menutup laporan tidak valid setelah perubahan, dan membuka ulang laporan sesuai ketentuan. | Tulis business rule yang menjelaskan kapan admin boleh menutup, membuka ulang, atau menolak pembukaan ulang. |
| FR-031, FR-032, FR-033 | Kejelasan proses perubahan | Pelapor dapat mengubah laporan, tetapi belum dijelaskan status laporan selama menunggu validasi ulang administrator. | Tambahkan status atau aturan bahwa laporan yang berubah kembali ke `Under Review` atau `Needs Admin Review`. |
| FR-034 | Kejelasan status pembatalan | Pelapor dapat membatalkan laporan dengan alasan, tetapi belum ada status akhir pembatalan. | Tambahkan status `Cancelled` atau aturan bahwa laporan dibatalkan tidak diproses teknisi. |
| FR-039 | Kejelasan data duplikat | Laporan duplikat dapat digabung, tetapi belum dijelaskan apakah komentar, status, dan riwayat ikut digabung. | Pada desain database, simpan `parent_request_id` atau tabel relasi duplikat dan pertahankan riwayat masing-masing laporan. |
| FR-040 | Kejelasan persetujuan teknisi | Penggantian teknisi harus disetujui teknisi, tetapi belum jelas teknisi lama atau teknisi baru yang menyetujui. | Klarifikasi pada desain proses. ASUMSI awal: teknisi yang sedang bertugas memberi persetujuan sebelum diganti. |
| FR-042 | Kemampuan diuji | Laporan ringkas dapat diunduh, tetapi format file belum ditentukan. | Tentukan format unduhan pada desain, misalnya CSV untuk versi awal karena sederhana dan mudah diuji. |
| FR-043 | Kejelasan lokasi catatan | Catatan tindak lanjut Manajer Fasilitas dapat diberikan pada laporan ringkas atau data laporan. | Pada desain UI dan database, tentukan apakah catatan melekat ke laporan individual, periode laporan ringkas, atau keduanya. |

## Konsistensi Dengan Referensi Tugas

| Fitur Referensi | Requirement Terkait | Status |
| --- | --- | --- |
| Membuat laporan baru | FR-002 sampai FR-006 | Sesuai |
| Melihat daftar laporan | FR-016, FR-028, FR-029 | Sesuai, tetapi daftar laporan umum perlu dipertegas pada desain UI. |
| Mencari dan menyaring laporan | FR-027 | Sesuai untuk dashboard, perlu dipertimbangkan untuk daftar laporan operasional. |
| Melihat detail laporan | FR-016, FR-011 | Sesuai secara implisit, perlu dibuat eksplisit pada desain UI. |
| Memeriksa laporan | FR-007 sampai FR-009 | Sesuai |
| Menentukan prioritas | FR-003 | Sesuai karena tingkat urgensi disimpan pada laporan. |
| Menugaskan teknisi | FR-010 | Sesuai |
| Mengubah status pekerjaan | FR-012, FR-014 | Sesuai |
| Menambahkan komentar atau catatan | FR-017, FR-043 | Sesuai |
| Menyimpan riwayat status | NFR-004 | Sesuai sebagai batasan pencatatan, perlu detail database. |
| Menutup atau membuka kembali laporan | FR-020, FR-021, FR-036 | Sesuai |
| Dashboard sederhana | FR-024 sampai FR-027 | Sesuai |

## Rekomendasi Validasi

| Rekomendasi | Keputusan Sementara | Alasan |
| --- | --- | --- |
| Lanjut ke tahap 06 Architecture Design | Terima | Requirement cukup lengkap untuk mulai desain arsitektur. |
| Pertahankan `NFR-006` pada desain UI dan acceptance test | Terima | Dibutuhkan agar requirement responsif tidak berhenti di dokumen specification saja. |
| Definisikan state machine status laporan pada desain arsitektur | Terima | Mengurangi risiko konflik antara resolved, closed, reopened, cancelled, dan rejected. |
| Perlakukan upload foto sebagai opsional atau enhancement | Terima | Selaras dengan referensi tugas dan menghindari kebutuhan object storage pada versi awal. |
| Buat aturan bisnis eksplisit untuk perubahan, pembatalan, penggabungan duplikat, dan penggantian teknisi | Terima | Dibutuhkan agar database, API, UI, dan test dapat dirancang konsisten. |

## Quality Check
- Requirement bermasalah memiliki alasan.
- Semua catatan validasi mengacu ke ID requirement.
- Tidak ada requirement yang dihapus.
- Rekomendasi dapat ditindaklanjuti pada tahap desain.
- Asumsi ditandai dengan label `ASUMSI`.

## Human Review
Manusia perlu memeriksa:
1. Apakah upload foto tetap opsional dan tidak menjadi target minimum implementasi.
2. Siapa yang harus menyetujui penggantian teknisi pada `FR-040`.
3. Format unduhan laporan ringkas untuk `FR-042`.
4. Apakah `NFR-006` sudah cukup untuk kebutuhan perangkat desktop dan ponsel.
