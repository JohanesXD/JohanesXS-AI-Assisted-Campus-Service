import { describe, it, expect } from "vitest";

interface CommentInput {
  comment?: string;
}

function validateComment(input: CommentInput): { valid: boolean; error?: string } {
  if (!input.comment || input.comment.trim().length === 0) {
    return { valid: false, error: "Komentar tidak boleh kosong." };
  }
  return { valid: true };
}

describe("Validasi Komentar Pelapor (FR-017)", () => {
  it("harus menyetujui komentar yang tidak kosong", () => {
    expect(validateComment({ comment: "Tolong segera diperbaiki." })).toEqual({ valid: true });
  });

  it("harus menolak komentar kosong", () => {
    expect(validateComment({ comment: "" }).valid).toBe(false);
    expect(validateComment({ comment: "" }).error).toBe("Komentar tidak boleh kosong.");
  });

  it("harus menolak komentar hanya spasi", () => {
    expect(validateComment({ comment: "   " }).valid).toBe(false);
  });

  it("harus menolak jika properti comment tidak ada", () => {
    expect(validateComment({}).valid).toBe(false);
  });
});
