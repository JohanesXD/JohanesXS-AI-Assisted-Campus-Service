import { describe, it, expect } from "vitest";

// Validation helper replicating backend logic (from worker/index.ts)
interface RequestInput {
  title?: string;
  description?: string;
  category_id?: string;
  room_id?: string;
  urgency?: string;
}

function validateRequestInput(input: RequestInput): { valid: boolean; error?: string } {
  if (
    !input.title ||
    !input.description ||
    !input.category_id ||
    !input.room_id ||
    !input.urgency
  ) {
    return { valid: false, error: "Semua field wajib diisi." };
  }

  if (input.description.trim().length < 20) {
    return { valid: false, error: "Deskripsi minimal 20 karakter." };
  }

  if (!["LOW", "MEDIUM", "HIGH", "URGENT"].includes(input.urgency)) {
    return { valid: false, error: "Tingkat urgensi tidak valid." };
  }

  return { valid: true };
}

describe("Validasi Form Pengajuan Laporan (FR-002)", () => {
  it("harus menyetujui data laporan yang lengkap dan valid", () => {
    const input: RequestInput = {
      title: "Proyektor Kelas A101 Mati",
      description: "Proyektor di kelas A101 tidak bisa dinyalakan meskipun kabel power sudah terhubung.",
      category_id: "cat-003",
      room_id: "rm-001",
      urgency: "MEDIUM"
    };
    expect(validateRequestInput(input)).toEqual({ valid: true });
  });

  it("harus menolak jika ada parameter wajib yang kosong", () => {
    const input: RequestInput = {
      title: "AC Rusak",
      description: "AC berisik sekali dan bocor air di lantai.",
      category_id: "cat-002",
      room_id: "", // Kosong
      urgency: "HIGH"
    };
    expect(validateRequestInput(input).valid).toBe(false);
    expect(validateRequestInput(input).error).toBe("Semua field wajib diisi.");
  });

  it("harus menolak jika deskripsi kurang dari 20 karakter", () => {
    const input: RequestInput = {
      title: "AC Rusak",
      description: "AC tidak dingin.", // Kurang dari 20 karakter
      category_id: "cat-002",
      room_id: "rm-002",
      urgency: "HIGH"
    };
    expect(validateRequestInput(input).valid).toBe(false);
    expect(validateRequestInput(input).error).toBe("Deskripsi minimal 20 karakter.");
  });

  it("harus menolak jika tingkat urgensi tidak sesuai daftar", () => {
    const input: RequestInput = {
      title: "AC Rusak",
      description: "AC di kelas bocor deras airnya di belakang meja dosen.",
      category_id: "cat-002",
      room_id: "rm-002",
      urgency: "VERY_URGENT" // Tidak valid
    };
    expect(validateRequestInput(input).valid).toBe(false);
    expect(validateRequestInput(input).error).toBe("Tingkat urgensi tidak valid.");
  });
});
