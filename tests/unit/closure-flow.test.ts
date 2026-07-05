import { describe, it, expect } from "vitest";

interface ClosureInput {
  status: string;
  reason?: string;
}

const closedStatuses = ["CLOSED_AUTO", "CLOSED_ADMIN", "CLOSED_REPORTER_CONFIRMED"];

function validateConfirmResolution(input: { status: string }): { valid: boolean; error?: string } {
  if (input.status !== "WAITING_REPORTER_CONFIRMATION") {
    return { valid: false, error: "Laporan tidak dalam status menunggu konfirmasi." };
  }
  return { valid: true };
}

function validateRejectResolution(input: ClosureInput): { valid: boolean; error?: string } {
  if (input.status !== "WAITING_REPORTER_CONFIRMATION") {
    return { valid: false, error: "Laporan tidak dalam status menunggu konfirmasi." };
  }
  if (!input.reason || input.reason.trim().length < 5) {
    return { valid: false, error: "Alasan penolakan wajib diisi (minimal 5 karakter)." };
  }
  return { valid: true };
}

function validateAdminClose(input: { status: string }): { valid: boolean; error?: string } {
  if (closedStatuses.includes(input.status)) {
    return { valid: false, error: "Laporan sudah ditutup." };
  }
  return { valid: true };
}

function validateAdminReopen(input: { status: string }): { valid: boolean; error?: string } {
  if (input.status !== "REOPEN_REQUESTED") {
    return { valid: false, error: "Hanya laporan berstatus REOPEN_REQUESTED yang dapat dibuka ulang." };
  }
  return { valid: true };
}

function validateResolve(input: { status: string }): { valid: boolean; error?: string } {
  if (input.status !== "IN_PROGRESS") {
    return { valid: false, error: "Hanya laporan berstatus IN_PROGRESS yang dapat diselesaikan." };
  }
  return { valid: true };
}

function validateStart(input: { status: string }): { valid: boolean; error?: string } {
  if (input.status !== "ASSIGNED" && input.status !== "REOPENED") {
    return { valid: false, error: "Hanya laporan berstatus ASSIGNED atau REOPENED yang dapat dimulai." };
  }
  return { valid: true };
}

describe("Validasi Start (FR-012)", () => {
  it("harus menyetujui start dari ASSIGNED atau REOPENED", () => {
    expect(validateStart({ status: "ASSIGNED" })).toEqual({ valid: true });
    expect(validateStart({ status: "REOPENED" })).toEqual({ valid: true });
  });

  it("harus menolak start dari status selain ASSIGNED atau REOPENED", () => {
    expect(validateStart({ status: "SUBMITTED" }).valid).toBe(false);
    expect(validateStart({ status: "IN_PROGRESS" }).valid).toBe(false);
  });
});

describe("Validasi Resolve (FR-018)", () => {
  it("harus menyetujui resolve dari IN_PROGRESS", () => {
    expect(validateResolve({ status: "IN_PROGRESS" })).toEqual({ valid: true });
  });

  it("harus menolak resolve dari status selain IN_PROGRESS", () => {
    expect(validateResolve({ status: "SUBMITTED" }).valid).toBe(false);
    expect(validateResolve({ status: "REJECTED" }).valid).toBe(false);
  });
});

describe("Validasi Konfirmasi Pelapor (FR-018)", () => {
  it("harus menyetujui konfirmasi dari WAITING_REPORTER_CONFIRMATION", () => {
    expect(validateConfirmResolution({ status: "WAITING_REPORTER_CONFIRMATION" })).toEqual({ valid: true });
  });

  it("harus menolak konfirmasi dari status lain", () => {
    expect(validateConfirmResolution({ status: "IN_PROGRESS" }).valid).toBe(false);
    expect(validateConfirmResolution({ status: "CLOSED_REPORTER_CONFIRMED" }).valid).toBe(false);
  });
});

describe("Validasi Penolakan Hasil oleh Pelapor (FR-036)", () => {
  it("harus menyetujui penolakan dengan alasan valid", () => {
    expect(validateRejectResolution({ status: "WAITING_REPORTER_CONFIRMATION", reason: "Masih ada kebocoran" })).toEqual({ valid: true });
  });

  it("harus menolak penolakan tanpa alasan", () => {
    expect(validateRejectResolution({ status: "WAITING_REPORTER_CONFIRMATION" }).valid).toBe(false);
  });

  it("harus menolak penolakan dengan alasan terlalu pendek", () => {
    expect(validateRejectResolution({ status: "WAITING_REPORTER_CONFIRMATION", reason: "No" }).valid).toBe(false);
  });

  it("harus menolak penolakan dari status non-konfirmasi", () => {
    expect(validateRejectResolution({ status: "RESOLVED", reason: "Masih ada masalah" }).valid).toBe(false);
  });
});

describe("Validasi Penutupan oleh Admin (FR-021)", () => {
  it("harus menyetujui penutupan laporan aktif", () => {
    expect(validateAdminClose({ status: "IN_PROGRESS" })).toEqual({ valid: true });
    expect(validateAdminClose({ status: "SUBMITTED" })).toEqual({ valid: true });
    expect(validateAdminClose({ status: "WAITING_REPORTER_CONFIRMATION" })).toEqual({ valid: true });
  });

  it("harus menolak penutupan laporan yang sudah ditutup", () => {
    expect(validateAdminClose({ status: "CLOSED_AUTO" }).valid).toBe(false);
    expect(validateAdminClose({ status: "CLOSED_ADMIN" }).valid).toBe(false);
    expect(validateAdminClose({ status: "CLOSED_REPORTER_CONFIRMED" }).valid).toBe(false);
  });
});

describe("Validasi Pembukaan Ulang oleh Admin (FR-036)", () => {
  it("harus menyetujui reopen dari REOPEN_REQUESTED", () => {
    expect(validateAdminReopen({ status: "REOPEN_REQUESTED" })).toEqual({ valid: true });
  });

  it("harus menolak reopen dari status lain", () => {
    expect(validateAdminReopen({ status: "CLOSED_AUTO" }).valid).toBe(false);
    expect(validateAdminReopen({ status: "WAITING_REPORTER_CONFIRMATION" }).valid).toBe(false);
  });
});
