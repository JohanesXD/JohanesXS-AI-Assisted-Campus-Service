import { describe, it, expect } from "vitest";

// Replicating admin reject validation logic (from worker/index.ts)
interface RejectInput {
  role: string;
  reason?: string;
}

function validateAdminReject(input: RejectInput): { valid: boolean; error?: string } {
  if (input.role !== "ADMIN") {
    return { valid: false, error: "Hanya administrator (ADMIN) yang dapat menolak laporan." };
  }

  if (!input.reason || input.reason.trim().length < 5) {
    return { valid: false, error: "Alasan penolakan wajib diisi (minimal 5 karakter)." };
  }

  return { valid: true };
}

describe("Validasi Aksi Penolakan Laporan oleh Admin (FR-007, FR-008, FR-009)", () => {
  it("harus menyetujui penolakan jika role ADMIN dan alasan >= 5 karakter", () => {
    const input: RejectInput = {
      role: "ADMIN",
      reason: "Laporan duplikat dan tidak didukung foto"
    };
    expect(validateAdminReject(input)).toEqual({ valid: true });
  });

  it("harus menolak jika alasan kurang dari 5 karakter", () => {
    const input: RejectInput = {
      role: "ADMIN",
      reason: "No" // < 5 chars
    };
    expect(validateAdminReject(input).valid).toBe(false);
    expect(validateAdminReject(input).error).toBe("Alasan penolakan wajib diisi (minimal 5 karakter).");
  });

  it("harus menolak jika alasan kosong", () => {
    const input: RejectInput = {
      role: "ADMIN",
      reason: ""
    };
    expect(validateAdminReject(input).valid).toBe(false);
    expect(validateAdminReject(input).error).toBe("Alasan penolakan wajib diisi (minimal 5 karakter).");
  });

  it("harus menolak jika aktor yang mencoba melakukan penolakan bukan ADMIN", () => {
    const input: RejectInput = {
      role: "REPORTER",
      reason: "Laporan ini tidak valid setelah saya periksa"
    };
    expect(validateAdminReject(input).valid).toBe(false);
    expect(validateAdminReject(input).error).toBe("Hanya administrator (ADMIN) yang dapat menolak laporan.");
  });
});
