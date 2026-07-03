import { describe, it, expect } from "vitest";

// Replicating comment validation logic (from worker/index.ts)
interface CommentInput {
  content?: string;
}

function validateComment(input: CommentInput): { valid: boolean; error?: string } {
  if (!input.content || input.content.trim().length < 5) {
    return { valid: false, error: "Komentar wajib diisi (minimal 5 karakter)." };
  }

  return { valid: true };
}

describe("Validasi Komentar Tambahan oleh Pelapor (FR-016, FR-017)", () => {
  it("harus menyetujui komentar yang valid (>= 5 karakter)", () => {
    const input: CommentInput = {
      content: "Masalah ini terjadi lagi hari ini saat jam kuliah pagi."
    };
    expect(validateComment(input)).toEqual({ valid: true });
  });

  it("harus menolak komentar yang kurang dari 5 karakter", () => {
    const input: CommentInput = {
      content: "OK"
    };
    expect(validateComment(input).valid).toBe(false);
    expect(validateComment(input).error).toBe("Komentar wajib diisi (minimal 5 karakter).");
  });

  it("harus menolak komentar kosong (undefined)", () => {
    const input: CommentInput = {};
    expect(validateComment(input).valid).toBe(false);
    expect(validateComment(input).error).toBe("Komentar wajib diisi (minimal 5 karakter).");
  });

  it("harus menolak komentar yang hanya berisi spasi", () => {
    const input: CommentInput = {
      content: "    "
    };
    expect(validateComment(input).valid).toBe(false);
    expect(validateComment(input).error).toBe("Komentar wajib diisi (minimal 5 karakter).");
  });
});
