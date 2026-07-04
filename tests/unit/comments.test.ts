import { describe, it, expect } from "vitest";

interface CommentInput {
  content?: string;
}

function validateComment(input: CommentInput): { valid: boolean; error?: string } {
  if (!input.content || input.content.trim().length < 5) {
    return { valid: false, error: "Komentar wajib diisi (minimal 5 karakter)." };
  }
  return { valid: true };
}

describe("Validasi Komentar Pelapor (FR-017)", () => {
  it("harus menyetujui komentar yang tidak kosong", () => {
    expect(validateComment({ content: "Tolong segera diperbaiki." })).toEqual({ valid: true });
  });

  it("harus menolak komentar kosong", () => {
    expect(validateComment({ content: "" }).valid).toBe(false);
    expect(validateComment({ content: "" }).error).toBe("Komentar wajib diisi (minimal 5 karakter).");
  });

  it("harus menolak komentar hanya spasi", () => {
    expect(validateComment({ content: "   " }).valid).toBe(false);
  });

  it("harus menolak jika properti content tidak ada", () => {
    expect(validateComment({}).valid).toBe(false);
  });
});
