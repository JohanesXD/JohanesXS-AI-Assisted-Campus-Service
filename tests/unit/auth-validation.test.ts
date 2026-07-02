import { describe, it, expect } from "vitest";

// Helper to validate campus email format (copied from worker/index.ts for unit test validation)
function isValidCampusEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return email.endsWith(".ac.id") || email.endsWith("campus.ac.id");
}

describe("Validasi Email Kampus (FR-001)", () => {
  it("harus menyetujui email kampus yang valid", () => {
    expect(isValidCampusEmail("student@campus.ac.id")).toBe(true);
    expect(isValidCampusEmail("admin@campus.ac.id")).toBe(true);
    expect(isValidCampusEmail("tech@student.campus.ac.id")).toBe(true);
    expect(isValidCampusEmail("manager@lecturer.campus.ac.id")).toBe(true);
  });

  it("harus menolak email kosong atau tidak lengkap", () => {
    expect(isValidCampusEmail("")).toBe(false);
    expect(isValidCampusEmail("student")).toBe(false);
    expect(isValidCampusEmail("@campus.ac.id")).toBe(false);
  });

  it("harus menolak email personal/komersial non-kampus", () => {
    expect(isValidCampusEmail("student@gmail.com")).toBe(false);
    expect(isValidCampusEmail("admin@yahoo.co.id")).toBe(false);
    expect(isValidCampusEmail("tech@outlook.com")).toBe(false);
  });

  it("harus menolak email dengan domain institusi non-akademik", () => {
    expect(isValidCampusEmail("staff@campus.or.id")).toBe(false);
    expect(isValidCampusEmail("manager@campus.go.id")).toBe(false);
  });
});
