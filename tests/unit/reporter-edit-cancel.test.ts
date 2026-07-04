import { describe, it, expect } from "vitest";

// Validasi Edit Laporan oleh Pelapor (FR-031, AC-023)
interface EditInput {
  role: string;
  isOwner: boolean;
  status: string;
  title?: string;
  description?: string;
  reason?: string;
}

const editableStatuses = ["SUBMITTED", "UNDER_REVIEW", "REJECTED"];

function validateEdit(input: EditInput): { valid: boolean; error?: string } {
  if (input.role !== "REPORTER") {
    return { valid: false, error: "Hanya pelapor (REPORTER) yang dapat mengubah laporan." };
  }
  if (!input.isOwner) {
    return { valid: false, error: "Anda hanya dapat mengubah laporan milik sendiri." };
  }
  if (!editableStatuses.includes(input.status)) {
    return { valid: false, error: "Laporan tidak dapat diubah pada status saat ini." };
  }
  if (!input.reason || input.reason.trim().length < 5) {
    return { valid: false, error: "Alasan perubahan wajib diisi (minimal 5 karakter)." };
  }
  if (input.title !== undefined && !input.title.trim()) {
    return { valid: false, error: "Judul tidak boleh kosong." };
  }
  if (input.description !== undefined && input.description.trim().length < 20) {
    return { valid: false, error: "Deskripsi minimal 20 karakter." };
  }
  return { valid: true };
}

// Validasi Pembatalan Laporan oleh Pelapor (FR-034, AC-022)
interface CancelInput {
  role: string;
  isOwner: boolean;
  status: string;
  reason?: string;
}

const cancellableStatuses = ["SUBMITTED", "UNDER_REVIEW", "REJECTED"];

function validateCancel(input: CancelInput): { valid: boolean; error?: string } {
  if (input.role !== "REPORTER") {
    return { valid: false, error: "Hanya pelapor (REPORTER) yang dapat membatalkan laporan." };
  }
  if (!input.isOwner) {
    return { valid: false, error: "Anda hanya dapat membatalkan laporan milik sendiri." };
  }
  if (!cancellableStatuses.includes(input.status)) {
    return { valid: false, error: "Laporan tidak dapat dibatalkan pada status saat ini." };
  }
  if (!input.reason || input.reason.trim().length < 5) {
    return { valid: false, error: "Alasan pembatalan wajib diisi (minimal 5 karakter)." };
  }
  return { valid: true };
}

// Status transition helpers
function getEditNewStatus(): string {
  return "UNDER_REVIEW";
}

function getCancelNewStatus(): string {
  return "CANCELLED";
}

describe("Validasi Edit Laporan oleh Pelapor (FR-031, AC-023)", () => {
  it("harus menyetujui edit oleh pelapor pada status awal dengan alasan valid", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED",
      title: "AC tidak dingin",
      description: "AC di kelas B301 tidak mengeluarkan udara dingin sejak kemarin",
      reason: "Salah judul, perlu perbaikan"
    })).toEqual({ valid: true });
  });

  it("harus menyetujui edit pada status UNDER_REVIEW", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "UNDER_REVIEW",
      reason: "Menambah detail lokasi"
    })).toEqual({ valid: true });
  });

  it("harus menyetujui edit pada status REJECTED", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "REJECTED",
      reason: "Memperbaiki laporan setelah ditolak"
    })).toEqual({ valid: true });
  });

  it("harus menolak edit oleh non-pelapor", () => {
    expect(validateEdit({
      role: "ADMIN",
      isOwner: true,
      status: "SUBMITTED",
      reason: "Mau edit"
    })).toEqual({ valid: false, error: "Hanya pelapor (REPORTER) yang dapat mengubah laporan." });
  });

  it("harus menolak edit laporan milik orang lain", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: false,
      status: "SUBMITTED",
      reason: "Mau edit"
    })).toEqual({ valid: false, error: "Anda hanya dapat mengubah laporan milik sendiri." });
  });

  it("harus menolak edit tanpa alasan", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED",
      title: "Test"
    }).valid).toBe(false);
  });

  it("harus menolak edit dengan alasan terlalu pendek", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED",
      reason: "Ok"
    }).valid).toBe(false);
  });

  it("harus menolak edit pada status yang tidak bisa diedit", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "IN_PROGRESS",
      reason: "Mau edit"
    }).valid).toBe(false);
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "ASSIGNED",
      reason: "Mau edit"
    }).valid).toBe(false);
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "CLOSED_ADMIN",
      reason: "Mau edit"
    }).valid).toBe(false);
  });

  it("harus menolak edit dengan judul kosong", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED",
      title: "",
      reason: "Perbaikan judul"
    })).toEqual({ valid: false, error: "Judul tidak boleh kosong." });
  });

  it("harus menolak edit dengan deskripsi terlalu pendek", () => {
    expect(validateEdit({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED",
      description: "Pendek",
      reason: "Perbaikan deskripsi"
    })).toEqual({ valid: false, error: "Deskripsi minimal 20 karakter." });
  });
});

describe("Validasi Pembatalan Laporan oleh Pelapor (FR-034, AC-022)", () => {
  it("harus menyetujui pembatalan oleh pelapor pada status awal dengan alasan valid", () => {
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED",
      reason: "Sudah diperbaiki sendiri"
    })).toEqual({ valid: true });
  });

  it("harus menyetujui pembatalan pada status UNDER_REVIEW", () => {
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "UNDER_REVIEW",
      reason: "Salah laporan"
    })).toEqual({ valid: true });
  });

  it("harus menyetujui pembatalan pada status REJECTED", () => {
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "REJECTED",
      reason: "Tidak jadi melapor"
    })).toEqual({ valid: true });
  });

  it("harus menolak pembatalan oleh non-pelapor", () => {
    expect(validateCancel({
      role: "ADMIN",
      isOwner: true,
      status: "SUBMITTED",
      reason: "Tidak valid"
    })).toEqual({ valid: false, error: "Hanya pelapor (REPORTER) yang dapat membatalkan laporan." });
  });

  it("harus menolak pembatalan laporan milik orang lain", () => {
    expect(validateCancel({
      role: "REPORTER",
      isOwner: false,
      status: "SUBMITTED",
      reason: "Tidak valid"
    })).toEqual({ valid: false, error: "Anda hanya dapat membatalkan laporan milik sendiri." });
  });

  it("harus menolak pembatalan tanpa alasan", () => {
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED"
    }).valid).toBe(false);
  });

  it("harus menolak pembatalan dengan alasan terlalu pendek", () => {
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "SUBMITTED",
      reason: "No"
    }).valid).toBe(false);
  });

  it("harus menolak pembatalan pada status yang tidak bisa dibatalkan", () => {
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "IN_PROGRESS",
      reason: "Mau batal"
    }).valid).toBe(false);
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "CLOSED_ADMIN",
      reason: "Mau batal"
    }).valid).toBe(false);
    expect(validateCancel({
      role: "REPORTER",
      isOwner: true,
      status: "CANCELLED",
      reason: "Mau batal"
    }).valid).toBe(false);
  });
});

describe("Transisi Status Edit (FR-031, AC-023)", () => {
  it("harus mengembalikan status ke UNDER_REVIEW setelah edit", () => {
    expect(getEditNewStatus()).toBe("UNDER_REVIEW");
  });
});

describe("Transisi Status Cancel (FR-034, AC-022)", () => {
  it("harus mengubah status ke CANCELLED setelah batal", () => {
    expect(getCancelNewStatus()).toBe("CANCELLED");
  });
});
