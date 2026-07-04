import { describe, it, expect } from "vitest";

// Replicating technician assign validation logic (from worker/index.ts)
interface AssignInput {
  role: string;
  technician_id?: string;
}

function validateTechnicianAssign(input: AssignInput): { valid: boolean; error?: string } {
  if (input.role !== "ADMIN") {
    return { valid: false, error: "Hanya administrator (ADMIN) yang dapat menugaskan laporan." };
  }

  if (!input.technician_id) {
    return { valid: false, error: "Teknisi wajib dipilih." };
  }

  return { valid: true };
}

describe("Validasi Penugasan Laporan kepada Teknisi (FR-010, FR-011)", () => {
  it("harus menyetujui penugasan jika role ADMIN dan teknisi terpilih", () => {
    const input: AssignInput = {
      role: "ADMIN",
      technician_id: "usr-tech-001"
    };
    expect(validateTechnicianAssign(input)).toEqual({ valid: true });
  });

  it("harus menolak jika teknisi tidak dipilih", () => {
    const input: AssignInput = {
      role: "ADMIN",
      technician_id: "" // Kosong
    };
    expect(validateTechnicianAssign(input).valid).toBe(false);
    expect(validateTechnicianAssign(input).error).toBe("Teknisi wajib dipilih.");
  });

  it("harus menolak jika aktor yang mencoba menugaskan bukan ADMIN", () => {
    const input: AssignInput = {
      role: "TECHNICIAN",
      technician_id: "usr-tech-002"
    };
    expect(validateTechnicianAssign(input).valid).toBe(false);
    expect(validateTechnicianAssign(input).error).toBe("Hanya administrator (ADMIN) yang dapat menugaskan laporan.");
  });
});
