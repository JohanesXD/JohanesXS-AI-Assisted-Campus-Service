import { useEffect, useState } from "react";
import "./App.css";

type ServiceRequest = {
  id: string;
  request_number: string;
  title: string;
  description?: string;
  location: string; // Gedung - Lantai - Ruangan
  category: string;  // Category name
  priority: string;
  status: string;
  urgency: string;
  rejection_reason?: string;
};

type UserSession = {
  id: string;
  campus_email: string;
  name: string;
  role: string;
};

type Category = {
  id: string;
  name: string;
};

type Room = {
  id: string;
  building: string;
  floor: string;
  room_name: string;
};

export default function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  
  // Login Form States
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState("REPORTER");
  const [loginError, setLoginError] = useState("");

  // Metadata Lists
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);

  // Request Form & List States
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [message, setMessage] = useState("");

  // Dynamic Room Dropdowns
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // Admin Action States
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("campus_session");
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem("campus_session");
      }
    }
  }, []);

  // Load requests and metadata on login
  useEffect(() => {
    if (user) {
      if (["REPORTER", "ADMIN"].includes(user.role)) {
        loadRequests();
      }
      if (user.role === "REPORTER") {
        loadMetadata();
      }
    }
  }, [user]);

  async function loadMetadata() {
    if (!user) return;
    try {
      // Fetch Categories
      const catResponse = await fetch("/api/categories", {
        headers: {
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        }
      });
      const catResult = await catResponse.json();
      const cats = catResult.data ?? [];
      setCategoriesList(cats);
      if (cats.length > 0) {
        setSelectedCategoryId(cats[0].id);
      }

      // Fetch Rooms
      const roomResponse = await fetch("/api/rooms", {
        headers: {
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        }
      });
      const roomResult = await roomResponse.json();
      const rooms = roomResult.data ?? [];
      setRoomsList(rooms);

      // Initialize Dynamic Dropdowns
      if (rooms.length > 0) {
        const buildings = Array.from(new Set(rooms.map((r: Room) => r.building))) as string[];
        const defaultBuilding = buildings[0];
        setSelectedBuilding(defaultBuilding);

        const floors = Array.from(new Set(rooms.filter((r: Room) => r.building === defaultBuilding).map((r: Room) => r.floor))) as string[];
        const defaultFloor = floors[0];
        setSelectedFloor(defaultFloor);

        const filteredRooms = rooms.filter((r: Room) => r.building === defaultBuilding && r.floor === defaultFloor);
        if (filteredRooms.length > 0) {
          setSelectedRoomId(filteredRooms[0].id);
        }
      }
    } catch (e) {
      console.error("Gagal memuat data master", e);
    }
  }

  // Handle building change
  function handleBuildingChange(building: string) {
    setSelectedBuilding(building);
    const floors = Array.from(new Set(roomsList.filter(r => r.building === building).map(r => r.floor)));
    const defaultFloor = floors[0] ?? "";
    setSelectedFloor(defaultFloor);

    const filteredRooms = roomsList.filter(r => r.building === building && r.floor === defaultFloor);
    setSelectedRoomId(filteredRooms[0]?.id ?? "");
  }

  // Handle floor change
  function handleFloorChange(floor: string) {
    setSelectedFloor(floor);
    const filteredRooms = roomsList.filter(r => r.building === selectedBuilding && r.floor === floor);
    setSelectedRoomId(filteredRooms[0]?.id ?? "");
  }

  async function loadRequests() {
    if (!user) return;
    try {
      const response = await fetch("/api/requests", {
        headers: {
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        }
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }
      
      const result = await response.json();
      setRequests(result.data ?? []);
    } catch (e) {
      console.error("Gagal memuat laporan", e);
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");

    if (!emailInput.trim()) {
      setLoginError("Email kampus wajib diisi.");
      return;
    }

    const email = emailInput.trim();
    if (!email.endsWith(".ac.id") && !email.endsWith("campus.ac.id")) {
      setLoginError("Format email kampus tidak valid (harus berakhiran .ac.id).");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: roleInput })
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.error ?? "Login gagal dilakukan.");
        return;
      }

      setUser(result.user);
      localStorage.setItem("campus_session", JSON.stringify(result.user));
    } catch (e) {
      setLoginError("Koneksi gagal. Silakan coba beberapa saat lagi.");
    }
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("campus_session");
    setRequests([]);
    setEmailInput("");
    setLoginError("");
    setCategoriesList([]);
    setRoomsList([]);
    setSelectedRequest(null);
    setRejectionReasonInput("");
    setAdminError("");
    setAdminSuccess("");
  }

  async function handleReject(requestId: string) {
    setAdminError("");
    setAdminSuccess("");

    if (!rejectionReasonInput.trim() || rejectionReasonInput.trim().length < 5) {
      setAdminError("Alasan penolakan minimal 5 karakter.");
      return;
    }

    try {
      const response = await fetch(`/api/requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user?.campus_email ?? "",
          "X-User-Role": user?.role ?? ""
        },
        body: JSON.stringify({ reason: rejectionReasonInput })
      });

      const result = await response.json();

      if (!response.ok) {
        setAdminError(result.error ?? "Gagal menolak laporan.");
        return;
      }

      setAdminSuccess("Laporan berhasil ditolak.");
      setRejectionReasonInput("");
      setSelectedRequest(null);
      await loadRequests();
    } catch (e) {
      setAdminError("Koneksi bermasalah. Gagal mengirim penolakan.");
    }
  }

  async function submitRequest(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!user) return;

    if (!title.trim() || !description.trim() || !selectedCategoryId || !selectedRoomId || !urgency) {
      setMessage("Semua field wajib diisi.");
      return;
    }

    if (description.trim().length < 20) {
      setMessage("Deskripsi minimal 20 karakter.");
      return;
    }

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          title,
          description,
          category_id: selectedCategoryId,
          room_id: selectedRoomId,
          urgency,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Laporan gagal dibuat.");
        return;
      }

      setMessage(`Laporan berhasil dibuat: ${result.requestNumber}`);
      setTitle("");
      setDescription("");
      await loadRequests();
    } catch (e) {
      setMessage("Koneksi terputus. Gagal mengirim laporan.");
    }
  }

  // Tampilan Sebelum Login
  if (!user) {
    return (
      <div className="login-wrapper">
        <div className="premium-card">
          <h2 style={{ fontSize: 28, marginBottom: 8, color: "var(--text-h)" }}>Campus Service</h2>
          <p style={{ color: "var(--text)", marginBottom: 28 }}>Silakan masuk menggunakan akun kampus Anda.</p>

          {loginError && <div className="alert-error">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Kampus</label>
              <input
                id="email"
                type="text"
                placeholder="misal: student@campus.ac.id"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Masuk Sebagai (Simulasi Role)</label>
              <select
                id="role"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                className="form-select"
              >
                <option value="REPORTER">Pelapor (Reporter)</option>
                <option value="ADMIN">Administrator (Admin)</option>
                <option value="TECHNICIAN">Teknisi (Technician)</option>
                <option value="FACILITY_MANAGER">Manajer Fasilitas</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  // Dynamic lists from room metadata
  const buildingsList = Array.from(new Set(roomsList.map(r => r.building)));
  const floorsList = Array.from(new Set(roomsList.filter(r => r.building === selectedBuilding).map(r => r.floor)));
  const filteredRooms = roomsList.filter(r => r.building === selectedBuilding && r.floor === selectedFloor);

  // Tampilan Setelah Login (Header Global)
  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Campus Service Request</h2>
        </div>
        <div className="user-profile">
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: 15 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: "var(--text)" }}>{user.campus_email}</div>
          </div>
          <span className="role-badge">{user.role}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      {/* Render panel berdasarkan Role */}
      {user.role === "REPORTER" && (
        <main className="workspace-container">
          <h1>Buat Laporan Baru</h1>
          <p style={{ marginBottom: 32 }}>Laporkan masalah fasilitas kampus secara langsung.</p>

          {message && (
            <div className={message.startsWith("Laporan berhasil") ? "alert-success" : "alert-error"}>
              {message}
            </div>
          )}

          <div className="flex-container">
            <div className="flex-main">
              <form onSubmit={submitRequest} style={{ background: "var(--social-bg)", padding: 32, borderRadius: 12, border: "1px solid var(--border)" }}>
                <div className="form-group">
                  <label>Judul Masalah</label>
                  <input 
                    type="text"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="misal: AC Kelas B301 tidak dingin"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi Detail</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan secara spesifik agar teknisi mudah mengidentifikasi (minimal 20 karakter)..."
                    rows={4}
                    className="form-textarea"
                  />
                </div>

                {/* Dropdown Lokasi Bertingkat */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label>Gedung</label>
                    <select
                      value={selectedBuilding}
                      onChange={(e) => handleBuildingChange(e.target.value)}
                      className="form-select"
                    >
                      {buildingsList.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Lantai</label>
                    <select
                      value={selectedFloor}
                      onChange={(e) => handleFloorChange(e.target.value)}
                      className="form-select"
                    >
                      {floorsList.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Ruangan</label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="form-select"
                    >
                      {filteredRooms.map(r => (
                        <option key={r.id} value={r.id}>{r.room_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label>Kategori Masalah</label>
                    <select 
                      value={selectedCategoryId} 
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="form-select"
                    >
                      {categoriesList.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Tingkat Urgensi</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="form-select"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: "auto", paddingInline: 32 }}>Kirim Laporan</button>
              </form>
            </div>

            <div className="flex-side">
              <h2>Laporan Saya</h2>
              {requests.length === 0 ? (
                <p style={{ color: "var(--text)", marginTop: 16 }}>Belum ada laporan yang Anda buat.</p>
              ) : (
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Nomor</th>
                      <th>Judul</th>
                      <th>Lokasi</th>
                      <th>Kategori</th>
                      <th>Urgensi</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((item) => (
                      <tr key={item.id}>
                        <td><code>{item.request_number}</code></td>
                        <td>{item.title}</td>
                        <td style={{ fontSize: 13 }}>{item.location}</td>
                        <td>{item.category}</td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{item.urgency}</span>
                        </td>
                        <td>
                          <span className={`status-indicator ${item.status.toLowerCase() === 'submitted' ? 'submitted' : 'progress'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      )}

      {user.role === "ADMIN" && (
        <main className="workspace-container">
          <h1>Layar Kerja Administrator</h1>
          <p style={{ marginBottom: 32 }}>Kelola antrean review, validasi laporan, dan tugaskan teknisi.</p>

          {adminSuccess && <div className="alert-success">{adminSuccess}</div>}
          {adminError && <div className="alert-error">{adminError}</div>}

          <div className="flex-container">
            <div className="flex-main">
              <h2>Antrean Laporan Masuk</h2>
              {requests.filter(item => ["SUBMITTED", "UNDER_REVIEW", "REJECTED"].includes(item.status)).length === 0 ? (
                <div className="placeholder-view">
                  <p>Tidak ada laporan dalam antrean review saat ini.</p>
                </div>
              ) : (
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Nomor</th>
                      <th>Judul</th>
                      <th>Lokasi</th>
                      <th>Kategori</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.filter(item => ["SUBMITTED", "UNDER_REVIEW", "REJECTED"].includes(item.status)).map((item) => (
                      <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => {
                        setSelectedRequest(item);
                        setRejectionReasonInput("");
                        setAdminError("");
                        setAdminSuccess("");
                      }}>
                        <td><code>{item.request_number}</code></td>
                        <td style={{ fontWeight: 600 }}>{item.title}</td>
                        <td style={{ fontSize: 13 }}>{item.location}</td>
                        <td>{item.category}</td>
                        <td>
                          <span className={`status-indicator ${item.status.toLowerCase() === 'rejected' ? 'progress' : 'submitted'}`} 
                                style={item.status === 'REJECTED' ? { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } : {}}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-logout" style={{ padding: "4px 8px", fontSize: 12 }}>Tinjau</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex-side">
              <h2>Detail Peninjauan</h2>
              {selectedRequest ? (
                <div className="premium-card" style={{ maxWidth: "100%", padding: 24, background: "var(--social-bg)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <code style={{ fontSize: 14 }}>{selectedRequest.request_number}</code>
                    <span className="role-badge" style={{ fontSize: 11 }}>{selectedRequest.urgency}</span>
                  </div>

                  <h3 style={{ margin: "0 0 16px", color: "var(--text-h)", fontSize: 20 }}>{selectedRequest.title}</h3>
                  
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Lokasi</div>
                    <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequest.location}</div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Kategori</div>
                    <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequest.category}</div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Deskripsi</div>
                    <div style={{ color: "var(--text-h)", fontSize: 14, background: "var(--bg)", padding: 12, borderRadius: 6, border: "1px solid var(--border)", whiteSpace: "pre-line" }}>
                      {selectedRequest.description}
                    </div>
                  </div>

                  {selectedRequest.status === "REJECTED" && (
                    <div style={{ marginBottom: 20, padding: 12, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#ef4444" }}>ALASAN PENOLAKAN</div>
                      <div style={{ color: "var(--text-h)", fontSize: 14, marginTop: 4 }}>{selectedRequest.rejection_reason}</div>
                    </div>
                  )}

                  {selectedRequest.status !== "REJECTED" ? (
                    <div>
                      <div className="form-group">
                        <label style={{ fontSize: 12 }}>Alasan Penolakan (Wajib jika menolak)</label>
                        <textarea
                          placeholder="Tulis alasan mengapa laporan ini tidak valid..."
                          value={rejectionReasonInput}
                          onChange={(e) => setRejectionReasonInput(e.target.value)}
                          rows={3}
                          className="form-textarea"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <button 
                          onClick={() => handleReject(selectedRequest.id)}
                          className="btn-logout"
                          style={{ borderColor: "#ef4444", color: "#ef4444", fontWeight: 600 }}
                        >
                          Tolak Laporan
                        </button>
                        <button 
                          className="btn-primary"
                          disabled
                          style={{ opacity: 0.5, cursor: "not-allowed", fontSize: 14 }}
                        >
                          Tugaskan (Issue 4)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedRequest(null)}
                      className="btn-logout"
                      style={{ width: "100%" }}
                    >
                      Tutup Peninjauan
                    </button>
                  )}
                </div>
              ) : (
                <p style={{ color: "var(--text)", marginTop: 16 }}>Pilih salah satu laporan di antrean untuk melakukan peninjauan.</p>
              )}
            </div>
          </div>
        </main>
      )}

      {user.role === "TECHNICIAN" && (
        <main className="workspace-container">
          <h1>Layar Kerja Teknisi</h1>
          <p>Pantau tugas perbaikan Anda, update progress, dan ubah status.</p>

          <div className="placeholder-view">
            <h3 style={{ margin: "0 0 8px", color: "var(--text-h)" }}>Daftar Tugas Saya (Assigned Tasks)</h3>
            <p>Fitur tugas teknisi dan pembaruan progress akan diimplementasikan pada tahap issue berikutnya.</p>
          </div>
        </main>
      )}

      {user.role === "FACILITY_MANAGER" && (
        <main className="workspace-container">
          <h1>Dashboard Manajer Fasilitas</h1>
          <p>Lihat ringkasan statistik fasilitas kampus, unduh laporan, dan berikan catatan.</p>

          <div className="placeholder-view">
            <h3 style={{ margin: "0 0 8px", color: "var(--text-h)" }}>Analitik & Ringkasan Laporan</h3>
            <p>Fitur dashboard manajer dan ekspor CSV akan diimplementasikan pada tahap issue berikutnya.</p>
          </div>
        </main>
      )}
    </div>
  );
}