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

// Otorisasi Global untuk endpoint /api/requests
if (url.pathname.startsWith("/api/requests")) {
  const userEmail = request.headers.get("X-User-Email");
  const userRole = request.headers.get("X-User-Role");

  if (!userEmail || !userRole) {
    return json({ error: "Unauthorized. Silakan login terlebih dahulu." }, 401);
  }

  // GET /api/requests
  if (request.method === "GET") {
    const result = await env.DB.prepare(`
    SELECT id, request_number, title, location,
    category, priority, status
    FROM service_requests
    ORDER BY created_at DESC
    `).all();

    return json({ data: result.results });
  }

  // POST /api/requests
  if (request.method === "POST") {
    if (userRole !== "REPORTER") {
      return json({ error: "Hanya pelapor (REPORTER) yang dapat membuat laporan baru." }, 403);
    }

    const input = await request.json() as {
      title?: string;
      description?: string;
      location?: string;
      category?: string;
    };

    if (
      !input.title ||
      !input.description ||
      !input.location ||
      !input.category
    ) {
      return json({ error: "Semua field wajib diisi." }, 422);
    }

    if (input.description.trim().length < 20) {
      return json({
        error: "Deskripsi minimal 20 karakter."
      }, 422);
    }

    const id = crypto.randomUUID();
    const requestNumber = `CSR-${Date.now()}`;

    await env.DB.prepare(`
      INSERT INTO service_requests
      (id, request_number, title, description,
      location, category, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, 'MEDIUM', 'SUBMITTED')
    `).bind(
      id,
      requestNumber,
      input.title.trim(),
      input.description.trim(),
      input.location.trim(),
      input.category.trim()
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