import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDb = {
  prepare: vi.fn(),
  bind: vi.fn().mockReturnThis(),
  first: vi.fn(),
  all: vi.fn().mockReturnValue({ results: [] }),
  run: vi.fn().mockReturnValue({}),
};

const env = { DB: mockDb as any };

function createRequest(method: string, pathname: string, body?: object, headers?: Record<string, string>) {
  const url = new URL(`http://localhost${pathname}`);
  return new Request(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-User-Email": headers?.["X-User-Email"] || "manager@campus.ac.id",
      "X-User-Role": headers?.["X-User-Role"] || "FACILITY_MANAGER",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

import worker from "../../worker/index";

describe("FR-14: Room Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========== GET /api/rooms/grouped ==========
  describe("GET /api/rooms/grouped", () => {
    it("AC-28.1: Dapat melihat daftar ruangan dengan grouping gedung dan lantai", async () => {
      mockDb.all.mockResolvedValueOnce({
        results: [
          { building: "Gedung A", floor: "Lantai 1", id: "rm-001", room_name: "Ruang 101" },
          { building: "Gedung A", floor: "Lantai 1", id: "rm-002", room_name: "Ruang 102" },
          { building: "Gedung A", floor: "Lantai 2", id: "rm-003", room_name: "Ruang 201" },
          { building: "Gedung B", floor: "Lantai 1", id: "rm-004", room_name: "Lab Komputer" },
        ],
      });

      const request = createRequest("GET", "/api/rooms/grouped");
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data).toBeDefined();
      expect(body.data["Gedung A"]).toBeDefined();
      expect(body.data["Gedung A"]["Lantai 1"]).toHaveLength(2);
      expect(body.data["Gedung B"]["Lantai 1"]).toHaveLength(1);
    });

    it("AC-28.2: Daftar ruangan kosong jika tidak ada data", async () => {
      mockDb.all.mockResolvedValueOnce({ results: [] });

      const request = createRequest("GET", "/api/rooms/grouped");
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(Object.keys(body.data)).toHaveLength(0);
    });
  });

  // ========== POST /api/rooms ==========
  describe("POST /api/rooms", () => {
    it("AC-28.3: Facility Manager dapat menambahkan ruangan baru", async () => {
      mockDb.first.mockResolvedValueOnce(null);
      mockDb.run.mockResolvedValue({});

      const request = createRequest("POST", "/api/rooms", {
        building: "Gedung C",
        floor: "Lantai 1",
        room_name: "Ruang Baru 101",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.room.building).toBe("Gedung C");
    });

    it("AC-28.4: Validasi building wajib diisi", async () => {
      const request = createRequest("POST", "/api/rooms", {
        floor: "Lantai 1",
        room_name: "Ruang 101",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(422);
    });

    it("AC-28.5: Validasi floor wajib diisi", async () => {
      const request = createRequest("POST", "/api/rooms", {
        building: "Gedung C",
        room_name: "Ruang 101",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(422);
    });

    it("AC-28.6: Validasi room_name wajib diisi", async () => {
      const request = createRequest("POST", "/api/rooms", {
        building: "Gedung C",
        floor: "Lantai 1",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(422);
    });

    it("AC-28.7: Duplikasi ruangan ditolak", async () => {
      mockDb.first.mockResolvedValueOnce({ id: "rm-existing" });

      const request = createRequest("POST", "/api/rooms", {
        building: "Gedung A",
        floor: "Lantai 1",
        room_name: "Ruang 101",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(422);
      const body = await response.json();
      expect(body.error).toContain("sudah ada");
    });

    it("AC-28.8: Hanya Facility Manager yang dapat menambahkan ruangan", async () => {
      const request = createRequest("POST", "/api/rooms", {
        building: "Gedung C",
        floor: "Lantai 1",
        room_name: "Ruang 101",
      }, {
        "X-User-Role": "ADMIN",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(403);
    });
  });

  // ========== PATCH /api/rooms/:id ==========
  describe("PATCH /api/rooms/:id", () => {
    it("AC-28.9: Facility Manager dapat mengupdate ruangan", async () => {
      mockDb.first
        .mockResolvedValueOnce({ id: "rm-001", building: "Gedung A", floor: "Lantai 1", room_name: "Ruang 101", is_active: 1 })
        .mockResolvedValueOnce(null);
      mockDb.run.mockResolvedValue({});

      const request = createRequest("PATCH", "/api/rooms/rm-001", {
        room_name: "Ruang 101 Updated",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });

    it("AC-28.10: Update ruangan tidak ditemukan", async () => {
      mockDb.first.mockResolvedValueOnce(null);

      const request = createRequest("PATCH", "/api/rooms/rm-999", {
        room_name: "Ruang Updated",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(404);
    });

    it("AC-28.11: Update ruangan dengan duplikasi ditolak", async () => {
      mockDb.first
        .mockResolvedValueOnce({ id: "rm-001", building: "Gedung A", floor: "Lantai 1", room_name: "Ruang 101", is_active: 1 })
        .mockResolvedValueOnce({ id: "rm-other" });

      const request = createRequest("PATCH", "/api/rooms/rm-001", {
        building: "Gedung A",
        floor: "Lantai 1",
        room_name: "Ruang 102",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(422);
    });

    it("AC-28.12: Hanya Facility Manager yang dapat update", async () => {
      const request = createRequest("PATCH", "/api/rooms/rm-001", {
        room_name: "Ruang Updated",
      }, {
        "X-User-Role": "REPORTER",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(403);
    });
  });

  // ========== DELETE /api/rooms/:id ==========
  describe("DELETE /api/rooms/:id", () => {
    it("AC-28.13: Facility Manager dapat menonaktifkan ruangan", async () => {
      mockDb.first.mockResolvedValueOnce(null);
      mockDb.first.mockResolvedValueOnce({ building: "Gedung A", floor: "Lantai 1", room_name: "Ruang 101" });
      mockDb.run.mockResolvedValue({});

      const request = createRequest("DELETE", "/api/rooms/rm-001");
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });

    it("AC-28.14: Tidak dapat menonaktifkan ruangan dengan laporan aktif", async () => {
      mockDb.first.mockResolvedValueOnce({ id: "req-001" });

      const request = createRequest("DELETE", "/api/rooms/rm-001");
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(422);
      const body = await response.json();
      expect(body.error).toContain("digunakan di laporan aktif");
    });

    it("AC-28.15: Hanya Facility Manager yang dapat menghapus", async () => {
      const request = createRequest("DELETE", "/api/rooms/rm-001", undefined, {
        "X-User-Role": "TECHNICIAN",
      });
      const response = await worker.fetch(request, env);
      expect(response.status).toBe(403);
    });
  });
});
