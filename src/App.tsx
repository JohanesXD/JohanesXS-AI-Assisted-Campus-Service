import { useEffect, useState } from "react";
import "./App.css";

type ServiceRequest = {
  id: string;
  request_number: string;
  title: string;
  location: string;
  category: string;
  priority: string;
  status: string;
};

type UserSession = {
  id: string;
  campus_email: string;
  name: string;
  role: string;
};

export default function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  
  // Login Form States
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState("REPORTER");
  const [loginError, setLoginError] = useState("");

  // Request Form & List States
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Internet");
  const [message, setMessage] = useState("");

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

  // Load requests when user logs in or role is REPORTER/ADMIN
  useEffect(() => {
    if (user && ["REPORTER", "ADMIN"].includes(user.role)) {
      loadRequests();
    }
  }, [user]);

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
  }

  async function submitRequest(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!user) return;

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
          location,
          category,
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
      setLocation("");
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

                <div className="form-group">
                  <label>Lokasi Ruangan</label>
                  <input 
                    type="text"
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="misal: Gedung B Lantai 3 Ruang 301"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Kategori Masalah</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Internet">Internet / Wi-Fi</option>
                    <option value="AC">Pendingin Ruangan (AC)</option>
                    <option value="Peralatan Kelas">Peralatan Kelas (Proyektor/Kursi)</option>
                    <option value="Kebersihan">Kebersihan Ruangan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
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
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((item) => (
                      <tr key={item.id}>
                        <td><code>{item.request_number}</code></td>
                        <td>{item.title}</td>
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
          <p>Kelola antrean review, validasi laporan, dan tugaskan teknisi.</p>

          <div className="placeholder-view">
            <h3 style={{ margin: "0 0 8px", color: "var(--text-h)" }}>Antrean Laporan Masuk (Review)</h3>
            <p>Fitur pengelolaan antrean admin akan diimplementasikan pada tahap issue berikutnya.</p>
            
            {requests.length > 0 && (
              <table className="premium-table" style={{ maxWidth: 600, margin: "24px auto 0" }}>
                <thead>
                  <tr>
                    <th>Nomor</th>
                    <th>Judul</th>
                    <th>Lokasi</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((item) => (
                    <tr key={item.id}>
                      <td><code>{item.request_number}</code></td>
                      <td>{item.title}</td>
                      <td>{item.location}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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