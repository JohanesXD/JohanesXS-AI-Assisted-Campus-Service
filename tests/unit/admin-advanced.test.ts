import { describe, it, expect, beforeEach, vi } from "vitest";
import worker from "../../worker/index";

const mockDb = {
  prepare: vi.fn().mockImplementation((sql: string) => {
    const normalizedSql = sql.replace(/\s+/g, " ").trim();
    
    if (normalizedSql.includes("FROM users")) {
      return {
        bind: vi.fn().mockImplementation((emailOrId: string) => {
          let role = "ADMIN";
          if (emailOrId.includes("reporter")) role = "REPORTER";
          if (emailOrId.includes("tech")) role = "TECHNICIAN";
          if (emailOrId.includes("manager")) role = "FACILITY_MANAGER";
          return {
            first: vi.fn().mockResolvedValue({
              id: emailOrId.includes("tech") ? emailOrId : "usr-admin",
              campus_email: emailOrId.includes("@") ? emailOrId : `${emailOrId}@campus.ac.id`,
              name: "Test User",
              role: role,
              is_active: 1
            })
          };
        })
      };
    }
    
    if (normalizedSql.includes("RESOLVED") || normalizedSql.includes("WAITING_REPORTER_CONFIRMATION")) {
      return {
        bind: vi.fn().mockReturnThis(),
        all: vi.fn().mockResolvedValue({ results: [] }),
        run: vi.fn().mockResolvedValue({}),
        first: vi.fn().mockResolvedValue(null)
      };
    }

    let lastBoundId = "";
    return {
      bind: vi.fn().mockImplementation((...args: any[]) => {
        if (args.length > 0) lastBoundId = String(args[0]);
        return {
          first: vi.fn().mockImplementation(async () => {
            if (normalizedSql.includes("service_requests WHERE id = ?") || normalizedSql.includes("service_requests sr")) {
              if (lastBoundId === "req-dup") {
                return { id: "req-dup", request_number: "CSR-DUP", status: "SUBMITTED" };
              }
              if (lastBoundId === "req-main") {
                return { id: "req-main", request_number: "CSR-MAIN", status: "IN_PROGRESS" };
              }
              if (lastBoundId === "req-123") {
                return {
                  id: "req-123",
                  title: "Kran bocor",
                  description: "Kran air di toilet lantai 1 Gedung A bocor parah.",
                  category_id: "cat-1",
                  room_id: "rm-1",
                  urgency: "MEDIUM",
                  status: "SUBMITTED"
                };
              }
              return { id: lastBoundId, status: "IN_PROGRESS" };
            }
            if (normalizedSql.includes("FROM categories")) {
              return { id: "cat-2" };
            }
            if (normalizedSql.includes("FROM rooms")) {
              return { id: "rm-2" };
            }
            if (normalizedSql.includes("status = 'ACTIVE' AND assignment_type = 'PRIMARY'")) {
              return { id: "asgn-old", technician_id: "tech-old" };
            }
            if (normalizedSql.includes("status = 'REPLACEMENT_PENDING'")) {
              if (normalizedSql.includes("SELECT id, technician_id, reason")) {
                return {
                  id: "asgn-pending",
                  technician_id: "tech-new",
                  reason: "Reassign",
                  assigned_by_user_id: "usr-admin",
                  old_technician_approved_at: null,
                  new_technician_approved_at: "2026-07-04T12:00:00Z"
                };
              }
              return null; // For creation check: no pending reassignment
            }
            return null;
          }),
          all: vi.fn().mockResolvedValue({ results: [] }),
          run: vi.fn().mockResolvedValue({ success: true })
        };
      }),
      first: vi.fn().mockResolvedValue(null),
      all: vi.fn().mockResolvedValue({ results: [] }),
      run: vi.fn().mockResolvedValue({ success: true })
    };
  }),
  bind: vi.fn().mockReturnThis(),
  first: vi.fn(),
  all: vi.fn().mockReturnValue({ results: [] }),
  run: vi.fn().mockReturnValue({}),
};

const env = { DB: mockDb as any };

