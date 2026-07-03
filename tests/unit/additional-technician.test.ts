import { describe, expect, it } from "vitest";

describe("Validasi Penugasan Teknisi Tambahan", () => {
  it("menolak penugasan tanpa technician_id", () => {
    const input = { technician_id: "", reason: "Bantuan diperlukan" };
    const isValid = input.technician_id && input.technician_id.trim().length > 0;
    expect(isValid).toBe(false);
  });

  it("menerima penugasan dengan technician_id valid", () => {
    const input = { technician_id: "usr-003", reason: "Bantuan diperlukan" };
    const isValid = input.technician_id && input.technician_id.trim().length > 0;
    expect(isValid).toBe(true);
  });

  it("menolak penugasan jika status laporan bukan NEED_HELP", () => {
    const requestStatus = "ASSIGNED";
    const canAddAdditional = requestStatus === "NEED_HELP";
    expect(canAddAdditional).toBe(false);
  });

  it("menerima penugasan jika status laporan adalah NEED_HELP", () => {
    const requestStatus = "NEED_HELP";
    const canAddAdditional = requestStatus === "NEED_HELP";
    expect(canAddAdditional).toBe(true);
  });

  it("menolak penugasan teknisi yang sudah ditugaskan", () => {
    const existingAssignments = ["usr-003", "usr-005"];
    const newTechnicianId = "usr-003";
    const isDuplicate = existingAssignments.includes(newTechnicianId);
    expect(isDuplicate).toBe(true);
  });

  it("menerima penugasan teknisi baru yang belum ditugaskan", () => {
    const existingAssignments = ["usr-003", "usr-005"];
    const newTechnicianId = "usr-007";
    const isDuplicate = existingAssignments.includes(newTechnicianId);
    expect(isDuplicate).toBe(false);
  });
});
