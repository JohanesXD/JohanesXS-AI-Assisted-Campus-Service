# 15 Deployment Report: Campus Service Request and Maintenance System

## 1. Pendahuluan
Dokumen ini mendokumentasikan proses kompilasi rilis, arsitektur target, konfigurasi lingkungan, dan verifikasi deployment untuk aplikasi **Campus Service Request and Maintenance System**.

---

## 2. Arsitektur Target & Lingkungan

Sistem ini didesain khusus untuk berjalan pada infrastruktur Cloudflare:
1. **Backend API**: Cloudflare Workers (dengan berkas konfigurasi `wrangler.jsonc`).
2. **Database Relasional**: Cloudflare D1 Database (bound dengan alias `DB`).
3. **Frontend Assets**: Cloudflare Pages (mempublikasikan direktori `dist/client`).

---

## 3. Konfigurasi Lingkungan (Environment Variables & Bindings)

Berikut adalah daftar variabel lingkungan dan binding sumber daya yang dikonfigurasi:

| Nama Binding / Variabel | Jenis | Nilai Target | Deskripsi |
| :--- | :--- | :--- | :--- |
| **`DB`** | Cloudflare D1 Binding | `campus-maintenance-db` | Koneksi basis data SQLite D1 untuk penyimpanan data relasional. |
| **`database_id`** | D1 DB Identifier | `91377e25-864f-47d9-b0b4-fcf15c241fd8` | ID unik database di akun Cloudflare. |

---

## 4. Langkah Migrasi & Deployment

### Langkah A: Build Produksi
1. Jalankan perintah kompilasi frontend dan backend:
   ```bash
   npm run build
   ```
2. Hasil build tersimpan pada folder `dist/` sebagai berikut:
   * Backend Worker: `dist/ai_assisted_campus_service/index.js`
   * Frontend Pages: `dist/client/`

### Langkah B: Migrasi Basis Data (D1 Database)
1. Terapkan seluruh berkas skema migrasi D1 (dari `0001_init.sql` s/d `0012_admin_management.sql`):
   ```bash
   npx wrangler d1 migrations apply campus-maintenance-db --remote
   ```

### Langkah C: Publikasi Aplikasi
1. Upload dan deploy backend Worker:
   ```bash
   npx wrangler deploy
   ```
2. Upload assets frontend ke Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist/client --project-name=ai-assisted-campus-service
   ```

---

## 5. Hasil Uji Deployment & Verifikasi (Staging / Production)
* **Status Build Lokal**: **SUCCESS** (Kompilasi TypeScript dan bundler Vite berjalan lancar tanpa error).
* **URL Hasil Deployment**: `https://ai-assisted-campus-service.pages.dev` (Target URL).
* **Hasil Verifikasi Fungsional**:
  * Pengecekan dasar respons endpoint `/api/reports/stats` berjalan sukses dengan mengembalikan header JSON yang valid.
  * Form Login simulasi dan layout antarmuka di `dist/client` termuat sempurna di browser modern.

---

## 6. Asumsi Deployment (Deployment Assumptions)
* `[ASUMSI]` Akun Cloudflare target memiliki kuota yang cukup untuk menampung database D1 dan kueri Workers gratis (Free Tier) atau berbayar.
* `[ASUMSI]` Kredensial rahasia (CLOUDFLARE_API_TOKEN) telah disuntikkan ke dalam GitHub Actions Secret untuk alur CI/CD otomatis.

---

## Reviewer & Feedback Kebutuhan Pengguna
* **Hal yang Memerlukan Review Pengguna**: Pengguna harus memverifikasi bahwa akun Cloudflare pribadinya sudah diatur dengan database bernama `campus-maintenance-db` dan ID-nya disesuaikan pada berkas `wrangler.jsonc` sebelum melakukan pembersihan CD final.
* **Reviewer**: JohanesXD
* **Keputusan**: **READY FOR DEPLOYMENT (SIAP UNTUK DIPUBLIKASIKAN)**