function createRequest(method: string, pathname: string, body?: object, headers?: Record<string, string>) {
  const role = headers?.["X-User-Role"] || "ADMIN";
  const defaultEmail = role === "ADMIN" ? "admin@campus.ac.id" : `${role.toLowerCase()}@campus.ac.id`;
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

describe("FR-12: Advanced Admin Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PATCH /api/admin/requests/:id/edit - Admin Edit Laporan", () => {
    it("harus sukses mengedit kategori, ruangan, deskripsi dengan alasan yang valid", async () => {
      // Mock existing request (submitted)
      mockDb.first.mockResolvedValueOnce({
        id: "req-123",
        title: "Kran bocor",
        description: "Kran air di toilet lantai 1 Gedung A bocor parah.",
        category_id: "cat-1",
        room_id: "rm-1",
        urgency: "MEDIUM",
        status: "SUBMITTED"
      });

      // Mock category exists
      mockDb.first.mockResolvedValueOnce({ id: "cat-2" });
      // Mock room exists
      mockDb.first.mockResolvedValueOnce({ id: "rm-2" });

      mockDb.run.mockResolvedValue({ success: true });

      const req = createRequest("PATCH", "/api/admin/requests/req-123/edit", {
        category_id: "cat-2",
        room_id: "rm-2",
        description: "Deskripsi baru yang diubah oleh administrator kampus.",
        reason: "Koreksi data dari admin"
      }, { "X-User-Role": "ADMIN" });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      const data = await res.json() as any;
      expect(data.success).toBe(true);
    });

    it("harus menolak jika alasan perubahan kurang dari 5 karakter", async () => {
      const req = createRequest("PATCH", "/api/admin/requests/req-123/edit", {
        reason: "No"
      }, { "X-User-Role": "ADMIN" });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(422);
      const data = await res.json() as any;
      expect(data.error).toContain("Alasan perubahan wajib diisi");
    });
  });

  describe("POST /api/admin/requests/:id/merge - Admin Merge Laporan Duplikat", () => {
    it("harus sukses menggabungkan laporan duplikat ke laporan utama", async () => {
      // Mock duplicate request
      mockDb.first.mockResolvedValueOnce({
        id: "req-dup",
        request_number: "CSR-DUP",
        status: "SUBMITTED"
      });
      // Mock main request
      mockDb.first.mockResolvedValueOnce({
        id: "req-main",
        request_number: "CSR-MAIN",
        status: "IN_PROGRESS"
      });

      mockDb.run.mockResolvedValue({ success: true });

      const req = createRequest("POST", "/api/admin/requests/req-dup/merge", {
        main_request_id: "req-main"
      }, { "X-User-Role": "ADMIN" });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      const data = await res.json() as any;
      expect(data.success).toBe(true);
    });
  });

  describe("POST /api/admin/requests/:id/reassign - Admin Reassign Teknisi", () => {
    it("harus sukses membuat pengajuan reassignment (REPLACEMENT_PENDING)", async () => {
      // Mock request
      mockDb.first.mockResolvedValueOnce({
        id: "req-1",
        status: "IN_PROGRESS"
      });
      // Mock active assignment (old technician)
      mockDb.first.mockResolvedValueOnce({
        id: "asgn-old",
        technician_id: "tech-old@campus.ac.id"
      });
      // Mock new technician exists
      mockDb.first.mockResolvedValueOnce({
        id: "tech-new",
        role: "TECHNICIAN"
      });
      // Mock pending assignment check (none)
      mockDb.first.mockResolvedValueOnce(null);

      mockDb.run.mockResolvedValue({ success: true });

      const req = createRequest("POST", "/api/admin/requests/req-1/reassign", {
        new_technician_id: "tech-new",
        reason: "Teknisi lama sakit"
      }, { "X-User-Role": "ADMIN" });

      const res = await worker.fetch(req, env);
      if (res.status !== 200) {
        console.log("REASSIGN ERROR RESPONSE:", await res.text());
      }
      expect(res.status).toBe(200);
      const data = await res.json() as any;
      expect(data.success).toBe(true);
    });
  });

  describe("POST /api/requests/:id/reassign/approve - Teknisi Approve Reassignment", () => {
    it("harus mencatat persetujuan teknisi lama dan memperbarui status jika disetujui keduanya", async () => {
      // Mock pending assignment
      mockDb.first.mockResolvedValueOnce({
        id: "asgn-pending",
        technician_id: "tech-new",
        reason: "Reassign",
        assigned_by_user_id: "usr-admin",
        old_technician_approved_at: null,
        new_technician_approved_at: "2026-07-04T12:00:00Z"
      });
      // Mock active assignment (old technician)
      mockDb.first.mockResolvedValueOnce({
        id: "asgn-old",
        technician_id: "tech-old"
      });

      mockDb.run.mockResolvedValue({ success: true });

      const req = createRequest("POST", "/api/requests/req-1/reassign/approve", {
        approve: true
      }, {
        "X-User-Role": "TECHNICIAN",
        "X-User-Email": "tech-old" // Old technician approving
      });

      const res = await worker.fetch(req, env);
      if (res.status !== 200) {
        console.log("APPROVE ERROR RESPONSE:", await res.text());
      }
      expect(res.status).toBe(200);
      const data = await res.json() as any;
      expect(data.success).toBe(true);
      expect(data.status).toBe("ACTIVE");
    });
  });
});
