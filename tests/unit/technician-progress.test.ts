import { describe, it, expect } from "vitest";

// Replicating technician progress validation logic (from worker/index.ts)
interface ProgressInput {
  role: string;
  status?: string;
  notes?: string;
}

function validateTechnicianProgress(input: ProgressInput): { valid: boolean; error?: string } {
  if (input.role !== "TECHNICIAN") {
    return { valid: false, error: "Hanya teknisi (TECHNICIAN) yang dapat memperbarui progress." };
  }

  if (!input.status || !input.notes) {
    return { valid: false, error: "Kolom status dan catatan progress wajib diisi." };
  }

  if (!["ASSIGNED", "IN_PROGRESS", "ON_HOLD", "RESOLVED"].includes(input.status)) {
    return { valid: false, error: "Status progress tidak valid." };
  }

  if (input.notes.trim().length < 5) {
    return { valid: false, error: "Catatan progress wajib diisi (minimal 5 karakter)." };
  }

  return { valid: true };
}

describe("Validasi Penerimaan & Pembaruan Progress Laporan oleh Teknisi (FR-012, FR-013)", () => {
  it("harus menyetujui progress yang lengkap dengan status dan catatan valid", () => {
    const input: ProgressInput = {
      role: "TECHNICIAN",
      status: "IN_PROGRESS",
      notes: "Suku cadang sudah dipesan dan akan dipasang besok."
    };
    expect(validateTechnicianProgress(input)).toEqual({ valid: true });
  });

  it("harus menolak jika catatan progress kurang dari 5 karakter", () => {
    const input: ProgressInput = {
      role: "TECHNICIAN",
      status: "IN_PROGRESS",
      notes: "OK" // < 5 chars
    };
    expect(validateTechnicianProgress(input).valid).toBe(false);
    expect(validateTechnicianProgress(input).error).toBe("Catatan progress wajib diisi (minimal 5 karakter).");
  });

  it("harus menolak jika status progress tidak dikenali", () => {
    const input: ProgressInput = {
      role: "TECHNICIAN",
      status: "COMPLETED", // Tidak valid
      notes: "Perbaikan instalasi kabel power selesai."
    };
    expect(validateTechnicianProgress(input).valid).toBe(false);
    expect(validateTechnicianProgress(input).error).toBe("Status progress tidak valid.");
  });

  it("harus menolak jika aktor yang mencoba memperbarui progress bukan TECHNICIAN", () => {
    const input: ProgressInput = {
      role: "ADMIN",
      status: "RESOLVED",
      notes: "Saya tandai laporan ini selesai setelah melakukan verifikasi."
    };
    expect(validateTechnicianProgress(input).valid).toBe(false);
    expect(validateTechnicianProgress(input).error).toBe("Hanya teknisi (TECHNICIAN) yang dapat memperbarui progress.");
  });
});
