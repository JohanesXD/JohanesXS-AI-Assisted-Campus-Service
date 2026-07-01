# 08 Wireframe

## Nama Proyek
Campus Service Request and Maintenance System

## Tujuan
Dokumen ini memberi wireframe teks sederhana untuk halaman penting. Wireframe ini menjadi dasar desain UI sebelum implementasi React.

## 1. Login

```text
+------------------------------------------------------+
| Campus Service Request                               |
| Masuk dengan akun kampus                             |
+------------------------------------------------------+
| Email kampus                                         |
| [ nama@campus.ac.id                              ]   |
|                                                      |
| Role versi awal                                      |
| [ Reporter v ]                                       |
|                                                      |
| [ Masuk ]                                            |
|                                                      |
| Pesan error/sukses                                   |
+------------------------------------------------------+
```

UX:
- Halaman login dibuat sederhana agar pengguna cepat masuk.
- Role hanya ditampilkan untuk simulasi versi awal.

## 2. Reporter Dashboard

```text
+------------------------------------------------------+
| Header: Campus Service Request       [Notifikasi]    |
+----------------------+-------------------------------+
| Nav Reporter         | Ringkasan Laporan Saya        |
| - Dashboard          | [Aktif] [Menunggu] [Selesai]  |
| - Buat Laporan       |                               |
| - Laporan Saya       | Notifikasi Terbaru            |
| - Notifikasi         | - Laporan CSR-001 diproses    |
|                      |                               |
|                      | Laporan Terbaru               |
|                      | CSR-001 | AC | IN_PROGRESS    |
|                      | CSR-002 | Net| SUBMITTED      |
+----------------------+-------------------------------+
```

Mobile:
- Navigasi berubah menjadi menu bawah atau drawer.
- Kartu laporan menggantikan tabel.

## 3. Buat Laporan

```text
+------------------------------------------------------+
| Buat Laporan Baru                                    |
+------------------------------------------------------+
| Judul Masalah                                        |
| [                                                ]   |
| Deskripsi                                            |
| [                                                ]   |
| [                                                ]   |
| Kategori                                             |
| [ AC v ]                                             |
| Lokasi                                               |
| [ Gedung A v ] [ Lantai 2 v ] [ Ruang 201 v ]        |
| Urgensi                                              |
| [LOW] [MEDIUM] [HIGH] [URGENT]                       |
| URL Foto Kerusakan Opsional                          |
| [ https://...                                    ]   |
|                                                      |
| [ Batal ]                              [ Kirim ]     |
+------------------------------------------------------+
```

Validasi:
- Judul, deskripsi, kategori, gedung, lantai, ruangan, dan urgensi wajib.
- URL foto hanya divalidasi jika diisi.

## 4. Daftar Laporan

```text
+------------------------------------------------------+
| Daftar Laporan                                       |
+------------------------------------------------------+
| Filter: [Status v] [Kategori v] [Ruangan v] [Cari]   |
| Urutkan: [Terbaru v]                                 |
+------------------------------------------------------+
| Nomor   | Judul        | Ruangan | Urgensi | Status  |
| CSR-001 | AC tidak...  | A-201   | HIGH    | IN_PROG |
| CSR-002 | Internet...  | B-101   | MEDIUM  | REVIEW  |
+------------------------------------------------------+
| Klik baris untuk membuka detail laporan              |
+------------------------------------------------------+
```

Mobile:
```text
[CSR-001] AC tidak dingin
Gedung A Lt 2 R.201 | HIGH
Status: IN_PROGRESS
[Lihat Detail]
```

## 5. Detail Laporan

