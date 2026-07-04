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

async function recordStatusHistory(
  env: Env,
  requestId: string,
  fromStatus: string | null,
  toStatus: string,
  changedByUserId: string | null,
  reason: string | null
): Promise<void> {
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, reason)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, requestId, fromStatus, toStatus, changedByUserId, reason).run();
}

async function createNotification(
  env: Env,
  userId: string,
  type: string,
  title: string,
  message: string,
  requestId: string | null
): Promise<void> {
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO notifications (id, user_id, type, title, message, request_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, userId, type, title, message, requestId).run();
}

// Determine who should be notified for a given status change
async function notifyStatusChange(
  env: Env,
  requestId: string,
  newStatus: string,
  changedByUserId: string | null
): Promise<void> {
  // Get request info (reporter_id, assigned technicians)
  const requestInfo = await env.DB.prepare(`
    SELECT sr.reporter_id, sr.title,
           u.campus_email AS reporter_email
    FROM service_requests sr
    JOIN users u ON sr.reporter_id = u.id
    WHERE sr.id = ?
  `).bind(requestId).first<{ reporter_id: string; title: string; reporter_email: string }>();

  if (!requestInfo) return;

  const requestTitle = requestInfo.title.length > 80
    ? requestInfo.title.substring(0, 77) + "..."
    : requestInfo.title;

  // Get assigned admin users
  const admins = await env.DB.prepare(`
    SELECT id FROM users WHERE role = 'ADMIN' AND is_active = 1
  `).all<{ id: string }>();

  // Get assigned technicians
  const technicians = await env.DB.prepare(`
    SELECT technician_id FROM request_assignments
    WHERE request_id = ? AND status = 'ACTIVE'
  `).bind(requestId).all<{ technician_id: string }>();

  const reporterId = requestInfo.reporter_id;

  switch (newStatus) {
    case "SUBMITTED":
      for (const a of admins.results) {
        await createNotification(env, a.id, "STATUS_CHANGE",
          "Laporan Baru Masuk",
          `Laporan baru "${requestTitle}" menunggu pemeriksaan.`,
          requestId);
      }
      break;

    case "REJECTED":
      await createNotification(env, reporterId, "STATUS_CHANGE",
        "Laporan Ditolak",
        `Laporan "${requestTitle}" telah ditolak oleh administrator.`,
        requestId);
      break;

    case "ASSIGNED":
      for (const t of technicians.results) {
        if (t.technician_id !== changedByUserId) {
          await createNotification(env, t.technician_id, "STATUS_CHANGE",
            "Tugas Baru",
            `Anda ditugaskan untuk menangani laporan "${requestTitle}".`,
            requestId);
        }
      }
      break;

    case "IN_PROGRESS":
      await createNotification(env, reporterId, "STATUS_CHANGE",
        "Pekerjaan Dimulai",
        `Laporan "${requestTitle}" sedang dikerjakan oleh teknisi.`,
        requestId);
      break;

    case "NEED_HELP":
      for (const a of admins.results) {
        await createNotification(env, a.id, "NEED_HELP",
          "Teknisi Butuh Bantuan",
          `Teknisi membutuhkan bantuan untuk laporan "${requestTitle}".`,
          requestId);
      }
      break;

    case "WAITING_PARTS":
      await createNotification(env, reporterId, "WAITING_PARTS",
        "Menunggu Suku Cadang",
        `Laporan "${requestTitle}" menunggu suku cadang baru.`,
        requestId);
      break;

    case "PAUSED":
      await createNotification(env, reporterId, "PAUSED",
        "Pekerjaan Tertunda",
        `Pekerjaan pada laporan "${requestTitle}" untuk sementara tertunda.`,
        requestId);
      break;

    case "WAITING_REPORTER_CONFIRMATION":
      await createNotification(env, reporterId, "RESOLVED",
        "Pekerjaan Selesai - Konfirmasi Diperlukan",
        `Laporan "${requestTitle}" telah selesai dikerjakan. Silakan konfirmasi dalam 45 menit.`,
        requestId);
      break;

    case "CLOSED_REPORTER_CONFIRMED":
      for (const a of admins.results) {
        await createNotification(env, a.id, "STATUS_CHANGE",
          "Laporan Ditutup (Konfirmasi Pelapor)",
          `Laporan "${requestTitle}" telah dikonfirmasi selesai oleh pelapor.`,
          requestId);
      }
      break;

    case "CLOSED_AUTO":
      await createNotification(env, reporterId, "STATUS_CHANGE",
        "Laporan Ditutup Otomatis",
        `Laporan "${requestTitle}" ditutup otomatis karena batas waktu konfirmasi telah habis.`,
        requestId);
      break;

    case "CLOSED_ADMIN":
      await createNotification(env, reporterId, "STATUS_CHANGE",
        "Laporan Ditutup oleh Admin",
        `Laporan "${requestTitle}" telah ditutup oleh administrator.`,
        requestId);
      break;

    case "REOPEN_REQUESTED":
      for (const a of admins.results) {
        await createNotification(env, a.id, "STATUS_CHANGE",
          "Pelapor Menolak Hasil",
          `Pelapor menolak hasil pekerjaan untuk laporan "${requestTitle}". Menunggu tindakan admin.`,
          requestId);
      }
      break;

    case "REOPENED":
      await createNotification(env, reporterId, "REOPENED",
        "Laporan Dibuka Ulang",
        `Laporan "${requestTitle}" telah dibuka ulang oleh administrator.`,
        requestId);
      for (const t of technicians.results) {
        await createNotification(env, t.technician_id, "STATUS_CHANGE",
          "Laporan Dibuka Ulang",
          `Laporan "${requestTitle}" telah dibuka ulang dan perlu ditindaklanjuti.`,
          requestId);
      }
      break;

    case "EDITED":
      // FR-032: Notify admins when reporter edits a request
      for (const a of admins.results) {
        await createNotification(env, a.id, "STATUS_CHANGE",
          "Laporan Diubah Pelapor",
          `Laporan "${requestTitle}" telah diubah oleh pelapor dan perlu ditinjau ulang.`,
          requestId);
      }
      break;

    case "CANCELLED":
      // FR-034: Pelapor membatalkan laporan → notifikasi admin
      for (const a of admins.results) {
        await createNotification(env, a.id, "STATUS_CHANGE",
          "Laporan Dibatalkan Pelapor",
          `Laporan "${requestTitle}" telah dibatalkan oleh pelapor.`,
          requestId);
      }
      break;
  }
}

