import { describe, it, expect, beforeEach, vi } from "vitest";
import worker from "../../worker/index";

const mockDb = {
  prepare: vi.fn().mockImplementation((sql: string) => {
    if (sql.includes("FROM users")) {
      return {
        bind: vi.fn().mockImplementation((email: string) => {
          return {
            first: vi.fn().mockResolvedValue({
              id: "usr-manager",
              campus_email: email,
              name: "Manager Sari",
              role: "FACILITY_MANAGER",
              is_active: 1
            })
          };
        })
      };
    }
    if (sql.includes("RESOLVED") || sql.includes("WAITING_REPORTER_CONFIRMATION")) {
      return {
        bind: vi.fn().mockReturnThis(),
        all: vi.fn().mockResolvedValue({ results: [] }),
        run: vi.fn().mockResolvedValue({}),
        first: vi.fn().mockResolvedValue(null)
      };
    }
    return mockDb;
  }),
  bind: vi.fn().mockReturnThis(),
  first: vi.fn(),
  all: vi.fn().mockReturnValue({ results: [] }),
  run: vi.fn().mockReturnValue({}),
};

const env = { DB: mockDb as any };

function createRequest(method: string, pathname: string, body?: object, headers?: Record<string, string>) {
  const role = headers?.["X-User-Role"] || "FACILITY_MANAGER";
  const defaultEmail = "manager@campus.ac.id";
  const url = new URL(`http://localhost${pathname}`);
  return new Request(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-User-Email": headers?.["X-User-Email"] || defaultEmail,
      "X-User-Role": role,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("FR-13: Facility Manager Dashboard & CSV Reporting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/reports/stats - Dashboard Stats", () => {
    it("harus sukses mengembalikan total laporan selesai dan chart kategori", async () => {
      // Mock total solved count query
      mockDb.first.mockResolvedValueOnce({ count: 15 });

      // Mock category chart results
      mockDb.all.mockResolvedValueOnce({
        results: [
          { category_name: "Internet", count: 8 },
          { category_name: "AC", count: 7 }
        ]
      });

      const req = createRequest("GET", "/api/reports/stats", undefined, { "X-User-Role": "FACILITY_MANAGER" });
      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      const data = await res.json() as any;
      expect(data.success).toBe(true);
      expect(data.total_solved).toBe(15);
      expect(data.category_chart).toHaveLength(2);
      expect(data.category_chart[0].category_name).toBe("Internet");
    });
  });

  describe("GET /api/reports/summary - Laporan Ringkas", () => {
    it("harus sukses mengambil ringkasan laporan dengan filter", async () => {
      mockDb.all.mockResolvedValueOnce({
        results: [
          {
            id: "req-1",
            request_number: "CSR-001",
            title: "AC Mati",
            status: "CLOSED_ADMIN",
            category: "AC",
            location: "Gedung A - Lantai 2 - Ruang 201",
            created_at: "2026-07-04T10:00:00Z",
            closed_at: "2026-07-04T11:00:00Z",
            follow_up_note: "Suku cadang kompresor diganti"
          }
        ]
      });

      const req = createRequest("GET", "/api/reports/summary?category_id=cat-ac&room_id=rm-201&start_date=2026-07-01", undefined, { "X-User-Role": "FACILITY_MANAGER" });
      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      const data = await res.json() as any;
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].category).toBe("AC");
    });
  });

  describe("GET /api/reports/summary.csv - Laporan CSV", () => {
    it("harus sukses mengembalikan format CSV dengan header yang tepat", async () => {
      mockDb.all.mockResolvedValueOnce({
        results: [
          {
            id: "req-1",
            request_number: "CSR-001",
            title: "AC Mati",
            status: "CLOSED_ADMIN",
            category: "AC",
            location: "Gedung A - Lantai 2 - Ruang 201",
            created_at: "2026-07-04T10:00:00Z",
            closed_at: "2026-07-04T11:00:00Z",
            follow_up_note: "Selesai"
          }
        ]
      });

      const req = createRequest("GET", "/api/reports/summary.csv", undefined, { "X-User-Role": "FACILITY_MANAGER" });
      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/csv");
      const text = await res.text();
      expect(text).toContain("No Laporan,Judul,Kategori,Lokasi,Status");
      expect(text).toContain("CSR-001");
    });
  });

  describe("POST /api/reports/:id/follow-up - Catatan Tindak Lanjut", () => {
    it("harus sukses menambahkan catatan tindak lanjut dengan alasan evaluasi yang valid", async () => {
      // Mock request exists
      mockDb.first.mockResolvedValueOnce({ id: "req-1" });
      mockDb.run.mockResolvedValue({ success: true });

      const req = createRequest("POST", "/api/reports/req-1/follow-up", {
        note: "AC bekerja optimal setelah perbaikan menyeluruh.",
        reason: "Evaluasi mingguan fasilitas gedung"
      }, { "X-User-Role": "FACILITY_MANAGER" });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(201);
      const data = await res.json() as any;
      expect(data.success).toBe(true);
    });

    it("harus gagal jika alasan evaluasi kurang dari 5 karakter", async () => {
      const req = createRequest("POST", "/api/reports/req-1/follow-up", {
        note: "AC OK",
        reason: "OK"
      }, { "X-User-Role": "FACILITY_MANAGER" });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(422);
      const data = await res.json() as any;
      expect(data.error).toContain("Alasan wajib diisi");
    });
  });
});