```text
+------------------------------------------------------+
| CSR-001 - AC tidak dingin            [Status Badge]  |
| Gedung A / Lantai 2 / Ruang 201       Urgensi: HIGH  |
+------------------------------------------------------+
| Ringkasan                                             |
| Pelapor: ... | Kategori: AC | Teknisi: ...           |
| Deskripsi: ...                                       |
| URL Foto: [Buka tautan]                              |
+------------------------------------------------------+
| Timeline Status                                      |
| SUBMITTED -> UNDER_REVIEW -> ASSIGNED -> IN_PROGRESS |
+------------------------------------------------------+
| Progress                                             |
| Teknisi: Pemeriksaan awal selesai                    |
| Admin: Progress diperbarui karena ...                |
+------------------------------------------------------+
| Komentar                                             |
| Pelapor: Tambahan info ...                           |
| [Tulis komentar...] [Kirim]                          |
+------------------------------------------------------+
| Aksi sesuai role/status                              |
| [Edit] [Batalkan] [Konfirmasi Selesai] [Tolak Hasil] |
+------------------------------------------------------+
```

UX:
- Aksi yang tidak relevan disembunyikan.
- Timeline membantu pengguna memahami posisi laporan.

## 6. Review Admin

```text
+------------------------------------------------------+
| Review Admin                                         |
+------------------------------------------------------+
| Antrian: [UNDER_REVIEW] [REOPEN_REQUESTED] [Changed] |
+--------------------------+---------------------------+
| List Laporan             | Detail Laporan            |
| CSR-001 AC               | Judul, deskripsi, lokasi  |
| CSR-002 Internet         | Perubahan terbaru         |
|                          | Alasan perubahan          |
|                          |                           |
|                          | [Terima] [Tolak]          |
|                          | [Edit Data] [Assign]      |
|                          | [Merge Duplikat] [Tutup]  |
+--------------------------+---------------------------+
```

Dialog Tolak:
```text
Tolak laporan?
Alasan penolakan
[                                            ]
[Batal] [Tolak Laporan]
```

## 7. Assign dan Ganti Teknisi

```text
+------------------------------------------------------+
| Assign Teknisi - CSR-001                             |
+------------------------------------------------------+
| Teknisi utama                                        |
| [ Budi - Teknisi AC v ]                              |
| Tipe assignment                                      |
| [ PRIMARY v ]                                        |
| Alasan                                               |
| [                                                ]   |
| [Batal] [Assign]                                     |
+------------------------------------------------------+
```

Penggantian teknisi:
```text
+------------------------------------------------------+
| Penggantian Teknisi                                  |
| Teknisi lama: Budi                                   |
| Teknisi baru: Sari                                   |
| Status: Menunggu persetujuan teknisi lama dan baru   |
| [Kirim Permintaan]                                   |
+------------------------------------------------------+
```

## 8. Tugas Teknisi

```text
+------------------------------------------------------+
| Tugas Saya                                           |
+------------------------------------------------------+
| Filter: [Aktif] [Butuh Bantuan] [Menunggu Parts]     |
+------------------------------------------------------+
| CSR-001 | AC tidak dingin | Gedung A R201 | HIGH     |
| Status: ASSIGNED                                     |
| [Buka Detail] [Update Progress]                      |
+------------------------------------------------------+
```

## 9. Update Progress Teknisi

```text
+------------------------------------------------------+
| Update Progress - CSR-001                            |
+------------------------------------------------------+
| Status pekerjaan                                     |
| [IN_PROGRESS v]                                      |
| Catatan progress                                     |
| [                                                ]   |
| Estimasi selesai opsional                            |
| [ 2026-07-01 09:30 ]                                 |
| URL foto hasil opsional                              |
| [ https://...                                    ]   |
| [Batal] [Simpan Progress]                            |
+------------------------------------------------------+
```

Jika status `RESOLVED`:
```text
Setelah disimpan, pelapor akan diberi waktu 45 menit untuk konfirmasi.
```

## 10. Konfirmasi Hasil Pelapor

```text
+------------------------------------------------------+
| Konfirmasi Hasil Pekerjaan                           |
+------------------------------------------------------+
| Teknisi menyatakan pekerjaan selesai.                |
| Batas konfirmasi: 45 menit setelah selesai.          |
|                                                      |
| [Konfirmasi Selesai]        [Tolak Hasil]            |
+------------------------------------------------------+
```