async function runAutoClose(env: Env): Promise<void> {
  const expired = await env.DB.prepare(`
    SELECT id FROM service_requests
    WHERE status = 'WAITING_REPORTER_CONFIRMATION'
    AND confirmation_due_at IS NOT NULL
    AND datetime(confirmation_due_at) <= datetime('now')
  `).all<{ id: string }>();

  for (const req of expired.results) {
    await env.DB.prepare(`
      UPDATE service_requests
      SET status = 'CLOSED_AUTO', closed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(req.id).run();
    await recordStatusHistory(env, req.id, "WAITING_REPORTER_CONFIRMATION", "CLOSED_AUTO", null, "Batas waktu 45 menit konfirmasi telah habis");
    await notifyStatusChange(env, req.id, "CLOSED_AUTO", null);
  }
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

    await runAutoClose(env);

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

      await recordStatusHistory(env, requestId, checkRequest.status, "REJECTED", currentUser.id, input.reason.trim());
      await notifyStatusChange(env, requestId, "REJECTED", currentUser.id);

      return json({ success: true, status: "REJECTED" }, 200);
    }

    // GET /api/requests/:id - detail laporan
    const requestDetailMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)$/);
    if (requestDetailMatch && request.method === "GET") {
      const requestId = requestDetailMatch[1];

      const requestData = await env.DB.prepare(`
        SELECT sr.id, sr.request_number, sr.title, sr.description, sr.status, sr.urgency,
               sr.rejection_reason, sr.resolution_rejected_reason,
               sr.resolved_at, sr.confirmation_due_at, sr.closed_at,
               sr.created_at, sr.updated_at,
               c.name AS category, sr.category_id,
               u.name AS reporter_name, u.campus_email AS reporter_email,
               r.building || ' - ' || r.floor || ' - ' || r.room_name AS location, sr.room_id,
               u_tech.id AS technician_id, u_tech.name AS technician_name,
               (SELECT ra2.id || ':' || ra2.technician_id || ':' || u_new.name || ':' || ra2.reason || ':' || COALESCE(ra2.old_technician_approved_at, '') || ':' || COALESCE(ra2.new_technician_approved_at, '')
                FROM request_assignments ra2
                JOIN users u_new ON ra2.technician_id = u_new.id
                WHERE ra2.request_id = sr.id AND ra2.status = 'REPLACEMENT_PENDING' LIMIT 1) AS pending_reassignment
        FROM service_requests sr
        JOIN categories c ON sr.category_id = c.id
        JOIN rooms r ON sr.room_id = r.id
        JOIN users u ON sr.reporter_id = u.id
        LEFT JOIN request_assignments ra ON sr.id = ra.request_id AND ra.status = 'ACTIVE' AND ra.assignment_type = 'PRIMARY'
        LEFT JOIN users u_tech ON ra.technician_id = u_tech.id
        WHERE sr.id = ?
      `).bind(requestId).first();

      if (!requestData) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      if (currentUser.role === "REPORTER") {
        const ownerEmail = await env.DB.prepare(`
          SELECT campus_email FROM users WHERE id = (SELECT reporter_id FROM service_requests WHERE id = ?)
        `).bind(requestId).first<string>("campus_email");

        if (ownerEmail && ownerEmail !== currentUser.campus_email) {
          return json({ error: "Anda hanya dapat melihat laporan milik sendiri." }, 403);
        }
      }

      return json({ data: requestData }, 200);
    }

    // GET /api/requests/:id/status-history
    const statusHistoryMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/status-history$/);
    if (statusHistoryMatch && request.method === "GET") {
      const requestId = statusHistoryMatch[1];

      const result = await env.DB.prepare(`
        SELECT rsh.id, rsh.from_status, rsh.to_status, rsh.reason, rsh.created_at,
               u.name AS changed_by_name, u.role AS changed_by_role
        FROM request_status_history rsh
        LEFT JOIN users u ON rsh.changed_by_user_id = u.id
        WHERE rsh.request_id = ?
        ORDER BY rsh.created_at ASC
      `).bind(requestId).all();

      return json({ data: result.results }, 200);
    }

    // Endpoint PATCH /api/requests/:id - Pelapor mengubah laporan (FR-031, FR-032, AC-023)
    const requestEditMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)$/);
    if (requestEditMatch && request.method === "PATCH") {
      if (currentUser.role !== "REPORTER") {
        return json({ error: "Hanya pelapor (REPORTER) yang dapat mengubah laporan." }, 403);
      }

      const requestId = requestEditMatch[1];
      const input = await request.json() as {
        title?: string;
        description?: string;
        category_id?: string;
        room_id?: string;
        urgency?: string;
        reason?: string;
      };

      // Validasi: alasan perubahan wajib diisi
      if (!input.reason || input.reason.trim().length < 5) {
        return json({ error: "Alasan perubahan wajib diisi (minimal 5 karakter)." }, 422);
      }

      // Ambil data laporan saat ini dan pastikan milik pelapor
      const existingRequest = await env.DB.prepare(`
        SELECT id, reporter_id, title, description, category_id, room_id, urgency, status, request_number
        FROM service_requests WHERE id = ?
      `).bind(requestId).first<{
        id: string; reporter_id: string; title: string; description: string;
        category_id: string; room_id: string; urgency: string; status: string; request_number: string;
      }>();

      if (!existingRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      if (existingRequest.reporter_id !== currentUser.id) {
        return json({ error: "Anda hanya dapat mengubah laporan milik sendiri." }, 403);
      }

      // Hanya boleh edit jika status masih awal
      const editableStatuses = ["SUBMITTED", "UNDER_REVIEW", "REJECTED"];
      if (!editableStatuses.includes(existingRequest.status)) {
        return json({ error: "Laporan tidak dapat diubah pada status saat ini." }, 422);
      }

      // Validasi field yang akan diubah
      const updates: Record<string, unknown> = {};
      const editRecord: Record<string, unknown> = {
        id: crypto.randomUUID(),
        request_id: requestId,
        edited_by_user_id: currentUser.id,
        old_title: existingRequest.title,
        new_title: existingRequest.title,
        old_description: existingRequest.description,
        new_description: existingRequest.description,
        old_category_id: existingRequest.category_id,
        new_category_id: existingRequest.category_id,
        old_room_id: existingRequest.room_id,
        new_room_id: existingRequest.room_id,
        old_urgency: existingRequest.urgency,
        new_urgency: existingRequest.urgency,
        reason: input.reason.trim(),
      };

      if (input.title !== undefined) {
        const trimmed = input.title.trim();
        if (!trimmed) {
          return json({ error: "Judul tidak boleh kosong." }, 422);
        }
        updates.title = trimmed;
        editRecord.new_title = trimmed;
      }

      if (input.description !== undefined) {
        const trimmed = input.description.trim();
        if (trimmed.length < 20) {
          return json({ error: "Deskripsi minimal 20 karakter." }, 422);
        }
        updates.description = trimmed;
        editRecord.new_description = trimmed;
      }

      if (input.category_id !== undefined) {
        const categoryExists = await env.DB.prepare(`
          SELECT id FROM categories WHERE id = ? AND is_active = 1
        `).bind(input.category_id).first();
        if (!categoryExists) {
          return json({ error: "Kategori tidak valid." }, 422);
        }
        updates.category_id = input.category_id;
        editRecord.new_category_id = input.category_id;
      }

      if (input.room_id !== undefined) {
        const roomExists = await env.DB.prepare(`
          SELECT id FROM rooms WHERE id = ? AND is_active = 1
        `).bind(input.room_id).first();
        if (!roomExists) {
          return json({ error: "Ruangan tidak valid." }, 422);
        }
        updates.room_id = input.room_id;
        editRecord.new_room_id = input.room_id;
      }

      if (input.urgency !== undefined) {
        if (!["LOW", "MEDIUM", "HIGH", "URGENT"].includes(input.urgency)) {
          return json({ error: "Tingkat urgensi tidak valid." }, 422);
        }
        updates.urgency = input.urgency;
        editRecord.new_urgency = input.urgency;
      }

      // Jika tidak ada field yang diubah
      if (Object.keys(updates).length === 0) {
        return json({ error: "Tidak ada field yang diubah." }, 422);
      }

      // Update laporan: kembalikan status ke UNDER_REVIEW dan hapus rejection_reason jika ada
      const newStatus = "UNDER_REVIEW";
      const oldStatus = existingRequest.status;

      await env.DB.prepare(`
        UPDATE service_requests
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            category_id = COALESCE(?, category_id),
            room_id = COALESCE(?, room_id),
            urgency = COALESCE(?, urgency),
            status = ?,
            rejection_reason = CASE WHEN ? = 'REJECTED' THEN NULL ELSE rejection_reason END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        updates.title ?? null,
        updates.description ?? null,
        updates.category_id ?? null,
        updates.room_id ?? null,
        updates.urgency ?? null,
        newStatus,
        oldStatus,
        requestId
      ).run();

      // Simpan riwayat perubahan ke request_edits
      await env.DB.prepare(`
        INSERT INTO request_edits
        (id, request_id, edited_by_user_id, old_title, new_title, old_description, new_description,
         old_category_id, new_category_id, old_room_id, new_room_id, old_urgency, new_urgency, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        editRecord.id,
        editRecord.request_id,
        editRecord.edited_by_user_id,
        editRecord.old_title,
        editRecord.new_title,
        editRecord.old_description,
        editRecord.new_description,
        editRecord.old_category_id,
        editRecord.new_category_id,
        editRecord.old_room_id,
        editRecord.new_room_id,
        editRecord.old_urgency,
        editRecord.new_urgency,
        editRecord.reason
      ).run();

      // Catat perubahan status di history
      await recordStatusHistory(env, requestId, oldStatus, newStatus, currentUser.id, `Diedit pelapor: ${input.reason.trim()}`);

      // Kirim notifikasi ke admin bahwa laporan diedit
      await notifyStatusChange(env, requestId, "EDITED", currentUser.id);

      return json({
        success: true,
        status: newStatus,
        message: "Laporan berhasil diubah dan dikembalikan ke pemeriksaan admin."
      }, 200);
    }

    // Endpoint POST /api/requests/:id/cancel - Pelapor membatalkan laporan (FR-034, AC-022)
    const requestCancelMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/cancel$/);
    if (requestCancelMatch && request.method === "POST") {
      if (currentUser.role !== "REPORTER") {
        return json({ error: "Hanya pelapor (REPORTER) yang dapat membatalkan laporan." }, 403);
      }

      const requestId = requestCancelMatch[1];
      const input = await request.json() as { reason?: string };

      // Validasi: alasan pembatalan wajib diisi
      if (!input.reason || input.reason.trim().length < 5) {
        return json({ error: "Alasan pembatalan wajib diisi (minimal 5 karakter)." }, 422);
      }

      // Ambil data laporan dan pastikan milik pelapor
      const existingRequest = await env.DB.prepare(`
        SELECT id, reporter_id, status, title FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; reporter_id: string; status: string; title: string }>();

      if (!existingRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      if (existingRequest.reporter_id !== currentUser.id) {
        return json({ error: "Anda hanya dapat membatalkan laporan milik sendiri." }, 403);
      }

      // Hanya boleh cancel jika status masih awal
      const cancellableStatuses = ["SUBMITTED", "UNDER_REVIEW", "REJECTED"];
      if (!cancellableStatuses.includes(existingRequest.status)) {
        return json({ error: "Laporan tidak dapat dibatalkan pada status saat ini." }, 422);
      }

      // Update status ke CANCELLED
      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(requestId).run();

      // Catat perubahan status
      await recordStatusHistory(env, requestId, existingRequest.status, "CANCELLED", currentUser.id, input.reason.trim());

      // Kirim notifikasi ke admin
      await notifyStatusChange(env, requestId, "CANCELLED", currentUser.id);

      return json({
        success: true,
        status: "CANCELLED",
        message: "Laporan berhasil dibatalkan."
      }, 200);
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

    // Endpoint POST /api/requests/:id/resolve - Teknisi menyelesaikan pekerjaan
    const resolveMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/resolve$/);
    if (resolveMatch && request.method === "POST") {
      if (currentUser.role !== "TECHNICIAN") {
        return json({ error: "Hanya teknisi (TECHNICIAN) yang dapat menyelesaikan pekerjaan." }, 403);
      }

      const requestId = resolveMatch[1];
      const checkRequest = await env.DB.prepare(`
        SELECT id, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; status: string }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      if (checkRequest.status !== "IN_PROGRESS") {
        return json({ error: "Hanya laporan berstatus IN_PROGRESS yang dapat diselesaikan." }, 422);
      }

      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'WAITING_REPORTER_CONFIRMATION',
            resolved_at = CURRENT_TIMESTAMP,
            confirmation_due_at = datetime('now', '+45 minutes'),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(requestId).run();

      await recordStatusHistory(env, requestId, "IN_PROGRESS", "RESOLVED", currentUser.id, null);
      await recordStatusHistory(env, requestId, "RESOLVED", "WAITING_REPORTER_CONFIRMATION", null, null);
      await notifyStatusChange(env, requestId, "WAITING_REPORTER_CONFIRMATION", currentUser.id);

      return json({ success: true, status: "WAITING_REPORTER_CONFIRMATION" }, 200);
    }

    // Endpoint POST /api/requests/:id/confirm-resolution - Pelapor konfirmasi selesai
    const confirmMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/confirm-resolution$/);
    if (confirmMatch && request.method === "POST") {
      if (currentUser.role !== "REPORTER") {
        return json({ error: "Hanya pelapor (REPORTER) yang dapat mengonfirmasi hasil pekerjaan." }, 403);
      }

      const requestId = confirmMatch[1];
      const checkRequest = await env.DB.prepare(`
        SELECT id, reporter_id, status, confirmation_due_at FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; reporter_id: string; status: string; confirmation_due_at: string | null }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      if (checkRequest.reporter_id !== currentUser.id) {
        return json({ error: "Anda hanya dapat mengonfirmasi laporan milik sendiri." }, 403);
      }

      if (checkRequest.status !== "WAITING_REPORTER_CONFIRMATION") {
        return json({ error: "Laporan tidak dalam status menunggu konfirmasi." }, 422);
      }

      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'CLOSED_REPORTER_CONFIRMED',
            closed_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(requestId).run();

      await recordStatusHistory(env, requestId, "WAITING_REPORTER_CONFIRMATION", "CLOSED_REPORTER_CONFIRMED", currentUser.id, null);
      await notifyStatusChange(env, requestId, "CLOSED_REPORTER_CONFIRMED", currentUser.id);

      return json({ success: true, status: "CLOSED_REPORTER_CONFIRMED" }, 200);
    }

    // Endpoint POST /api/requests/:id/reject-resolution - Pelapor menolak hasil
    const rejectResolutionMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/reject-resolution$/);
    if (rejectResolutionMatch && request.method === "POST") {
      if (currentUser.role !== "REPORTER") {
        return json({ error: "Hanya pelapor (REPORTER) yang dapat menolak hasil pekerjaan." }, 403);
      }

      const requestId = rejectResolutionMatch[1];
      const input = await request.json() as { reason?: string };

      if (!input.reason || input.reason.trim().length < 5) {
        return json({ error: "Alasan penolakan wajib diisi (minimal 5 karakter)." }, 422);
      }

      const checkRequest = await env.DB.prepare(`
        SELECT id, reporter_id, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; reporter_id: string; status: string }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      if (checkRequest.reporter_id !== currentUser.id) {
        return json({ error: "Anda hanya dapat menolak hasil laporan milik sendiri." }, 403);
      }

      if (checkRequest.status !== "WAITING_REPORTER_CONFIRMATION") {
        return json({ error: "Laporan tidak dalam status menunggu konfirmasi." }, 422);
      }

      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'REOPEN_REQUESTED',
            resolution_rejected_reason = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(input.reason.trim(), requestId).run();

      await recordStatusHistory(env, requestId, "WAITING_REPORTER_CONFIRMATION", "REOPEN_REQUESTED", currentUser.id, input.reason.trim());
      await notifyStatusChange(env, requestId, "REOPEN_REQUESTED", currentUser.id);

      return json({ success: true, status: "REOPEN_REQUESTED" }, 200);
    }

    // Endpoint POST /api/requests/:id/close - Admin menutup laporan
    const closeMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/close$/);
    if (closeMatch && request.method === "POST") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator (ADMIN) yang dapat menutup laporan." }, 403);
      }

      const requestId = closeMatch[1];
      const input = await request.json() as { reason?: string };
      const checkRequest = await env.DB.prepare(`
        SELECT id, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; status: string }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      const closedStatuses = ["CLOSED_AUTO", "CLOSED_ADMIN", "CLOSED_REPORTER_CONFIRMED"];
      if (closedStatuses.includes(checkRequest.status)) {
        return json({ error: "Laporan sudah ditutup." }, 422);
      }

      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'CLOSED_ADMIN',
            closed_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(requestId).run();

      await recordStatusHistory(env, requestId, checkRequest.status, "CLOSED_ADMIN", currentUser.id, input.reason?.trim() || null);
      await notifyStatusChange(env, requestId, "CLOSED_ADMIN", currentUser.id);

      return json({ success: true, status: "CLOSED_ADMIN" }, 200);
    }

    // Endpoint POST /api/requests/:id/reopen - Admin membuka ulang laporan
    const reopenMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/reopen$/);
    if (reopenMatch && request.method === "POST") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator (ADMIN) yang dapat membuka ulang laporan." }, 403);
      }

      const requestId = reopenMatch[1];
      const checkRequest = await env.DB.prepare(`
        SELECT id, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; status: string }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      if (checkRequest.status !== "REOPEN_REQUESTED") {
        return json({ error: "Hanya laporan berstatus REOPEN_REQUESTED yang dapat dibuka ulang." }, 422);
      }

      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'REOPENED',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(requestId).run();

      await recordStatusHistory(env, requestId, "REOPEN_REQUESTED", "REOPENED", currentUser.id, null);
      await notifyStatusChange(env, requestId, "REOPENED", currentUser.id);

      return json({ success: true, status: "REOPENED" }, 200);
    }

    // POST /api/requests/:id/assign - Admin menugaskan teknisi utama (FR-010)
    const adminAssignMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/assign$/);
    if (adminAssignMatch && request.method === "POST") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator (ADMIN) yang dapat menugaskan laporan." }, 403);
      }

      const requestId = adminAssignMatch[1];
      const input = await request.json() as { technician_id?: string };

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

      // Validasi: hanya boleh menugaskan jika status SUBMITTED, UNDER_REVIEW, atau REJECTED
      const assignableStatuses = ["SUBMITTED", "UNDER_REVIEW", "REJECTED"];
      if (!assignableStatuses.includes(checkRequest.status)) {
        return json({ error: "Laporan tidak dapat ditugaskan pada status saat ini." }, 422);
      }

      // Pastikan teknisi ada dan role TECHNICIAN
      const checkTechnician = await env.DB.prepare(`
        SELECT id, role FROM users WHERE id = ? AND role = 'TECHNICIAN' AND is_active = 1
      `).bind(input.technician_id).first<{ id: string; role: string }>();

      if (!checkTechnician) {
        return json({ error: "Teknisi tidak valid atau tidak aktif." }, 422);
      }

      // Hapus assignment aktif sebelumnya jika ada
      await env.DB.prepare(`
        UPDATE request_assignments SET status = 'REPLACED', updated_at = CURRENT_TIMESTAMP
        WHERE request_id = ? AND status = 'ACTIVE' AND assignment_type = 'PRIMARY'
      `).bind(requestId).run();

      // Buat assignment utama
      const assignmentId = `asgn-${crypto.randomUUID()}`;
      await env.DB.prepare(`
        INSERT INTO request_assignments
        (id, request_id, technician_id, assignment_type, status, assigned_by_user_id, reason, created_at, updated_at)
        VALUES (?, ?, ?, 'PRIMARY', 'ACTIVE', ?, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        assignmentId,
        requestId,
        input.technician_id,
        currentUser.id
      ).run();

      // Update status laporan ke ASSIGNED
      await env.DB.prepare(`
        UPDATE service_requests SET status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(requestId).run();

      // Catat riwayat status
      await recordStatusHistory(env, requestId, checkRequest.status, "ASSIGNED", currentUser.id, null);

      // Kirim notifikasi ke teknisi
      await notifyStatusChange(env, requestId, "ASSIGNED", currentUser.id);

      return json({ success: true, assignmentId }, 201);
    }

    // ========== FR-040: Teknisi Approve Reassignment ==========
    const techApproveMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/reassign\/approve$/);
    if (techApproveMatch && request.method === "POST") {
      if (currentUser.role !== "TECHNICIAN") {
        return json({ error: "Hanya teknisi yang dapat menyetujui penggantian tugas." }, 403);
      }

      const requestId = techApproveMatch[1];
      const input = await request.json() as { approve?: boolean };

      if (input.approve === undefined) {
        return json({ error: "Status persetujuan (approve) wajib diisi." }, 422);
      }

      // Ambil assignment berstatus REPLACEMENT_PENDING
      const pendingAssignment = await env.DB.prepare(`
        SELECT id, technician_id, reason, assigned_by_user_id, old_technician_approved_at, new_technician_approved_at
        FROM request_assignments
        WHERE request_id = ? AND status = 'REPLACEMENT_PENDING' AND assignment_type = 'PRIMARY'
      `).bind(requestId).first<{
        id: string;
        technician_id: string;
        reason: string;
        assigned_by_user_id: string;
        old_technician_approved_at: string | null;
        new_technician_approved_at: string | null;
      }>();

      if (!pendingAssignment) {
        return json({ error: "Tidak ada pengajuan penggantian teknisi yang aktif." }, 422);
      }

      // Ambil assignment yang sedang ACTIVE
      const activeAssignment = await env.DB.prepare(`
        SELECT id, technician_id FROM request_assignments
        WHERE request_id = ? AND status = 'ACTIVE' AND assignment_type = 'PRIMARY'
      `).bind(requestId).first<{ id: string; technician_id: string }>();

      if (!activeAssignment) {
        return json({ error: "Tidak ada teknisi utama aktif saat ini." }, 422);
      }

      const isOldTech = currentUser.id === activeAssignment.technician_id;
      const isNewTech = currentUser.id === pendingAssignment.technician_id;

      if (!isOldTech && !isNewTech) {
        return json({ error: "Anda tidak berhak memberikan persetujuan pada penggantian tugas ini." }, 403);
      }

      if (!input.approve) {
        // Jika menolak, status menjadi DECLINED
        await env.DB.prepare(`
          UPDATE request_assignments
          SET status = 'DECLINED', updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(pendingAssignment.id).run();

        // Kirim notifikasi ke admin
        await createNotification(
          env,
          pendingAssignment.assigned_by_user_id,
          "STATUS_CHANGE",
          "Penggantian Teknisi Ditolak",
          `Teknisi menolak pengajuan penggantian tugas untuk laporan ini.`,
          requestId
        );

        return json({ success: true, status: "DECLINED", message: "Penggantian tugas ditolak." });
      }

      // Jika menyetujui, update timestamp persetujuan
      let oldApproved = pendingAssignment.old_technician_approved_at;
      let newApproved = pendingAssignment.new_technician_approved_at;

      if (isOldTech) {
        oldApproved = new Date().toISOString();
        await env.DB.prepare(`
          UPDATE request_assignments
          SET old_technician_approved_at = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(oldApproved, pendingAssignment.id).run();
      }

      if (isNewTech) {
        newApproved = new Date().toISOString();
        await env.DB.prepare(`
          UPDATE request_assignments
          SET new_technician_approved_at = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(newApproved, pendingAssignment.id).run();
      }

      // Jika KEDUANYA sudah menyetujui, aktifkan assignment baru
      if (oldApproved && newApproved) {
        // Ubah assignment lama menjadi REPLACED
        await env.DB.prepare(`
          UPDATE request_assignments
          SET status = 'REPLACED', updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(activeAssignment.id).run();

        // Ubah assignment baru menjadi ACTIVE
        await env.DB.prepare(`
          UPDATE request_assignments
          SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(pendingAssignment.id).run();

        // Tambah riwayat status
        await recordStatusHistory(
          env,
          requestId,
          null,
          "ASSIGNED",
          pendingAssignment.assigned_by_user_id,
          `Teknisi diganti dengan persetujuan bersama.`
        );

        // Notifikasi ke admin
        await createNotification(
          env,
          pendingAssignment.assigned_by_user_id,
          "STATUS_CHANGE",
          "Penggantian Teknisi Berhasil",
          `Teknisi lama dan baru telah menyetujui penggantian tugas. Teknisi baru kini aktif.`,
          requestId
        );

        return json({
          success: true,
          status: "ACTIVE",
          old_approved: true,
          new_approved: true,
          message: "Penggantian teknisi telah disetujui sepenuhnya dan aktif."
        });
      }

      return json({
        success: true,
        status: "REPLACEMENT_PENDING",
        old_approved: !!oldApproved,
        new_approved: !!newApproved,
        message: "Persetujuan Anda berhasil dicatat. Menunggu persetujuan dari teknisi lainnya."
      });
    }

    // Endpoint /api/requests
    if (url.pathname.startsWith("/api/requests")) {
      
      // GET /api/requests
      if (request.method === "GET") {
        let query = `
          SELECT sr.id, sr.request_number, sr.title, sr.description, sr.status, sr.urgency, sr.rejection_reason, sr.created_at,
                 c.name AS category,
                 r.building || ' - ' || r.floor || ' - ' || r.room_name AS location,
                 u_tech.name AS technician_name
          FROM service_requests sr
          JOIN categories c ON sr.category_id = c.id
          JOIN rooms r ON sr.room_id = r.id
          LEFT JOIN request_assignments ra ON sr.id = ra.request_id AND ra.status = 'ACTIVE'
          LEFT JOIN users u_tech ON ra.technician_id = u_tech.id
        `;
        let params: string[] = [];

        // Jika Reporter, filter hanya laporan miliknya sendiri
        if (currentUser.role === "REPORTER") {
          query += " WHERE sr.reporter_id = ?";
          params.push(currentUser.id);
        }

        // Jika Teknisi, filter hanya tugas aktif atau pengajuan penggantian yang melibatkan dirinya
        if (currentUser.role === "TECHNICIAN") {
          query += " WHERE (ra.technician_id = ? AND ra.status = 'ACTIVE') OR EXISTS (SELECT 1 FROM request_assignments ra2 WHERE ra2.request_id = sr.id AND ra2.technician_id = ? AND ra2.status = 'REPLACEMENT_PENDING')";
          params.push(currentUser.id, currentUser.id);
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

        await recordStatusHistory(env, id, null, "SUBMITTED", currentUser.id, null);
        await notifyStatusChange(env, id, "SUBMITTED", currentUser.id);

        return json({
          id,
          requestNumber,
          status: "SUBMITTED"
        }, 201);
      }
    }

    // Endpoint GET & POST /api/requests/:id/comments
    const commentsMatch = url.pathname.match(/^\/api\/requests\/([a-zA-Z0-9-]+)\/comments$/);
    if (commentsMatch) {
      const requestId = commentsMatch[1];

      // Pastikan laporan ada
      const checkRequest = await env.DB.prepare(`
        SELECT id, reporter_id FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; reporter_id: string }>();

      if (!checkRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      // GET /api/requests/:id/comments
      if (request.method === "GET") {
        const result = await env.DB.prepare(`
          SELECT rc.id, rc.content, rc.created_at, u.name AS author_name, u.role AS author_role
          FROM request_comments rc
          JOIN users u ON rc.user_id = u.id
          WHERE rc.request_id = ?
          ORDER BY rc.created_at ASC
        `).bind(requestId).all();

        return json({ data: result.results });
      }

      // POST /api/requests/:id/comments
      if (request.method === "POST") {
        const input = await request.json() as { content?: string };

        if (!input.content || input.content.trim().length < 5) {
          return json({ error: "Komentar wajib diisi (minimal 5 karakter)." }, 422);
        }

        const commentId = `cmt-${crypto.randomUUID()}`;

        await env.DB.prepare(`
          INSERT INTO request_comments (id, request_id, user_id, content)
          VALUES (?, ?, ?, ?)
        `).bind(commentId, requestId, currentUser.id, input.content.trim()).run();

        return json({ success: true, id: commentId }, 201);
      }
    }

    // Endpoint GET /api/notifications - Ambil notifikasi pengguna saat ini
    if (url.pathname === "/api/notifications" && request.method === "GET") {
      const result = await env.DB.prepare(`
        SELECT id, type, title, message, request_id, is_read, read_at, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
      `).bind(currentUser.id).all();

      const unreadCount = await env.DB.prepare(`
        SELECT COUNT(*) AS count FROM notifications
        WHERE user_id = ? AND is_read = 0
      `).bind(currentUser.id).first<{ count: number }>();

      return json({
        data: result.results,
        unread_count: unreadCount?.count || 0
      });
    }

    // Endpoint POST /api/notifications/:id/read - Tandai notifikasi sudah dibaca
    const notificationReadMatch = url.pathname.match(/^\/api\/notifications\/([a-zA-Z0-9-]+)\/read$/);
    if (notificationReadMatch && request.method === "POST") {
      const notificationId = notificationReadMatch[1];

      const notif = await env.DB.prepare(`
        SELECT id, user_id FROM notifications WHERE id = ?
      `).bind(notificationId).first<{ id: string; user_id: string }>();

      if (!notif) {
        return json({ error: "Notifikasi tidak ditemukan." }, 404);
      }

      if (notif.user_id !== currentUser.id) {
        return json({ error: "Anda hanya dapat menandai notifikasi milik sendiri." }, 403);
      }

      await env.DB.prepare(`
        UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(notificationId).run();

      return json({ success: true });
    }

    // Endpoint POST /api/notifications/read-all - Tandai semua notifikasi sudah dibaca
    if (url.pathname === "/api/notifications/read-all" && request.method === "POST") {
      await env.DB.prepare(`
        UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND is_read = 0
      `).bind(currentUser.id).run();

      return json({ success: true });
    }

    // ========== FR-14: Room Management Endpoints ==========

    // GET /api/rooms/grouped - Daftar ruangan dengan grouping gedung/lantai (FR-035)
    if (url.pathname === "/api/rooms/grouped" && request.method === "GET") {
      const result = await env.DB.prepare(`
        SELECT building, floor, id, room_name
        FROM rooms
        WHERE is_active = 1
        ORDER BY building ASC, floor ASC, room_name ASC
      `).all<{ building: string; floor: string; id: string; room_name: string }>();

      // Group by building -> floor -> rooms
      const grouped: Record<string, Record<string, { id: string; room_name: string }[]>> = {};
      for (const row of result.results) {
        if (!grouped[row.building]) grouped[row.building] = {};
        if (!grouped[row.building][row.floor]) grouped[row.building][row.floor] = [];
        grouped[row.building][row.floor].push({ id: row.id, room_name: row.room_name });
      }

      return json({ data: grouped });
    }

    // POST /api/rooms - Tambah ruangan baru (FR-030, AC-028)
    if (url.pathname === "/api/rooms" && request.method === "POST") {
      if (currentUser.role !== "FACILITY_MANAGER") {
        return json({ error: "Hanya Manajer Fasilitas yang dapat menambahkan ruangan." }, 403);
      }

      const input = await request.json() as {
        building?: string;
        floor?: string;
        room_name?: string;
      };

      if (!input.building || input.building.trim().length < 1) {
        return json({ error: "Nama gedung wajib diisi." }, 422);
      }
      if (!input.floor || input.floor.trim().length < 1) {
        return json({ error: "Nama lantai wajib diisi." }, 422);
      }
      if (!input.room_name || input.room_name.trim().length < 1) {
        return json({ error: "Nama ruangan wajib diisi." }, 422);
      }

      const building = input.building.trim();
      const floor = input.floor.trim();
      const roomName = input.room_name.trim();

      // Cek duplikasi
      const existing = await env.DB.prepare(`
        SELECT id FROM rooms WHERE building = ? AND floor = ? AND room_name = ?
      `).bind(building, floor, roomName).first();

      if (existing) {
        return json({ error: "Ruangan dengan gedung, lantai, dan nama yang sama sudah ada." }, 422);
      }

      const roomId = `rm-${crypto.randomUUID()}`;
      await env.DB.prepare(`
        INSERT INTO rooms (id, building, floor, room_name)
        VALUES (?, ?, ?, ?)
      `).bind(roomId, building, floor, roomName).run();

      // Log
      const logId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO room_management_log (id, room_id, action, performed_by_user_id, new_building, new_floor, new_room_name)
        VALUES (?, ?, 'CREATE', ?, ?, ?, ?)
      `).bind(logId, roomId, currentUser.id, building, floor, roomName).run();

      return json({
        success: true,
        room: { id: roomId, building, floor, room_name: roomName },
      }, 201);
    }

    // PATCH /api/rooms/:id - Update ruangan
    const roomUpdateMatch = url.pathname.match(/^\/api\/rooms\/([a-zA-Z0-9-]+)$/);
    if (roomUpdateMatch && request.method === "PATCH") {
      if (currentUser.role !== "FACILITY_MANAGER") {
        return json({ error: "Hanya Manajer Fasilitas yang dapat mengupdate ruangan." }, 403);
      }

      const roomId = roomUpdateMatch[1];
      const input = await request.json() as {
        building?: string;
        floor?: string;
        room_name?: string;
        is_active?: number;
      };

      // Ambil data lama
      const oldRoom = await env.DB.prepare(`
        SELECT id, building, floor, room_name, is_active FROM rooms WHERE id = ?
      `).bind(roomId).first<{ id: string; building: string; floor: string; room_name: string; is_active: number }>();

      if (!oldRoom) {
        return json({ error: "Ruangan tidak ditemukan." }, 404);
      }

      const newBuilding = input.building?.trim() || oldRoom.building;
      const newFloor = input.floor?.trim() || oldRoom.floor;
      const newRoomName = input.room_name?.trim() || oldRoom.room_name;
      const newIsActive = input.is_active !== undefined ? input.is_active : oldRoom.is_active;

      // Cek duplikasi jika ada perubahan nama
      if (newBuilding !== oldRoom.building || newFloor !== oldRoom.floor || newRoomName !== oldRoom.room_name) {
        const duplicate = await env.DB.prepare(`
          SELECT id FROM rooms WHERE building = ? AND floor = ? AND room_name = ? AND id != ?
        `).bind(newBuilding, newFloor, newRoomName, roomId).first();

        if (duplicate) {
          return json({ error: "Ruangan dengan gedung, lantai, dan nama yang sama sudah ada." }, 422);
        }
      }

      await env.DB.prepare(`
        UPDATE rooms
        SET building = ?, floor = ?, room_name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(newBuilding, newFloor, newRoomName, newIsActive, roomId).run();

      // Log
      const logId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO room_management_log (id, room_id, action, performed_by_user_id, old_building, old_floor, old_room_name, new_building, new_floor, new_room_name)
        VALUES (?, ?, 'UPDATE', ?, ?, ?, ?, ?, ?, ?)
      `).bind(logId, roomId, currentUser.id, oldRoom.building, oldRoom.floor, oldRoom.room_name, newBuilding, newFloor, newRoomName).run();

      return json({ success: true });
    }

    // DELETE /api/rooms/:id - Soft delete ruangan
    const roomDeleteMatch = url.pathname.match(/^\/api\/rooms\/([a-zA-Z0-9-]+)$/);
    if (roomDeleteMatch && request.method === "DELETE") {
      if (currentUser.role !== "FACILITY_MANAGER") {
        return json({ error: "Hanya Manajer Fasilitas yang dapat menonaktifkan ruangan." }, 403);
      }

      const roomId = roomDeleteMatch[1];

      // Cek apakah ruangan sedang digunakan di laporan aktif
      const activeRequest = await env.DB.prepare(`
        SELECT id FROM service_requests WHERE room_id = ? AND status NOT IN ('CLOSED_AUTO', 'CLOSED_ADMIN', 'CLOSED_REPORTER_CONFIRMED', 'CANCELLED', 'MERGED')
      `).bind(roomId).first();

      if (activeRequest) {
        return json({ error: "Ruangan sedang digunakan di laporan aktif. Tidak dapat dinonaktifkan." }, 422);
      }

      // Ambil data lama untuk log
      const oldRoom = await env.DB.prepare(`
        SELECT building, floor, room_name FROM rooms WHERE id = ?
      `).bind(roomId).first<{ building: string; floor: string; room_name: string }>();

      await env.DB.prepare(`
        UPDATE rooms SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(roomId).run();

      // Log
      if (oldRoom) {
        const logId = crypto.randomUUID();
        await env.DB.prepare(`
          INSERT INTO room_management_log (id, room_id, action, performed_by_user_id, old_building, old_floor, old_room_name)
          VALUES (?, ?, 'DEACTIVATE', ?, ?, ?, ?)
        `).bind(logId, roomId, currentUser.id, oldRoom.building, oldRoom.floor, oldRoom.room_name).run();
      }

      return json({ success: true, message: "Ruangan berhasil dinonaktifkan." });
    }

    // ========== FR-038: Admin Edit Laporan ==========
    const adminEditMatch = url.pathname.match(/^\/api\/admin\/requests\/([a-zA-Z0-9-]+)\/edit$/);
    if (adminEditMatch && request.method === "PATCH") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator yang dapat mengubah laporan." }, 403);
      }

      const requestId = adminEditMatch[1];
      const input = await request.json() as {
        category_id?: string;
        room_id?: string;
        description?: string;
        reason?: string;
      };

      if (!input.reason || input.reason.trim().length < 5) {
        return json({ error: "Alasan perubahan wajib diisi (minimal 5 karakter)." }, 422);
      }

      const existingRequest = await env.DB.prepare(`
        SELECT id, title, description, category_id, room_id, urgency, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; title: string; description: string; category_id: string; room_id: string; urgency: string; status: string }>();

      if (!existingRequest) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      // Hanya boleh edit sebelum penugasan teknisi
      const editableStatuses = ["SUBMITTED", "UNDER_REVIEW"];
      if (!editableStatuses.includes(existingRequest.status)) {
        return json({ error: "Laporan tidak dapat diubah setelah teknisi ditugaskan." }, 422);
      }

      const updates: Record<string, unknown> = {};
      const editRecord: Record<string, unknown> = {
        id: crypto.randomUUID(),
        request_id: requestId,
        edited_by_user_id: currentUser.id,
        old_title: existingRequest.title,
        new_title: existingRequest.title,
        old_description: existingRequest.description,
        new_description: existingRequest.description,
        old_category_id: existingRequest.category_id,
        new_category_id: existingRequest.category_id,
        old_room_id: existingRequest.room_id,
        new_room_id: existingRequest.room_id,
        old_urgency: existingRequest.urgency,
        new_urgency: existingRequest.urgency,
        reason: input.reason.trim(),
      };

      if (input.description !== undefined) {
        const trimmed = input.description.trim();
        if (trimmed.length < 20) {
          return json({ error: "Deskripsi minimal 20 karakter." }, 422);
        }
        updates.description = trimmed;
        editRecord.new_description = trimmed;
      }

      if (input.category_id !== undefined) {
        const categoryExists = await env.DB.prepare(`
          SELECT id FROM categories WHERE id = ? AND is_active = 1
        `).bind(input.category_id).first();
        if (!categoryExists) {
          return json({ error: "Kategori tidak valid." }, 422);
        }
        updates.category_id = input.category_id;
        editRecord.new_category_id = input.category_id;
      }

      if (input.room_id !== undefined) {
        const roomExists = await env.DB.prepare(`
          SELECT id FROM rooms WHERE id = ? AND is_active = 1
        `).bind(input.room_id).first();
        if (!roomExists) {
          return json({ error: "Ruangan tidak valid." }, 422);
        }
        updates.room_id = input.room_id;
        editRecord.new_room_id = input.room_id;
      }

      if (Object.keys(updates).length === 0) {
        return json({ error: "Tidak ada field yang diubah." }, 422);
      }

      await env.DB.prepare(`
        UPDATE service_requests
        SET description = COALESCE(?, description),
            category_id = COALESCE(?, category_id),
            room_id = COALESCE(?, room_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        updates.description ?? null,
        updates.category_id ?? null,
        updates.room_id ?? null,
        requestId
      ).run();

      // Simpan riwayat perubahan
      await env.DB.prepare(`
        INSERT INTO request_edits
        (id, request_id, edited_by_user_id, old_title, new_title, old_description, new_description,
         old_category_id, new_category_id, old_room_id, new_room_id, old_urgency, new_urgency, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        editRecord.id,
        editRecord.request_id,
        editRecord.edited_by_user_id,
        editRecord.old_title,
        editRecord.new_title,
        editRecord.old_description,
        editRecord.new_description,
        editRecord.old_category_id,
        editRecord.new_category_id,
        editRecord.old_room_id,
        editRecord.new_room_id,
        editRecord.old_urgency,
        editRecord.new_urgency,
        editRecord.reason
      ).run();

      await recordStatusHistory(env, requestId, existingRequest.status, existingRequest.status, currentUser.id, `Diedit administrator: ${input.reason.trim()}`);

      return json({ success: true, message: "Laporan berhasil diperbarui oleh administrator." });
    }

    // ========== FR-039: Admin Merge Laporan Duplikat ==========
    const adminMergeMatch = url.pathname.match(/^\/api\/admin\/requests\/([a-zA-Z0-9-]+)\/merge$/);
    if (adminMergeMatch && request.method === "POST") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator yang dapat menggabungkan laporan." }, 403);
      }

      const duplicateId = adminMergeMatch[1];
      const input = await request.json() as { main_request_id?: string };

      if (!input.main_request_id) {
        return json({ error: "ID laporan utama (main_request_id) wajib diisi." }, 422);
      }

      const mainId = input.main_request_id;
      if (duplicateId === mainId) {
        return json({ error: "Laporan tidak dapat digabungkan dengan dirinya sendiri." }, 422);
      }

      // Ambil kedua laporan
      const duplicateRequest = await env.DB.prepare(`
        SELECT id, request_number, status FROM service_requests WHERE id = ?
      `).bind(duplicateId).first<{ id: string; request_number: string; status: string }>();

      const mainRequest = await env.DB.prepare(`
        SELECT id, request_number, status FROM service_requests WHERE id = ?
      `).bind(mainId).first<{ id: string; request_number: string; status: string }>();

      if (!duplicateRequest || !mainRequest) {
        return json({ error: "Laporan utama atau laporan duplikat tidak ditemukan." }, 404);
      }

      const closedStatuses = ["CLOSED_AUTO", "CLOSED_ADMIN", "CLOSED_REPORTER_CONFIRMED", "CANCELLED", "MERGED"];
      if (closedStatuses.includes(duplicateRequest.status) || closedStatuses.includes(mainRequest.status)) {
        return json({ error: "Laporan yang sudah ditutup, dibatalkan, atau digabungkan tidak dapat digabungkan kembali." }, 422);
      }

      // Gabungkan laporan duplikat: ubah status ke MERGED dan set duplicate_of_id
      await env.DB.prepare(`
        UPDATE service_requests
        SET status = 'MERGED', duplicate_of_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(mainId, duplicateId).run();

      // Tambahkan riwayat status untuk laporan duplikat
      await recordStatusHistory(
        env,
        duplicateId,
        duplicateRequest.status,
        "MERGED",
        currentUser.id,
        `Digabungkan ke laporan utama #${mainRequest.request_number}`
      );

      // Tambahkan komentar di laporan duplikat
      const commentId1 = `cmt-${crypto.randomUUID()}`;
      await env.DB.prepare(`
        INSERT INTO request_comments (id, request_id, user_id, content)
        VALUES (?, ?, ?, ?)
      `).bind(
        commentId1,
        duplicateId,
        currentUser.id,
        `[SISTEM] Laporan ini telah ditandai sebagai duplikat dan digabungkan ke laporan utama #${mainRequest.request_number}.`
      ).run();

      // Tambahkan komentar di laporan utama
      const commentId2 = `cmt-${crypto.randomUUID()}`;
      await env.DB.prepare(`
        INSERT INTO request_comments (id, request_id, user_id, content)
        VALUES (?, ?, ?, ?)
      `).bind(
        commentId2,
        mainId,
        currentUser.id,
        `[SISTEM] Laporan duplikat #${duplicateRequest.request_number} telah digabungkan ke laporan ini.`
      ).run();

      return json({ success: true, message: "Laporan duplikat berhasil digabungkan ke laporan utama." });
    }

    // ========== FR-040: Admin Reassign Teknisi ==========
    const adminReassignMatch = url.pathname.match(/^\/api\/admin\/requests\/([a-zA-Z0-9-]+)\/reassign$/);
    if (adminReassignMatch && request.method === "POST") {
      if (currentUser.role !== "ADMIN") {
        return json({ error: "Hanya administrator yang dapat mengganti teknisi." }, 403);
      }

      const requestId = adminReassignMatch[1];
      const input = await request.json() as {
        new_technician_id?: string;
        reason?: string;
      };

      if (!input.new_technician_id || !input.reason || input.reason.trim().length < 5) {
        return json({ error: "Teknisi baru dan alasan penggantian wajib diisi (minimal 5 karakter)." }, 422);
      }

      // Ambil data laporan
      const req = await env.DB.prepare(`
        SELECT id, status FROM service_requests WHERE id = ?
      `).bind(requestId).first<{ id: string; status: string }>();

      if (!req) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      // Pastikan ada teknisi utama yang sedang aktif
      const activeAssignment = await env.DB.prepare(`
        SELECT id, technician_id FROM request_assignments
        WHERE request_id = ? AND status = 'ACTIVE' AND assignment_type = 'PRIMARY'
      `).bind(requestId).first<{ id: string; technician_id: string }>();

      if (!activeAssignment) {
        return json({ error: "Belum ada teknisi utama aktif yang ditugaskan pada laporan ini." }, 422);
      }

      if (activeAssignment.technician_id === input.new_technician_id) {
        return json({ error: "Teknisi baru tidak boleh sama dengan teknisi saat ini." }, 422);
      }

      // Pastikan teknisi baru adalah user berrole TECHNICIAN
      const newTech = await env.DB.prepare(`
        SELECT id, name FROM users WHERE id = ? AND role = 'TECHNICIAN' AND is_active = 1
      `).bind(input.new_technician_id).first();

      if (!newTech) {
        return json({ error: "Teknisi baru tidak valid atau tidak aktif." }, 422);
      }

      // Cek apakah sudah ada pengajuan reassign yang sedang berjalan (PENDING)
      const pendingAssignment = await env.DB.prepare(`
        SELECT id FROM request_assignments
        WHERE request_id = ? AND status = 'REPLACEMENT_PENDING'
      `).bind(requestId).first();

      if (pendingAssignment) {
        return json({ error: "Sudah ada pengajuan penggantian teknisi yang sedang menunggu persetujuan." }, 422);
      }

      // Buat assignment baru dengan status REPLACEMENT_PENDING
      const assignmentId = `asgn-${crypto.randomUUID()}`;
      await env.DB.prepare(`
        INSERT INTO request_assignments
        (id, request_id, technician_id, assignment_type, status, assigned_by_user_id, reason)
        VALUES (?, ?, ?, 'PRIMARY', 'REPLACEMENT_PENDING', ?, ?)
      `).bind(
        assignmentId,
        requestId,
        input.new_technician_id,
        currentUser.id,
        input.reason.trim()
      ).run();

      // Kirim notifikasi ke teknisi lama
      await createNotification(
        env,
        activeAssignment.technician_id,
        "STATUS_CHANGE",
        "Pengajuan Penggantian Tugas",
        `Administrator mengajukan penggantian Anda pada laporan ini. Butuh persetujuan Anda.`,
        requestId
      );

      // Kirim notifikasi ke teknisi baru
      await createNotification(
        env,
        input.new_technician_id,
        "STATUS_CHANGE",
        "Tawaran Tugas Baru (Penggantian)",
        `Administrator menawarkan tugas baru sebagai pengganti teknisi lama pada laporan ini.`,
        requestId
      );

      return json({ success: true, assignment_id: assignmentId, message: "Pengajuan penggantian teknisi berhasil dikirim." });
    }

    // ========== FR-024, FR-025, FR-026: Facility Manager Dashboard Stats ==========
    if (url.pathname === "/api/reports/stats" && request.method === "GET") {
      if (currentUser.role !== "FACILITY_MANAGER") {
        return json({ error: "Hanya Manajer Fasilitas yang dapat mengakses data ini." }, 403);
      }

      const totalSolvedResult = await env.DB.prepare(`
        SELECT COUNT(*) AS count FROM service_requests
        WHERE status IN ('CLOSED_AUTO', 'CLOSED_ADMIN', 'CLOSED_REPORTER_CONFIRMED')
      `).first<{ count: number }>();

      const categoryChartResult = await env.DB.prepare(`
        SELECT c.name AS category_name, COUNT(r.id) AS count
        FROM service_requests r
        JOIN categories c ON r.category_id = c.id
        GROUP BY c.name
      `).all<{ category_name: string; count: number }>();

      return json({
        success: true,
        total_solved: totalSolvedResult?.count || 0,
        category_chart: categoryChartResult.results
      });
    }

    // ========== FR-028, FR-029, FR-042: Facility Manager Laporan Ringkas & CSV ==========
    const fmSummaryMatch = url.pathname.match(/^\/api\/reports\/summary(\.csv)?$/);
    if (fmSummaryMatch && request.method === "GET") {
      if (currentUser.role !== "FACILITY_MANAGER") {
        return json({ error: "Hanya Manajer Fasilitas yang dapat mengakses data ini." }, 403);
      }

      const isCsv = !!fmSummaryMatch[1];
      const categoryId = url.searchParams.get("category_id");
      const roomId = url.searchParams.get("room_id");
      const startDate = url.searchParams.get("start_date");
      const endDate = url.searchParams.get("end_date");
      const sort = url.searchParams.get("sort") || "newest";

      let query = `
        SELECT r.id, r.request_number, r.title, r.status, c.name AS category,
               ro.building || ' - ' || ro.floor || ' - ' || ro.room_name AS location,
               r.created_at, r.closed_at,
               (SELECT note FROM facility_manager_notes WHERE request_id = r.id ORDER BY created_at DESC LIMIT 1) AS follow_up_note
        FROM service_requests r
        JOIN categories c ON r.category_id = c.id
        JOIN rooms ro ON r.room_id = ro.id
        WHERE 1 = 1
      `;

      const params: string[] = [];

      if (categoryId) {
        query += ` AND r.category_id = ? `;
        params.push(categoryId);
      }

      if (roomId) {
        query += ` AND r.room_id = ? `;
        params.push(roomId);
      }

      if (startDate) {
        query += ` AND r.created_at >= ? `;
        params.push(startDate);
      }

      if (endDate) {
        query += ` AND r.created_at <= ? `;
        params.push(endDate + " 23:59:59");
      }

      if (sort === "oldest") {
        query += ` ORDER BY r.created_at ASC `;
      } else {
        query += ` ORDER BY r.created_at DESC `;
      }

      const statement = env.DB.prepare(query);
      const result = await (params.length > 0 ? statement.bind(...params) : statement).all<{
        id: string;
        request_number: string;
        title: string;
        status: string;
        category: string;
        location: string;
        created_at: string;
        closed_at: string | null;
        follow_up_note: string | null;
      }>();

      if (isCsv) {
        let csvContent = "\uFEFFNo Laporan,Judul,Kategori,Lokasi,Status,Tanggal Dibuat,Tanggal Ditutup,Catatan Tindak Lanjut\n";
        for (const row of result.results) {
          const cleanTitle = row.title.replace(/"/g, '""');
          const cleanNote = (row.follow_up_note || "").replace(/"/g, '""');
          csvContent += `"${row.request_number}","${cleanTitle}","${row.category}","${row.location}","${row.status}","${row.created_at}","${row.closed_at || ''}","${cleanNote}"\n`;
        }
        return new Response(csvContent, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="Laporan_Ringkas_${Date.now()}.csv"`
          }
        });
      }

      return json({ success: true, data: result.results });
    }

    // ========== FR-043: Facility Manager Catatan Tindak Lanjut ==========
    const fmFollowUpMatch = url.pathname.match(/^\/api\/reports\/([a-zA-Z0-9-]+)\/follow-up$/);
    if (fmFollowUpMatch && request.method === "POST") {
      if (currentUser.role !== "FACILITY_MANAGER") {
        return json({ error: "Hanya Manajer Fasilitas yang dapat memberikan catatan tindak lanjut." }, 403);
      }

      const requestId = fmFollowUpMatch[1];
      const input = await request.json() as { note?: string; reason?: string };

      if (!input.note || input.note.trim().length < 1) {
        return json({ error: "Catatan tindak lanjut wajib diisi." }, 422);
      }

      if (!input.reason || input.reason.trim().length < 5) {
        return json({ error: "Alasan wajib diisi (minimal 5 karakter)." }, 422);
      }

      // Pastikan laporan ada
      const reqExists = await env.DB.prepare(`
        SELECT id FROM service_requests WHERE id = ?
      `).bind(requestId).first();

      if (!reqExists) {
        return json({ error: "Laporan tidak ditemukan." }, 404);
      }

      const id = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO facility_manager_notes (id, request_id, manager_id, note, reason)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        id,
        requestId,
        currentUser.id,
        input.note.trim(),
        input.reason.trim()
      ).run();

      return json({ success: true, message: "Catatan tindak lanjut berhasil disimpan." }, 201);
    }

    return json({ error: "Alamat API tidak ditemukan." }, 404);
  }
} satisfies ExportedHandler<Env>;
