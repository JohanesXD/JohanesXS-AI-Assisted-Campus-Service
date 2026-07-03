interface Env {
  DB: D1Database;
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

// Helper to validate campus email format
function isValidCampusEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return email.endsWith(".ac.id") || email.endsWith("campus.ac.id");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Endpoint Health Check (tidak memerlukan auth)
    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ status: "ok" });
    }

    // Endpoint Login (tidak memerlukan auth)
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      const input = await request.json() as {
        email?: string;
        role?: string;
      };

      if (!input.email || !input.role) {
        return json({ error: "Email kampus dan role wajib diisi." }, 422);
      }

      const email = input.email.trim();
      const role = input.role.trim();

      if (!isValidCampusEmail(email)) {
        return json({ error: "Format email kampus tidak valid (harus *.ac.id)." }, 422);
      }

      if (!["REPORTER", "ADMIN", "TECHNICIAN", "FACILITY_MANAGER"].includes(role)) {
        return json({ error: "Role tidak valid." }, 422);
      }

      // Cari user di database D1
      const existingUser = await env.DB.prepare(`
        SELECT id, campus_email, name, role FROM users WHERE campus_email = ?
      `).bind(email).first<{ id: string; campus_email: string; name: string; role: string }>();

      if (existingUser) {
        return json({ user: existingUser }, 200);
      }

      // Jika user tidak ditemukan, daftarkan otomatis
      const id = `usr-${crypto.randomUUID()}`;
      const prefix = email.split("@")[0];
      const name = prefix
        .replace(/[._-]/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      await env.DB.prepare(`
        INSERT INTO users (id, campus_email, name, role)
        VALUES (?, ?, ?, ?)
      `).bind(id, email, name, role).run();

      return json({
        user: { id, campus_email: email, name, role }
      }, 201);
    }

    // Otorisasi Global untuk Endpoint yang Membutuhkan Login
    const userEmail = request.headers.get("X-User-Email");
    const userRole = request.headers.get("X-User-Role");

    if (!userEmail || !userRole) {
      return json({ error: "Unauthorized. Silakan login terlebih dahulu." }, 401);
    }

    // Ambil data User dari DB berdasarkan email
    const currentUser = await env.DB.prepare(`
      SELECT id, campus_email, name, role FROM users WHERE campus_email = ?
    `).bind(userEmail).first<{ id: string; campus_email: string; name: string; role: string }>();

    if (!currentUser) {
      return json({ error: "Sesi pengguna tidak valid. Silakan login kembali." }, 401);
    }

    // Endpoint GET /api/categories
    if (url.pathname === "/api/categories" && request.method === "GET") {
      const result = await env.DB.prepare(`
        SELECT id, name FROM categories WHERE is_active = 1 ORDER BY name ASC
      `).all();
      return json({ data: result.results });
    }

    // Endpoint GET /api/rooms
    if (url.pathname === "/api/rooms" && request.method === "GET") {
      const result = await env.DB.prepare(`
        SELECT id, building, floor, room_name FROM rooms WHERE is_active = 1 ORDER BY building ASC, floor ASC, room_name ASC
      `).all();
      return json({ data: result.results });
    }

    // Endpoint GET /api/users/technicians
    if (url.pathname === "/api/users/technicians" && request.method === "GET") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator (ADMIN) yang dapat melihat daftar teknisi." }, 403);
      }

      const result = await env.DB.prepare(`
        SELECT id, campus_email, name FROM users WHERE role = 'TECHNICIAN' AND is_active = 1 ORDER BY name ASC
      `).all();
      return json({ data: result.results });
    }

    // Endpoint POST /api/requests/:id/reject
    const rejectMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/reject$/);
    if (rejectMatch && request.method === "POST") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator (ADMIN) yang dapat menolak laporan." }, 403);
      }

      const requestId = rejectMatch[1];
      const input = await request.json() as { reason?: string };

      if (!input.reason || input.reason.trim().length < 5) {
        return json({ error: "Alasan penolakan wajib diisi (minimal 5 karakter)." }, 422);
      }

      // Pastikan laporan ada
      const checkRequest = await env.DB.prepare(`
        SELECT id, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; status: string }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'REJECTED', rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(input.reason.trim(), requestId).run();

      return json({ success: true, status: "REJECTED" }, 200);
    }

    // Endpoint POST /api/requests/:id/assign-additional
    const assignAdditionalMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/assign-additional$/);
    if (assignAdditionalMatch && request.method === "POST") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator (ADMIN) yang dapat menambahkan teknisi tambahan." }, 403);
      }

      const requestId = assignAdditionalMatch[1];
      const input = await request.json() as {
        technician_id?: string;
        reason?: string;
      };

      if (!input.technician_id) {
        return json({ error: "Teknisi wajib dipilih." }, 422);
      }

      // Pastikan laporan ada
      const checkRequest = await env.DB.prepare(`
        SELECT id, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; status: string }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      // Validasi: hanya boleh tambah teknisi jika status NEED_HELP
      if (checkRequest.status !== "NEED_HELP") {
        return json({ error: "Hanya laporan berstatus NEED_HELP yang dapat ditambahkan teknisi tambahan." }, 422);
      }

      // Pastikan teknisi ada dan role TECHNICIAN
      const checkTechnician = await env.DB.prepare(`
        SELECT id, role FROM users WHERE id = ? AND role = 'TECHNICIAN' AND is_active = 1
      `).bind(input.technician_id).first<{ id: string; role: string }>();

      if (!checkTechnician) {
        return json({ error: "Teknisi tidak valid atau tidak aktif." }, 422);
      }

      // Cek apakah teknisi sudah ditugaskan ke laporan ini
      const existingAssignment = await env.DB.prepare(`
        SELECT id FROM request_assignments WHERE request_id = ? AND technician_id = ? AND status = 'ACTIVE'
      `).bind(requestId, input.technician_id).first<{ id: string }>();

      if (existingAssignment) {
        return json({ error: "Teknisi ini sudah ditugaskan ke laporan." }, 422);
      }

      // Buat assignment tambahan
      const assignmentId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO request_assignments
        (id, request_id, technician_id, assignment_type, status, assigned_by_user_id, reason, created_at, updated_at)
        VALUES (?, ?, ?, 'ADDITIONAL', 'ACTIVE', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        assignmentId,
        requestId,
        input.technician_id,
        currentUser.id,
        input.reason?.trim() || null
      ).run();

      return json({
        success: true,
        assignmentId,
        requestId,
        technicianId: input.technician_id,
        assignmentType: "ADDITIONAL"
      }, 201);
    }

    // Endpoint /api/requests
    if (url.pathname.startsWith("/api/requests")) {
      
      // GET /api/requests
      if (request.method === "GET") {
        let query = `
          SELECT sr.id, sr.request_number, sr.title, sr.description, sr.status, sr.urgency, sr.rejection_reason, sr.created_at,
                 c.name AS category,
                 r.building || ' - ' || r.floor || ' - ' || r.room_name AS location
          FROM service_requests sr
          JOIN categories c ON sr.category_id = c.id
          JOIN rooms r ON sr.room_id = r.id
        `;
        let params: string[] = [];

        // Jika Reporter, filter hanya laporan miliknya sendiri
        if (currentUser.role === "REPORTER") {
          query += " WHERE sr.reporter_id = ?";
          params.push(currentUser.id);
        }

        query += " ORDER BY sr.created_at DESC";

        const result = await env.DB.prepare(query).bind(...params).all();
        return json({ data: result.results });
      }

      // POST /api/requests
      if (request.method === "POST") {
        if (currentUser.role !== "REPORTER") {
          return json({ error: "Hanya pelapor (REPORTER) yang dapat membuat laporan baru." }, 403);
        }

        const input = await request.json() as {
          title?: string;
          description?: string;
          category_id?: string;
          room_id?: string;
          urgency?: string;
        };

        if (
          !input.title ||
          !input.description ||
          !input.category_id ||
          !input.room_id ||
          !input.urgency
        ) {
          return json({ error: "Semua field wajib diisi." }, 422);
        }

        if (input.description.trim().length < 20) {
          return json({ error: "Deskripsi minimal 20 karakter." }, 422);
        }

        if (!["LOW", "MEDIUM", "HIGH", "URGENT"].includes(input.urgency)) {
          return json({ error: "Tingkat urgensi tidak valid." }, 422);
        }

        // Verifikasi keberadaan Kategori
        const categoryExists = await env.DB.prepare(`
          SELECT id FROM categories WHERE id = ? AND is_active = 1
        `).bind(input.category_id).first();

        if (!categoryExists) {
          return json({ error: "Kategori tidak valid." }, 422);
        }

        // Verifikasi keberadaan Ruangan
        const roomExists = await env.DB.prepare(`
          SELECT id FROM rooms WHERE id = ? AND is_active = 1
        `).bind(input.room_id).first();

        if (!roomExists) {
          return json({ error: "Ruangan tidak valid." }, 422);
        }

        const id = crypto.randomUUID();
        const requestNumber = `CSR-${Date.now()}`;

        await env.DB.prepare(`
          INSERT INTO service_requests
          (id, request_number, reporter_id, title, description, category_id, room_id, urgency, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
        `).bind(
          id,
          requestNumber,
          currentUser.id,
          input.title.trim(),
          input.description.trim(),
          input.category_id,
          input.room_id,
          input.urgency
        ).run();

        return json({
          id,
          requestNumber,
          status: "SUBMITTED"
        }, 201);
      }
    }

    return json({ error: "Alamat API tidak ditemukan." }, 404);
  }
} satisfies ExportedHandler<Env>;