Dialog Tolak Hasil:
```text
Tolak hasil pekerjaan?
Alasan penolakan
[                                            ]
[Batal] [Kirim Penolakan]
```

## 11. Notifikasi

```text
+------------------------------------------------------+
| Notifikasi                                           |
+------------------------------------------------------+
| [Belum Dibaca] [Semua]                               |
+------------------------------------------------------+
| Dot | CSR-001 membutuhkan konfirmasi | 5 menit lalu  |
|     | [Tandai dibaca] [Buka Laporan]                 |
|     | CSR-002 membutuhkan suku cadang | 1 jam lalu    |
+------------------------------------------------------+
```

UX:
- Notifikasi belum dibaca diberi indikator teks dan visual.
- Aksi utama adalah membuka laporan terkait.

## 12. Dashboard Manajer Fasilitas

```text
+------------------------------------------------------+
| Dashboard Manajer Fasilitas                          |
+------------------------------------------------------+
| Filter: [Kategori v] [Ruangan v] [Terbaru v]         |
+------------------------------------------------------+
| Total Selesai       | Kategori Terbanyak             |
| [ 128 ]             | AC: 45                         |
+------------------------------------------------------+
| Chart Kategori                                      |
| AC        ########                                  |
| Internet  #####                                     |
| Ruangan   ###                                       |
+------------------------------------------------------+
| Laporan Ringkas Terbaru                             |
| CSR-001 | Gedung A R201 | AC | CLOSED               |
+------------------------------------------------------+
```

## 13. Laporan Ringkas dan Export CSV

```text
+------------------------------------------------------+
| Laporan Ringkas                                      |
+------------------------------------------------------+
| Filter: [Kategori v] [Ruangan v] [Tanggal v]         |
| [Unduh CSV]                                          |
+------------------------------------------------------+
| Nomor | Ruangan | Kategori | Status | Tanggal        |
| CSR-1 | A-201   | AC       | CLOSED | 2026-07-01     |
+------------------------------------------------------+
```

## 14. Kelola Ruangan

```text
+------------------------------------------------------+
| Kelola Ruangan                                       |
+------------------------------------------------------+
| Gedung                                               |
| [ Gedung A                                      ]    |
| Lantai                                               |
| [ 2                                             ]    |
| Nama Ruangan                                         |
| [ Ruang 201                                     ]    |
| [Tambah Ruangan]                                     |
+------------------------------------------------------+
| Daftar Ruangan                                       |
| Gedung A | Lt 2 | Ruang 201 | [Edit]               |
+------------------------------------------------------+
```

## 15. Catatan Tindak Lanjut

```text
+------------------------------------------------------+
| Catatan Tindak Lanjut                                |
+------------------------------------------------------+
| Laporan terkait opsional                             |
| [ CSR-001 v ]                                        |
| Catatan                                              |
| [                                                ]   |
| Alasan                                               |
| [                                                ]   |
| [Simpan Catatan]                                     |
+------------------------------------------------------+
```

## Quality Check
- Wireframe mencakup halaman penting untuk semua role.
- Setiap form memiliki tujuan dan field jelas.
- Aksi berisiko memiliki dialog konfirmasi.
- Wireframe memperhatikan tampilan mobile untuk daftar laporan.
- Tidak ada data yang diminta di luar requirement.

## Human Review
Human review tahap wireframe sudah dilakukan oleh pengguna pada 1 Juli 2026 sebagai bagian dari review Skill 08.

## Keputusan Human Review
1. Struktur halaman dinilai cukup dan mudah dipahami.
2. Wireframe mendukung alur UX yang bagus dan mudah dipahami.
3. Tidak ada halaman yang perlu digabung atau dipisah pada tahap ini.
4. Istilah tombol dan status sudah cocok untuk pengguna kampus.
5. Alur mobile dinilai cukup nyaman untuk pelapor dan teknisi pada versi awal.

Tidak ada pertanyaan wireframe yang masih terbuka pada tahap ini.
