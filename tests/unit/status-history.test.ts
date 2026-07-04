import { describe, it, expect } from "vitest";

interface StatusHistoryEntry {
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
}

function validateStatusTransition(entry: StatusHistoryEntry): { valid: boolean; error?: string } {
  if (!entry.toStatus) {
    return { valid: false, error: "Status tujuan wajib diisi." };
  }
  const validStatuses = [
    "SUBMITTED", "UNDER_REVIEW", "REJECTED", "ASSIGNED",
    "IN_PROGRESS", "NEED_HELP", "WAITING_PARTS", "PAUSED",
    "RESOLVED", "WAITING_REPORTER_CONFIRMATION",
    "REOPEN_REQUESTED", "REOPENED", "CANCELLED",
    "CLOSED_AUTO", "CLOSED_ADMIN", "CLOSED_REPORTER_CONFIRMED"
  ];
  if (!validStatuses.includes(entry.toStatus)) {
    return { valid: false, error: "Status tujuan tidak valid." };
  }
  if (entry.toStatus === "REJECTED" && (!entry.reason || entry.reason.trim().length < 5)) {
    return { valid: false, error: "Alasan penolakan wajib diisi minimal 5 karakter." };
  }
  return { valid: true };
}

describe("Validasi Riwayat Status (FR-016)", () => {
  it("harus menyetujui transisi status yang valid", () => {
    expect(validateStatusTransition({ fromStatus: null, toStatus: "SUBMITTED", reason: null })).toEqual({ valid: true });
  });

  it("harus menolak status tujuan yang tidak dikenal", () => {
    expect(validateStatusTransition({ fromStatus: "SUBMITTED", toStatus: "UNKNOWN_STATUS", reason: null }).valid).toBe(false);
  });

  it("harus menolak penolakan tanpa alasan yang cukup", () => {
    expect(validateStatusTransition({ fromStatus: "SUBMITTED", toStatus: "REJECTED", reason: "No" }).valid).toBe(false);
  });

  it("harus menyetujui penolakan dengan alasan valid", () => {
    expect(validateStatusTransition({ fromStatus: "SUBMITTED", toStatus: "REJECTED", reason: "Laporan tidak valid karena deskripsi tidak sesuai." })).toEqual({ valid: true });
  });

  it("harus menolak status tujuan kosong", () => {
    expect(validateStatusTransition({ fromStatus: "SUBMITTED", toStatus: "", reason: null }).valid).toBe(false);
  });
});
