# 10 Implementation Notes: FR-001 - Login Akun Kampus

Dokumen ini mencatat detail implementasi, hasil pengujian, dan riwayat review untuk Issue 1 ([FR-001]) tentang Login Akun Kampus dan Kontrol Hak Akses.

---

## PR: FR-01 - Login Akun Kampus

### Goal
Mengimplementasikan form login simulasi dan pembatasan hak akses berbasis peran (REPORTER, ADMIN, TECHNICIAN, FACILITY_MANAGER) baik di sisi frontend maupun backend, lengkap dengan migrasi database dan pengujian unit.

### Changes
1. **[0002_core_reference.sql](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/database/migrations/0002_core_reference.sql)**: Membuat tabel `users`, `categories`, `rooms` dan memasukkan data awal (*seed data*).
2. **[worker/index.ts](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/worker/index.ts)**: Menambahkan endpoint `POST /api/auth/login` dan validasi otorisasi header `X-User-Email` serta `X-User-Role`.
3. **[src/App.tsx](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/src/App.tsx)**: Membuat form login simulasi, penyimpanan session ke `localStorage`, tombol logout, dan tata letak panel dinamis berdasarkan role.
4. **[src/App.css](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/src/App.css)**: Menambahkan class CSS premium untuk login card, form input, tabel, dan badge role.
5. **[package.json](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/package.json)**: Memasang `vitest` sebagai devDependency dan menambahkan script `"test": "vitest run"`.
6. **[tests/unit/auth-validation.test.ts](file:///C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service/tests/unit/auth-validation.test.ts)**: Membuat test suite untuk memvalidasi format email kampus.

### Verification
Pengujian unit dijalankan menggunakan perintah `npm test` dengan hasil sukses:
```text
 RUN  v4.1.9 C:/Users/USER/.gemini/antigravity/scratch/JohanesXS-AI-Assisted-Campus-Service

 ✓ tests/unit/auth-validation.test.ts (4 tests) 13ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Duration  1.17s
```

---

## AI Evidence & Human Review

### Prompt/Invocation
> "Mulai dan jangan lupa untuk mengecek apakah sudah sesuai dengan file instruksi dan referensi yang saya berikan"

### Output AI
- Membuat migrasi skema tabel D1 dan seeding data user.
- Mengimplementasikan endpoint auth login dan pengecekan otorisasi header pada Worker.
- Membangun UI Login form premium beserta validasi di sisi frontend.
- Menyusun unit test untuk fungsi pengecekan email kampus.

### Human Review
*(Menunggu penilaian dan tanggapan dari pengguna)*

### Hasil Final
- **Status:** **DRAFT / IN-REVIEW**

---

## Traceability Matrix

| Requirement ID | Deskripsi Requirement | File Kode / Modul | File Test Terkait |
| :--- | :--- | :--- | :--- |
| **FR-001** | Mengizinkan login dengan akun kampus | `src/App.tsx`, `worker/index.ts` | `tests/unit/auth-validation.test.ts` |
| **NFR-001** | Batasi pembuatan/pemantauan hanya untuk user login | `src/App.tsx`, `worker/index.ts` | `tests/unit/auth-validation.test.ts` |
| **NFR-003** | Pembagian hak akses berbasis role | `src/App.tsx`, `worker/index.ts` | - |
