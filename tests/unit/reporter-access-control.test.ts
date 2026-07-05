import { describe, it, expect } from "vitest";

function isStudentEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.includes("student") || lower.includes("mhs");
}

function checkAccess(requesterEmail: string, ownerEmail: string): boolean {
  const isUserStudent = isStudentEmail(requesterEmail);
  const isOwnerStudent = isStudentEmail(ownerEmail);
  return isUserStudent === isOwnerStudent;
}

describe("Access Control Antara Laporan Dosen dan Laporan Student", () => {
  it("harus mengizinkan akses jika keduanya adalah student", () => {
    expect(checkAccess("student1@campus.ac.id", "student2@campus.ac.id")).toBe(true);
    expect(checkAccess("johanes@student.unklab.ac.id", "smith@student.unklab.ac.id")).toBe(true);
  });

  it("harus mengizinkan akses jika keduanya adalah dosen/lecturer", () => {
    expect(checkAccess("lecturer1@campus.ac.id", "lecturer2@campus.ac.id")).toBe(true);
    expect(checkAccess("dosen@unklab.ac.id", "dekan@unklab.ac.id")).toBe(true);
  });

  it("harus menolak akses jika student mencoba mengakses laporan dosen", () => {
    expect(checkAccess("student1@campus.ac.id", "lecturer1@campus.ac.id")).toBe(false);
    expect(checkAccess("johanes@student.unklab.ac.id", "dosen@unklab.ac.id")).toBe(false);
  });

  it("harus menolak akses jika dosen mencoba mengakses laporan student", () => {
    expect(checkAccess("lecturer1@campus.ac.id", "student1@campus.ac.id")).toBe(false);
    expect(checkAccess("dosen@unklab.ac.id", "johanes@student.unklab.ac.id")).toBe(false);
  });
});
