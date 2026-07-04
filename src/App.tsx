import { useEffect, useState } from "react";

import "./App.css";

type ServiceRequest = {
  id: string;
  request_number: string;
  title: string;
  description?: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  urgency: string;
  rejection_reason?: string;
  resolution_rejected_reason?: string;
  resolved_at?: string;
  confirmation_due_at?: string;
  closed_at?: string;
  created_at?: string;
  updated_at?: string;
  category_id?: string;
  room_id?: string;
  technician_name?: string;
  pending_reassignment?: string;
};

type StatusHistoryItem = {
  id: string;
  from_status: string | null;
  to_status: string;
  reason: string | null;
  created_at: string;
  changed_by_name: string;
  changed_by_role: string;
};

type CommentItem = {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_role: string;
};

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  request_id: string | null;
  is_read: number;
  read_at: string | null;
  created_at: string;
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
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<ServiceRequest | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [detailMessage, setDetailMessage] = useState("");
  const [rejectResolutionReason, setRejectResolutionReason] = useState("");
  const [closureMessage, setClosureMessage] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Reporter Edit & Cancel States (FR-031, FR-034)
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editBuilding, setEditBuilding] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editRoomId, setEditRoomId] = useState("");
  const [editUrgency, setEditUrgency] = useState("MEDIUM");
  const [editReason, setEditReason] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");

  // Notification States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Facility Manager states (Issue 13 & 14)
  const [groupedRooms, setGroupedRooms] = useState<Record<string, Record<string, Room[]>>>({});
  const [roomBuildingInput, setRoomBuildingInput] = useState("");
  const [roomFloorInput, setRoomFloorInput] = useState("");
  const [roomNameInput, setRoomNameInput] = useState("");
  const [roomError, setRoomError] = useState("");
  const [roomSuccess, setRoomSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("DASHBOARD");

  const [fmStats, setFmStats] = useState<{ total_solved: number; category_chart: { category_name: string; count: number }[] } | null>(null);
  const [fmSummary, setFmSummary] = useState<any[]>([]);
  const [fmFilterCategory, setFmFilterCategory] = useState("");
  const [fmFilterRoom, setFmFilterRoom] = useState("");
  const [fmFilterStartDate, setFmFilterStartDate] = useState("");
  const [fmFilterEndDate, setFmFilterEndDate] = useState("");
  const [fmSort, setFmSort] = useState("newest");
  const [selectedFmReport, setSelectedFmReport] = useState<any>(null);
  const [fmNoteInput, setFmNoteInput] = useState("");
  const [fmNoteReasonInput, setFmNoteReasonInput] = useState("");
  const [fmError, setFmError] = useState("");
  const [fmSuccess, setFmSuccess] = useState("");

  // Admin Advanced actions states (Issue 12)
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminEditCategoryId, setAdminEditCategoryId] = useState("");
  const [adminEditRoomId, setAdminEditRoomId] = useState("");
  const [adminEditDescription, setAdminEditDescription] = useState("");
  const [adminEditReason, setAdminEditReason] = useState("");
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeTargetRequestId, setMergeTargetRequestId] = useState("");

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignTechnicianId, setReassignTechnicianId] = useState("");
  const [reassignReason, setReassignReason] = useState("");

  const [techniciansList, setTechniciansList] = useState<any[]>([]);
  const [selectedTechId, setSelectedTechId] = useState("");

  async function fetchNotifications() {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const data = await res.json();
      if (data.data) {
        setNotifications(data.data);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  async function handleMarkAsRead(notifId: string) {
    if (!user) return;
    try {
      await fetch(`/api/notifications/${notifId}/read`, {
        method: "POST",
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      setNotifications(prev => prev.map(n =>
        n.id === notifId ? { ...n, is_read: 1, read_at: new Date().toISOString() } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      // ignore
    }
  }

  async function handleMarkAllAsRead() {
    if (!user) return;
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (e) {
      // ignore
    }
  }

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
      if (["REPORTER", "ADMIN", "TECHNICIAN"].includes(user.role)) {
        loadRequests();
      }
      if (["REPORTER", "ADMIN", "FACILITY_MANAGER"].includes(user.role)) {
        loadMetadata();
      }
      if (user.role === "ADMIN") {
        loadTechnicians();
      }
      if (user.role === "FACILITY_MANAGER") {
        loadGroupedRooms();
        loadFmStats();
        loadFmSummary();
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "FACILITY_MANAGER") {
      loadFmSummary();
    }
  }, [fmFilterCategory, fmFilterRoom, fmFilterStartDate, fmFilterEndDate, fmSort]);

  async function loadMetadata() {
    if (!user) return;
    try {
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

      const roomResponse = await fetch("/api/rooms", {
        headers: {
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        }
      });
      const roomResult = await roomResponse.json();
      const rooms = roomResult.data ?? [];
      setRoomsList(rooms);

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

  function handleBuildingChange(building: string) {
    setSelectedBuilding(building);
    const floors = Array.from(new Set(roomsList.filter(r => r.building === building).map(r => r.floor)));
    const defaultFloor = floors[0] ?? "";
    setSelectedFloor(defaultFloor);

    const filteredRooms = roomsList.filter(r => r.building === building && r.floor === defaultFloor);
    setSelectedRoomId(filteredRooms[0]?.id ?? "");
  }

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

      const result = await response.json() as { data?: ServiceRequest[] };
      setRequests(result.data ?? []);
    } catch (e) {
      console.error("Gagal memuat laporan", e);
    }
  }

  async function loadTechnicians() {
    if (!user) return;
    try {
      const res = await fetch("/api/users/technicians", {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const data = await res.json();
      if (data.data) {
        setTechniciansList(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadGroupedRooms() {
    if (!user) return;
    try {
      const res = await fetch("/api/rooms/grouped", {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const data = await res.json();
      if (data.data) {
        setGroupedRooms(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadFmStats() {
    if (!user) return;
    try {
      const res = await fetch("/api/reports/stats", {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const data = await res.json();
      if (data.success) {
        setFmStats({
          total_solved: data.total_solved,
          category_chart: data.category_chart
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadFmSummary() {
    if (!user) return;
    try {
      let urlStr = "/api/reports/summary?";
      if (fmFilterCategory) urlStr += `category_id=${fmFilterCategory}&`;
      if (fmFilterRoom) urlStr += `room_id=${fmFilterRoom}&`;
      if (fmFilterStartDate) urlStr += `start_date=${fmFilterStartDate}&`;
      if (fmFilterEndDate) urlStr += `end_date=${fmFilterEndDate}&`;
      urlStr += `sort=${fmSort}`;

      const res = await fetch(urlStr, {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const data = await res.json();
      if (data.success) {
        setFmSummary(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAddFmFollowUp(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !selectedFmReport) return;

    setFmError("");
    setFmSuccess("");

    if (!fmNoteInput.trim()) {
      setFmError("Catatan tindak lanjut wajib diisi.");
      return;
    }

    if (!fmNoteReasonInput.trim() || fmNoteReasonInput.trim().length < 5) {
      setFmError("Alasan wajib diisi (minimal 5 karakter).");
      return;
    }

    try {
      const res = await fetch(`/api/reports/${selectedFmReport.id}/follow-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          note: fmNoteInput,
          reason: fmNoteReasonInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setFmSuccess("Catatan tindak lanjut berhasil disimpan.");
        setFmNoteInput("");
        setFmNoteReasonInput("");
        setSelectedFmReport(null);
        loadFmSummary();
      } else {
        setFmError(data.error || "Gagal menyimpan catatan.");
      }
    } catch (e) {
      setFmError("Koneksi terputus.");
    }
  }

  async function handleAddRoom(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;

    setRoomError("");
    setRoomSuccess("");

    if (!roomBuildingInput.trim()) {
      setRoomError("Nama gedung wajib diisi.");
      return;
    }
    if (!roomFloorInput.trim()) {
      setRoomError("Nama lantai wajib diisi.");
      return;
    }
    if (!roomNameInput.trim()) {
      setRoomError("Nama ruangan wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          building: roomBuildingInput,
          floor: roomFloorInput,
          room_name: roomNameInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setRoomSuccess("Ruangan baru berhasil ditambahkan.");
        setRoomBuildingInput("");
        setRoomFloorInput("");
        setRoomNameInput("");
        loadGroupedRooms();
        loadMetadata();
      } else {
        setRoomError(data.error || "Gagal menambahkan ruangan.");
      }
    } catch (e) {
      setRoomError("Koneksi terputus.");
    }
  }

  async function handleDeactivateRoom(roomId: string) {
    if (!user || !window.confirm("Apakah Anda yakin ingin menonaktifkan ruangan ini?")) return;
    setRoomError("");
    setRoomSuccess("");

    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        }
      });
      const data = await res.json();
      if (data.success) {
        setRoomSuccess("Ruangan berhasil dinonaktifkan.");
        loadGroupedRooms();
        loadMetadata();
      } else {
        setRoomError(data.error || "Gagal menonaktifkan ruangan.");
      }
    } catch (e) {
      setRoomError("Koneksi terputus.");
    }
  }

  async function handleAdminEditSubmit(requestId: string) {
    if (!user) return;
    setAdminError("");
    setAdminSuccess("");

    if (!adminEditReason.trim() || adminEditReason.trim().length < 5) {
      setAdminError("Alasan perubahan wajib diisi (minimal 5 karakter).");
      return;
    }

    try {
      const res = await fetch(`/api/admin/requests/${requestId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          category_id: adminEditCategoryId,
          room_id: adminEditRoomId,
          description: adminEditDescription,
          reason: adminEditReason
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminSuccess("Laporan berhasil diperbarui oleh administrator.");
        setIsAdminEditing(false);
        setAdminEditReason("");
        loadRequests();
        setSelectedRequest(null);
      } else {
        setAdminError(data.error || "Gagal memperbarui laporan.");
      }
    } catch (e) {
      setAdminError("Koneksi terputus.");
    }
  }

  async function handleAdminMergeSubmit(requestId: string) {
    if (!user) return;
    setAdminError("");
    setAdminSuccess("");

    if (!mergeTargetRequestId) {
      setAdminError("Laporan utama wajib dipilih.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/requests/${requestId}/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          main_request_id: mergeTargetRequestId
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminSuccess("Laporan duplikat berhasil digabungkan.");
        setShowMergeModal(false);
        setMergeTargetRequestId("");
        setSelectedRequest(null);
        loadRequests();
      } else {
        setAdminError(data.error || "Gagal menggabungkan laporan.");
      }
    } catch (e) {
      setAdminError("Koneksi terputus.");
    }
  }

  async function handleAdminReassignSubmit(requestId: string) {
    if (!user) return;
    setAdminError("");
    setAdminSuccess("");

    if (!reassignTechnicianId) {
      setAdminError("Teknisi baru wajib dipilih.");
      return;
    }

    if (!reassignReason.trim() || reassignReason.trim().length < 5) {
      setAdminError("Alasan penggantian wajib diisi (minimal 5 karakter).");
      return;
    }

    try {
      const res = await fetch(`/api/admin/requests/${requestId}/reassign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          new_technician_id: reassignTechnicianId,
          reason: reassignReason
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminSuccess("Pengajuan penggantian teknisi berhasil dikirim.");
        setShowReassignModal(false);
        setReassignTechnicianId("");
        setReassignReason("");
        setSelectedRequest(null);
        loadRequests();
      } else {
        setAdminError(data.error || "Gagal mengajukan penggantian.");
      }
    } catch (e) {
      setAdminError("Koneksi terputus.");
    }
  }

  async function handleAdminAssignSubmit(requestId: string, techId: string) {
    if (!user) return;
    setAdminError("");
    setAdminSuccess("");

    if (!techId) {
      setAdminError("Teknisi wajib dipilih.");
      return;
    }

    try {
      const res = await fetch(`/api/requests/${requestId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          technician_id: techId
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminSuccess("Teknisi berhasil ditugaskan.");
        setSelectedRequest(null);
        loadRequests();
      } else {
        setAdminError(data.error || "Gagal menugaskan teknisi.");
      }
    } catch (e) {
      setAdminError("Koneksi terputus.");
    }
  }

  async function handleTechReassignDecision(requestId: string, approve: boolean) {
    if (!user) return;
    try {
      const res = await fetch(`/api/requests/${requestId}/reassign/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({
          approve: approve
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        loadRequests();
        setSelectedRequestDetail(null);
      } else {
        alert(data.error || "Gagal memproses keputusan.");
      }
    } catch (e) {
      alert("Koneksi terputus.");
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
    setStatusHistory([]);
    setComments([]);
    setNewComment("");
    setDetailMessage("");
    setMessage("");
    resetEditState();
    resetCancelState();
  }

  function resetEditState() {
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
    setEditCategoryId("");
    setEditBuilding("");
    setEditFloor("");
    setEditRoomId("");
    setEditUrgency("MEDIUM");
    setEditReason("");
    setEditError("");
    setEditSuccess("");
  }

  function resetCancelState() {
    setShowCancelModal(false);
    setCancelReason("");
    setCancelError("");
    setCancelSuccess("");
  }

  async function loadRequestDetail(requestId: string) {
    if (!user) return;
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      if (!response.ok) return;
      const result = await response.json();
      setSelectedRequestDetail(result.data ?? null);
    } catch (e) {
      console.error("Gagal memuat detail laporan", e);
    }
  }

  async function loadStatusHistory(requestId: string) {
    if (!user) return;
    try {
      const response = await fetch(`/api/requests/${requestId}/status-history`, {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      if (!response.ok) return;
      const result = await response.json();
      setStatusHistory(result.data ?? []);
    } catch (e) {
      console.error("Gagal memuat riwayat status", e);
    }
  }

  async function loadComments(requestId: string) {
    if (!user) return;
    try {
      const response = await fetch(`/api/requests/${requestId}/comments`, {
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      if (!response.ok) return;
      const result = await response.json();
      setComments(result.data ?? []);
    } catch (e) {
      console.error("Gagal memuat komentar", e);
    }
  }

  async function handleSelectRequest(item: ServiceRequest) {
    setDetailMessage("");
    setSelectedRequestDetail(null);
    setStatusHistory([]);
    setComments([]);
    setNewComment("");
    resetEditState();
    resetCancelState();
    await Promise.all([
      loadRequestDetail(item.id),
      loadStatusHistory(item.id),
      loadComments(item.id),
    ]);
  }

  async function handleAddComment(requestId: string) {
    if (!user) return;
    if (!newComment.trim() || newComment.trim().length < 5) {
      setDetailMessage("Komentar wajib diisi (minimal 5 karakter).");
      return;
    }
    try {
      const response = await fetch(`/api/requests/${requestId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({ content: newComment })
      });
      const result = await response.json();
      if (!response.ok) {
        setDetailMessage(result.error ?? "Gagal menambahkan komentar.");
        return;
      }
      setNewComment("");
      setDetailMessage("Komentar berhasil ditambahkan.");
      await loadComments(requestId);
    } catch (e) {
      setDetailMessage("Koneksi terputus. Gagal mengirim komentar.");
    }
  }

  // FR-031: Reporter Edit Request
  function handleStartEdit() {
    if (!selectedRequestDetail) return;
    setEditTitle(selectedRequestDetail.title);
    setEditDescription(selectedRequestDetail.description ?? "");
    setEditUrgency(selectedRequestDetail.urgency);
    setEditReason("");
    setEditError("");
    setEditSuccess("");

    // Parse location: "Building - Floor - Room"
    const locParts = selectedRequestDetail.location.split(" - ");
    const building = locParts[0] ?? "";
    const floor = locParts[1] ?? "";
    setEditBuilding(building);
    setEditFloor(floor);

    // Find matching room
    const matchingRoom = roomsList.find(r => r.building === building && r.floor === floor);
    if (matchingRoom) {
      setEditRoomId(matchingRoom.id);
    }

    // Find matching category
    const matchingCat = categoriesList.find(c => c.name === selectedRequestDetail.category);
    if (matchingCat) {
      setEditCategoryId(matchingCat.id);
    }

    setIsEditing(true);
  }

  async function handleEditSubmit(requestId: string) {
    if (!user) return;
    setEditError("");
    setEditSuccess("");

    if (!editReason.trim() || editReason.trim().length < 5) {
      setEditError("Alasan perubahan wajib diisi (minimal 5 karakter).");
      return;
    }

    if (!editTitle.trim()) {
      setEditError("Judul tidak boleh kosong.");
      return;
    }

    if (editDescription.trim().length < 20) {
      setEditError("Deskripsi minimal 20 karakter.");
      return;
    }

    if (!editCategoryId || !editRoomId) {
      setEditError("Kategori dan ruangan wajib dipilih.");
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category_id: editCategoryId,
        room_id: editRoomId,
        urgency: editUrgency,
        reason: editReason.trim(),
      };

      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        setEditError(result.error ?? "Gagal mengubah laporan.");
        return;
      }

      setEditSuccess("Laporan berhasil diubah dan dikembalikan ke pemeriksaan admin.");
      setIsEditing(false);
      await Promise.all([
        loadRequestDetail(requestId),
        loadStatusHistory(requestId),
        loadRequests()
      ]);
    } catch (e) {
      setEditError("Koneksi terputus. Gagal mengubah laporan.");
    }
  }

  // FR-034: Reporter Cancel Request
  async function handleCancelSubmit(requestId: string) {
    if (!user) return;
    setCancelError("");
    setCancelSuccess("");

    if (!cancelReason.trim() || cancelReason.trim().length < 5) {
      setCancelError("Alasan pembatalan wajib diisi (minimal 5 karakter).");
      return;
    }

    try {
      const response = await fetch(`/api/requests/${requestId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({ reason: cancelReason.trim() })
      });

      const result = await response.json();

      if (!response.ok) {
        setCancelError(result.error ?? "Gagal membatalkan laporan.");
        return;
      }

      setCancelSuccess("Laporan berhasil dibatalkan.");
      setShowCancelModal(false);
      setCancelReason("");
      await Promise.all([
        loadRequestDetail(requestId),
        loadStatusHistory(requestId),
        loadRequests()
      ]);
    } catch (e) {
      setCancelError("Koneksi terputus. Gagal membatalkan laporan.");
    }
  }

  async function handleConfirmResolution(requestId: string) {
    if (!user) return;
    setConfirmLoading(true);
    setClosureMessage("");
    try {
      const response = await fetch(`/api/requests/${requestId}/confirm-resolution`, {
        method: "POST",
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const result = await response.json();
      if (!response.ok) {
        setClosureMessage(result.error ?? "Gagal mengonfirmasi.");
        setConfirmLoading(false);
        return;
      }
      setClosureMessage("Laporan berhasil dikonfirmasi.");
      setConfirmLoading(false);
      await Promise.all([
        loadRequestDetail(requestId),
        loadRequests()
      ]);
    } catch (e) {
      setClosureMessage("Koneksi terputus.");
      setConfirmLoading(false);
    }
  }

  async function handleRejectResolution(requestId: string) {
    if (!user) return;
    if (!rejectResolutionReason.trim() || rejectResolutionReason.trim().length < 5) {
      setClosureMessage("Alasan penolakan wajib diisi (minimal 5 karakter).");
      return;
    }
    setConfirmLoading(true);
    setClosureMessage("");
    try {
      const response = await fetch(`/api/requests/${requestId}/reject-resolution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.campus_email,
          "X-User-Role": user.role
        },
        body: JSON.stringify({ reason: rejectResolutionReason })
      });
      const result = await response.json();
      if (!response.ok) {
        setClosureMessage(result.error ?? "Gagal menolak hasil.");
        setConfirmLoading(false);
        return;
      }
      setRejectResolutionReason("");
      setClosureMessage("Penolakan hasil berhasil dikirim.");
      setConfirmLoading(false);
      await Promise.all([
        loadRequestDetail(requestId),
        loadRequests()
      ]);
    } catch (e) {
      setClosureMessage("Koneksi terputus.");
      setConfirmLoading(false);
    }
  }

  async function handleAdminClose(requestId: string) {
    if (!user) return;
    setAdminError("");
    setAdminSuccess("");
    try {
      const response = await fetch(`/api/requests/${requestId}/close`, {
        method: "POST",
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const result = await response.json();
      if (!response.ok) {
        setAdminError(result.error ?? "Gagal menutup laporan.");
        return;
      }
      setAdminSuccess("Laporan berhasil ditutup.");
      setSelectedRequest(null);
      await loadRequests();
    } catch (e) {
      setAdminError("Koneksi terputus.");
    }
  }

  async function handleAdminReopen(requestId: string) {
    if (!user) return;
    setAdminError("");
    setAdminSuccess("");
    try {
      const response = await fetch(`/api/requests/${requestId}/reopen`, {
        method: "POST",
        headers: { "X-User-Email": user.campus_email, "X-User-Role": user.role }
      });
      const result = await response.json();
      if (!response.ok) {
        setAdminError(result.error ?? "Gagal membuka ulang laporan.");
        return;
      }
      setAdminSuccess("Laporan berhasil dibuka ulang.");
      setSelectedRequest(null);
      await loadRequests();
    } catch (e) {
      setAdminError("Koneksi terputus.");
    }
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

      const result = await response.json() as { error?: string; requestNumber?: string };

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

  // Edit dropdown helpers
  const editBuildingsList = Array.from(new Set(roomsList.map(r => r.building)));
  const editFloorsList = Array.from(new Set(roomsList.filter(r => r.building === editBuilding).map(r => r.floor)));
  const editFilteredRooms = roomsList.filter(r => r.building === editBuilding && r.floor === editFloor);

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
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="notif-bell">
              &#128276;
              {unreadCount > 0 && <span className="notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span>Notifikasi</span>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead} className="notif-mark-all">
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="notif-empty">Belum ada notifikasi.</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`notif-item${n.is_read ? "" : " unread"}`}
                      onClick={() => {
                        if (!n.is_read) handleMarkAsRead(n.id);
                        if (n.request_id) {
                          setShowNotifications(false);
                          const found = requests.find(r => r.id === n.request_id);
                          if (found) {
                            handleSelectRequest(found);
                          } else {
                            setDetailMessage("");
                            setSelectedRequestDetail(null);
                            setStatusHistory([]);
                            setComments([]);
                            loadRequestDetail(n.request_id);
                            loadStatusHistory(n.request_id);
                            loadComments(n.request_id);
                          }
                        }
                      }}
                    >
                      <div className="notif-icon">
                        {n.type === "STATUS_CHANGE" ? "&#128204;" :
                         n.type === "RESOLVED" ? "&#9989;" :
                         n.type === "WAITING_PARTS" ? "&#128295;" :
                         n.type === "NEED_HELP" ? "&#128170;" :
                         n.type === "PAUSED" ? "&#9200;" :
                         n.type === "REOPENED" ? "&#128257;" : "&#128276;"}
                      </div>
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-message">{n.message}</div>
                        <div className="notif-time">{new Date(n.created_at).toLocaleString("id-ID")}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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
                      <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => handleSelectRequest(item)}>
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

              {/* Detail Laporan Pelapor */}
              {selectedRequestDetail && (
                <div style={{ marginTop: 32 }}>
                  <h2>Detail Laporan</h2>
                  <div className="premium-card" style={{ maxWidth: "100%", padding: 24, background: "var(--social-bg)" }}>

                    {/* Header Detail */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <code style={{ fontSize: 14 }}>{selectedRequestDetail.request_number}</code>
                        <div style={{ fontSize: 13, color: "var(--text)", marginTop: 4 }}>
                          Dibuat: {selectedRequestDetail.created_at}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span className="role-badge" style={{ fontSize: 11 }}>{selectedRequestDetail.urgency}</span>
                        <span className={`status-indicator ${selectedRequestDetail.status.toLowerCase() === 'submitted' ? 'submitted' : 'progress'}`}>
                          {selectedRequestDetail.status}
                        </span>
                      </div>
                    </div>

                    {/* Edit Mode */}
                    {isEditing ? (
                      <div style={{ marginBottom: 20 }}>
                        <h3 style={{ margin: "0 0 16px", color: "var(--text-h)", fontSize: 18 }}>Edit Laporan</h3>

                        {editError && <div className="alert-error" style={{ marginBottom: 12 }}>{editError}</div>}
                        {editSuccess && <div className="alert-success" style={{ marginBottom: 12 }}>{editSuccess}</div>}

                        <div className="form-group">
                          <label>Judul</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Deskripsi (minimal 20 karakter)</label>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={4}
                            className="form-textarea"
                          />
                        </div>

                        <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                          <div>
                            <label>Gedung</label>
                            <select
                              value={editBuilding}
                              onChange={(e) => {
                                setEditBuilding(e.target.value);
                                const floors = Array.from(new Set(roomsList.filter(r => r.building === e.target.value).map(r => r.floor)));
                                setEditFloor(floors[0] ?? "");
                                const rooms = roomsList.filter(r => r.building === e.target.value && r.floor === (floors[0] ?? ""));
                                setEditRoomId(rooms[0]?.id ?? "");
                              }}
                              className="form-select"
                            >
                              {editBuildingsList.map(b => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label>Lantai</label>
                            <select
                              value={editFloor}
                              onChange={(e) => {
                                setEditFloor(e.target.value);
                                const rooms = roomsList.filter(r => r.building === editBuilding && r.floor === e.target.value);
                                setEditRoomId(rooms[0]?.id ?? "");
                              }}
                              className="form-select"
                            >
                              {editFloorsList.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label>Ruangan</label>
                            <select
                              value={editRoomId}
                              onChange={(e) => setEditRoomId(e.target.value)}
                              className="form-select"
                            >
                              {editFilteredRooms.map(r => (
                                <option key={r.id} value={r.id}>{r.room_name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <label>Kategori</label>
                            <select
                              value={editCategoryId}
                              onChange={(e) => setEditCategoryId(e.target.value)}
                              className="form-select"
                            >
                              {categoriesList.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label>Urgensi</label>
                            <select
                              value={editUrgency}
                              onChange={(e) => setEditUrgency(e.target.value)}
                              className="form-select"
                            >
                              <option value="LOW">Low</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HIGH">High</option>
                              <option value="URGENT">Urgent</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Alasan Perubahan (wajib, minimal 5 karakter)</label>
                          <textarea
                            value={editReason}
                            onChange={(e) => setEditReason(e.target.value)}
                            placeholder="Jelaskan mengapa Anda mengubah laporan ini..."
                            rows={3}
                            className="form-textarea"
                          />
                        </div>

                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <button
                            onClick={() => handleEditSubmit(selectedRequestDetail.id)}
                            className="btn-primary"
                            style={{ width: "auto", paddingInline: 24 }}
                          >
                            Simpan Perubahan
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="btn-logout"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* View Mode - Detail Info */}
                        <h3 style={{ margin: "0 0 16px", color: "var(--text-h)", fontSize: 20 }}>{selectedRequestDetail.title}</h3>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Lokasi</div>
                          <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequestDetail.location}</div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Kategori</div>
                          <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequestDetail.category}</div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Deskripsi</div>
                          <div style={{ color: "var(--text-h)", fontSize: 14, background: "var(--bg)", padding: 12, borderRadius: 6, border: "1px solid var(--border)", whiteSpace: "pre-line" }}>
                            {selectedRequestDetail.description}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Status Timeline */}
                    <div style={{ marginBottom: 24 }}>
                      <h4 style={{ margin: "0 0 12px", color: "var(--text-h)", fontSize: 16 }}>Riwayat Status</h4>
                      {statusHistory.length === 0 ? (
                        <p style={{ color: "var(--text)", fontSize: 14 }}>Belum ada riwayat status.</p>
                      ) : (
                        <div style={{ position: "relative", paddingLeft: 24 }}>
                          <div style={{ position: "absolute", left: 8, top: 4, bottom: 4, width: 2, background: "var(--border)" }} />
                          {statusHistory.map((sh) => (
                            <div key={sh.id} style={{ position: "relative", marginBottom: 16, paddingLeft: 16 }}>
                              <div style={{ position: "absolute", left: -20, top: 4, width: 12, height: 12, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)" }} />
                              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-h)" }}>
                                {sh.from_status ? `${sh.from_status} → ${sh.to_status}` : sh.to_status}
                              </div>
                              <div style={{ fontSize: 12, color: "var(--text)", marginTop: 2 }}>
                                {sh.changed_by_name} ({sh.changed_by_role})
                              </div>
                              <div style={{ fontSize: 11, color: "var(--text)", marginTop: 1 }}>{sh.created_at}</div>
                              {sh.reason && (
                                <div style={{ fontSize: 13, color: "var(--text-h)", marginTop: 4, padding: 8, background: "var(--bg)", borderRadius: 4, border: "1px solid var(--border)" }}>
                                  {sh.reason}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comments Thread */}
                    <div style={{ marginBottom: 24 }}>
                      <h4 style={{ margin: "0 0 12px", color: "var(--text-h)", fontSize: 16 }}>Komentar</h4>

                      {detailMessage && (
                        <div className={detailMessage.startsWith("Komentar berhasil") ? "alert-success" : "alert-error"} style={{ marginBottom: 12 }}>
                          {detailMessage}
                        </div>
                      )}

                      {comments.length === 0 ? (
                        <p style={{ color: "var(--text)", fontSize: 14, marginBottom: 16 }}>Belum ada komentar.</p>
                      ) : (
                        <div style={{ marginBottom: 16 }}>
                          {comments.map((c) => (
                            <div key={c.id} style={{ marginBottom: 12, padding: 12, background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>
                              <div style={{ fontSize: 14, color: "var(--text-h)", whiteSpace: "pre-line" }}>{c.content}</div>
                              <div style={{ fontSize: 11, color: "var(--text)", marginTop: 6 }}>
                                {c.author_name} ({c.author_role}) — {c.created_at}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Tulis komentar..."
                          className="form-input"
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => handleAddComment(selectedRequestDetail.id)}
                          className="btn-primary"
                          style={{ width: "auto", paddingInline: 20, whiteSpace: "nowrap" }}
                        >
                          Kirim
                        </button>
                      </div>
                    </div>

                    {/* Cancel Modal */}
                    {showCancelModal && (
                      <div style={{ marginBottom: 24, padding: 20, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8 }}>
                        <h4 style={{ margin: "0 0 12px", color: "#ef4444", fontSize: 16 }}>Batalkan Laporan</h4>
                        {cancelError && <div className="alert-error" style={{ marginBottom: 12 }}>{cancelError}</div>}
                        {cancelSuccess && <div className="alert-success" style={{ marginBottom: 12 }}>{cancelSuccess}</div>}
                        <p style={{ fontSize: 14, color: "var(--text-h)", marginBottom: 12 }}>
                          Apakah Anda yakin ingin membatalkan laporan ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="form-group">
                          <label>Alasan Pembatalan (wajib, minimal 5 karakter)</label>
                          <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Jelaskan alasan pembatalan..."
                            rows={3}
                            className="form-textarea"
                          />
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <button
                            onClick={() => handleCancelSubmit(selectedRequestDetail.id)}
                            className="btn-logout"
                            style={{ borderColor: "#ef4444", color: "#ef4444", fontWeight: 600 }}
                          >
                            Ya, Batalkan Laporan
                          </button>
                          <button
                            onClick={() => setShowCancelModal(false)}
                            className="btn-primary"
                            style={{ width: "auto", paddingInline: 20 }}
                          >
                            Tidak, Kembali
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Konfirmasi Hasil Pekerjaan */}
                    {selectedRequestDetail.status === "WAITING_REPORTER_CONFIRMATION" && (
                      <div style={{ marginBottom: 24 }}>
                        <h4 style={{ margin: "0 0 12px", color: "var(--text-h)", fontSize: 16 }}>Konfirmasi Hasil Pekerjaan</h4>
                        {closureMessage && (
                          <div className={closureMessage.startsWith("Laporan berhasil") || closureMessage.startsWith("Penolakan") ? "alert-success" : "alert-error"} style={{ marginBottom: 12 }}>
                            {closureMessage}
                          </div>
                        )}
                        <div style={{ marginBottom: 12, fontSize: 13, color: "var(--text)" }}>
                          Batas konfirmasi: {selectedRequestDetail.confirmation_due_at ?? "Tidak tersedia"}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            onClick={() => handleConfirmResolution(selectedRequestDetail.id)}
                            className="btn-primary"
                            disabled={confirmLoading}
                            style={{ width: "auto", paddingInline: 20 }}
                          >
                            {confirmLoading ? "Memproses..." : "Konfirmasi Selesai"}
                          </button>
                          <textarea
                            value={rejectResolutionReason}
                            onChange={(e) => setRejectResolutionReason(e.target.value)}
                            placeholder="Alasan penolakan (minimal 5 karakter)..."
                            rows={2}
                            className="form-textarea"
                            style={{ width: "100%", fontSize: 14, marginTop: 8 }}
                          />
                          <button
                            onClick={() => handleRejectResolution(selectedRequestDetail.id)}
                            className="btn-logout"
                            disabled={confirmLoading}
                            style={{ borderColor: "#ef4444", color: "#ef4444", fontWeight: 600, width: "auto", paddingInline: 20 }}
                          >
                            {confirmLoading ? "Memproses..." : "Tolak Hasil"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reporter Actions: Edit & Cancel - only for initial statuses */}
                    {!isEditing && !showCancelModal && ["SUBMITTED", "UNDER_REVIEW", "REJECTED"].includes(selectedRequestDetail.status) && (
                      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                        <button
                          onClick={handleStartEdit}
                          className="btn-primary"
                          style={{ width: "auto", paddingInline: 20, fontSize: 14 }}
                        >
                          ✎ Edit Laporan
                        </button>
                        <button
                          onClick={() => {
                            setShowCancelModal(true);
                            setCancelError("");
                            setCancelSuccess("");
                            setCancelReason("");
                          }}
                          className="btn-logout"
                          style={{ borderColor: "#ef4444", color: "#ef4444", fontWeight: 600, fontSize: 14 }}
                        >
                          ✕ Batalkan Laporan
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => { setSelectedRequestDetail(null); setStatusHistory([]); setComments([]); setNewComment(""); setDetailMessage(""); setRejectResolutionReason(""); setClosureMessage(""); resetEditState(); resetCancelState(); }}
                      className="btn-logout"
                      style={{ width: "100%" }}
                    >
                      Tutup Detail
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {user.role === "ADMIN" && (
        <main className="workspace-container">
          <h1>Layar Kerja Administrator</h1>
          <p style={{ marginBottom: 20 }}>Kelola antrean review, validasi laporan, dan tugaskan teknisi.</p>

          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => { setActiveTab("REVIEW"); setSelectedRequest(null); }}
              className={`btn-primary`}
              style={{ width: "auto", paddingInline: 20, background: activeTab === "REVIEW" ? "var(--text-h)" : "var(--social-bg)", color: activeTab === "REVIEW" ? "#fff" : "var(--text)" }}
            >
              Antrean Review
            </button>
            <button
              onClick={() => { setActiveTab("ALL"); setSelectedRequest(null); }}
              className={`btn-primary`}
              style={{ width: "auto", paddingInline: 20, background: activeTab === "ALL" ? "var(--text-h)" : "var(--social-bg)", color: activeTab === "ALL" ? "#fff" : "var(--text)" }}
            >
              Semua Laporan
            </button>
          </div>

          {adminSuccess && <div className="alert-success">{adminSuccess}</div>}
          {adminError && <div className="alert-error">{adminError}</div>}

          <div className="flex-container">
            <div className="flex-main">
              <h2>{activeTab === "ALL" ? "Daftar Semua Laporan" : "Antrean Laporan Masuk"}</h2>
              {(activeTab === "ALL" 
                ? requests 
                : requests.filter(item => ["SUBMITTED", "UNDER_REVIEW", "REOPEN_REQUESTED", "REJECTED"].includes(item.status))
              ).length === 0 ? (
                <div className="placeholder-view">
                  <p>Tidak ada laporan dalam antrean saat ini.</p>
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
                    {(activeTab === "ALL" 
                      ? requests 
                      : requests.filter(item => ["SUBMITTED", "UNDER_REVIEW", "REOPEN_REQUESTED", "REJECTED"].includes(item.status))
                    ).map((item) => (
                      <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => {
                        setSelectedRequest(item);
                        setRejectionReasonInput("");
                        setAdminError("");
                        setAdminSuccess("");
                        setIsAdminEditing(false);
                        setShowMergeModal(false);
                        setShowReassignModal(false);
                        // Populate admin edit values
                        setAdminEditCategoryId(item.category_id || "");
                        setAdminEditRoomId(item.room_id || "");
                        setAdminEditDescription(item.description || "");
                        setAdminEditReason("");
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

                  {/* ADMIN EDIT MODE */}
                  {isAdminEditing ? (
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ margin: "0 0 16px", color: "var(--text-h)", fontSize: 18 }}>Edit Detail Laporan</h3>
                      <div className="form-group">
                        <label>Kategori</label>
                        <select
                          value={adminEditCategoryId}
                          onChange={(e) => setAdminEditCategoryId(e.target.value)}
                          className="form-select"
                        >
                          {categoriesList.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Ruangan</label>
                        <select
                          value={adminEditRoomId}
                          onChange={(e) => setAdminEditRoomId(e.target.value)}
                          className="form-select"
                        >
                          {roomsList.map(r => (
                            <option key={r.id} value={r.id}>{r.building} - {r.floor} - {r.room_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Deskripsi (min 20 karakter)</label>
                        <textarea
                          value={adminEditDescription}
                          onChange={(e) => setAdminEditDescription(e.target.value)}
                          rows={4}
                          className="form-textarea"
                        />
                      </div>
                      <div className="form-group">
                        <label>Alasan Perubahan (wajib, min 5 karakter)</label>
                        <input
                          type="text"
                          value={adminEditReason}
                          onChange={(e) => setAdminEditReason(e.target.value)}
                          placeholder="Masukkan alasan Anda..."
                          className="form-input"
                        />
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          onClick={() => handleAdminEditSubmit(selectedRequest.id)}
                          className="btn-primary"
                          style={{ width: "auto", paddingInline: 20 }}
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setIsAdminEditing(false)}
                          className="btn-logout"
                          style={{ width: "auto", paddingInline: 20 }}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : showMergeModal ? (
                    // ADMIN MERGE MODE
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ margin: "0 0 16px", color: "var(--text-h)", fontSize: 18 }}>Gabungkan Laporan Duplikat</h3>
                      <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 12 }}>
                        Laporan ini akan ditandai sebagai duplikat dan digabungkan ke laporan utama yang Anda pilih di bawah.
                      </p>
                      <div className="form-group">
                        <label>Pilih Laporan Utama</label>
                        <select
                          value={mergeTargetRequestId}
                          onChange={(e) => setMergeTargetRequestId(e.target.value)}
                          className="form-select"
                        >
                          <option value="">-- Pilih Laporan Utama --</option>
                          {requests
                            .filter(r => r.id !== selectedRequest.id && !['CLOSED_AUTO', 'CLOSED_ADMIN', 'CLOSED_REPORTER_CONFIRMED', 'CANCELLED', 'MERGED'].includes(r.status))
                            .map(r => (
                              <option key={r.id} value={r.id}>{r.request_number} - {r.title}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          onClick={() => handleAdminMergeSubmit(selectedRequest.id)}
                          className="btn-primary"
                          style={{ width: "auto", paddingInline: 20 }}
                        >
                          Gabungkan
                        </button>
                        <button
                          onClick={() => setShowMergeModal(false)}
                          className="btn-logout"
                          style={{ width: "auto", paddingInline: 20 }}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : showReassignModal ? (
                    // ADMIN REASSIGN MODE
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ margin: "0 0 16px", color: "var(--text-h)", fontSize: 18 }}>Ganti Teknisi Utama</h3>
                      <div className="form-group">
                        <label>Pilih Teknisi Baru</label>
                        <select
                          value={reassignTechnicianId}
                          onChange={(e) => setReassignTechnicianId(e.target.value)}
                          className="form-select"
                        >
                          <option value="">-- Pilih Teknisi --</option>
                          {techniciansList.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.campus_email})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Alasan Penggantian (wajib, min 5 karakter)</label>
                        <textarea
                          value={reassignReason}
                          onChange={(e) => setReassignReason(e.target.value)}
                          placeholder="Masukkan alasan penggantian..."
                          rows={3}
                          className="form-textarea"
                        />
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          onClick={() => handleAdminReassignSubmit(selectedRequest.id)}
                          className="btn-primary"
                          style={{ width: "auto", paddingInline: 20 }}
                        >
                          Kirim Pengajuan
                        </button>
                        <button
                          onClick={() => setShowReassignModal(false)}
                          className="btn-logout"
                          style={{ width: "auto", paddingInline: 20 }}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    // NORMAL DETAIL VIEW
                    <div>
                      <h3 style={{ margin: "0 0 16px", color: "var(--text-h)", fontSize: 20 }}>{selectedRequest.title}</h3>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Lokasi</div>
                        <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequest.location}</div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Kategori</div>
                        <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequest.category}</div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>Teknisi Aktif</div>
                        <div style={{ color: "var(--text-h)", fontSize: 15, fontWeight: 600 }}>
                          {selectedRequest.technician_name || "Belum Ditugaskan"}
                        </div>
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

                      {/* ACTIONS BASED ON STATUS */}
                      {["SUBMITTED", "UNDER_REVIEW"].includes(selectedRequest.status) && (
                        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                          <button
                            onClick={() => setIsAdminEditing(true)}
                            className="btn-primary"
                            style={{ background: "#3b82f6", width: "auto", paddingInline: 16 }}
                          >
                            ✎ Edit Detail
                          </button>
                          <button
                            onClick={() => setShowMergeModal(true)}
                            className="btn-primary"
                            style={{ background: "#8b5cf6", width: "auto", paddingInline: 16 }}
                          >
                            ⎘ Merge Duplikat
                          </button>
                        </div>
                      )}

                      {["ASSIGNED", "IN_PROGRESS", "NEED_HELP", "WAITING_PARTS", "PAUSED"].includes(selectedRequest.status) && (
                        <div style={{ marginBottom: 20 }}>
                          <button
                            onClick={() => setShowReassignModal(true)}
                            className="btn-primary"
                            style={{ background: "#f59e0b", width: "auto", paddingInline: 16 }}
                          >
                            ⇄ Ganti Teknisi
                          </button>
                        </div>
                      )}

                      {/* REJECT AND PRIMARY ASSIGN SECTION */}
                      {["SUBMITTED", "UNDER_REVIEW", "REOPEN_REQUESTED", "REJECTED"].includes(selectedRequest.status) ? (
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

                          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 16 }}>
                            <button 
                              onClick={() => handleReject(selectedRequest.id)}
                              className="btn-logout"
                              style={{ borderColor: "#ef4444", color: "#ef4444", fontWeight: 600 }}
                            >
                              Tolak Laporan
                            </button>
                          </div>

                          <div className="form-group" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                            <label style={{ fontSize: 12, fontWeight: 600 }}>Tugaskan Teknisi Utama</label>
                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                              <select
                                value={selectedTechId}
                                onChange={(e) => setSelectedTechId(e.target.value)}
                                className="form-select"
                                style={{ flex: 1 }}
                              >
                                <option value="">-- Pilih Teknisi --</option>
                                {techniciansList.map(t => (
                                  <option key={t.id} value={t.id}>{t.name} ({t.campus_email})</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleAdminAssignSubmit(selectedRequest.id, selectedTechId)}
                                className="btn-primary"
                                style={{ width: "auto", paddingInline: 16 }}
                              >
                                Tugaskan
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // OTHER STATUSES
                        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                          <button
                            onClick={() => handleAdminClose(selectedRequest.id)}
                            className="btn-logout"
                            style={{ fontWeight: 600, width: "100%" }}
                          >
                            Tutup Laporan (Selesai/Admin)
                          </button>
                          {selectedRequest.status === "REOPEN_REQUESTED" && (
                            <button
                              onClick={() => handleAdminReopen(selectedRequest.id)}
                              className="btn-primary"
                              style={{ width: "100%" }}
                            >
                              Buka Ulang Laporan
                            </button>
                          )}
                        </div>
                      )}

                      <button 
                        onClick={() => setSelectedRequest(null)}
                        className="btn-logout"
                        style={{ width: "100%", marginTop: 16 }}
                      >
                        Tutup Peninjauan
                      </button>
                    </div>
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
          <p style={{ marginBottom: 28 }}>Pantau tugas perbaikan Anda, update progress, dan ubah status.</p>

          <div className="flex-container">
            <div className="flex-main">
              <h2>Daftar Tugas Saya</h2>
              {requests.length === 0 ? (
                <div className="placeholder-view">
                  <p>Tidak ada tugas aktif atau pengajuan tugas yang diarahkan kepada Anda saat ini.</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((item) => (
                      <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => handleSelectRequest(item)}>
                        <td><code>{item.request_number}</code></td>
                        <td style={{ fontWeight: 600 }}>{item.title}</td>
                        <td style={{ fontSize: 13 }}>{item.location}</td>
                        <td>{item.category}</td>
                        <td>
                          <span className={`status-indicator ${item.status.toLowerCase() === 'in_progress' ? 'progress' : 'submitted'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex-side">
              <h2>Detail Pekerjaan</h2>
              {selectedRequestDetail ? (
                <div className="premium-card" style={{ maxWidth: "100%", padding: 24, background: "var(--social-bg)" }}>
                  <code style={{ fontSize: 14 }}>{selectedRequestDetail.request_number}</code>
                  <h3 style={{ margin: "8px 0 16px", color: "var(--text-h)", fontSize: 20 }}>{selectedRequestDetail.title}</h3>

                  {/* REASSIGNMENT APPROVAL WORKFLOW FOR TECHNICIAN */}
                  {selectedRequestDetail.pending_reassignment && (
                    (() => {
                      const [, newTechId, newTechName, reassignReason, oldApprovedAt, newApprovedAt] = selectedRequestDetail.pending_reassignment.split(":");
                      const isOldTech = user.id !== newTechId;
                      const isNewTech = user.id === newTechId;

                      return (
                        <div style={{ marginBottom: 20, padding: 16, background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: 8 }}>
                          <h4 style={{ margin: "0 0 8px", color: "#d97706" }}>Persetujuan Reassign Teknisi</h4>
                          <p style={{ fontSize: 13, marginBottom: 12 }}>
                            {isNewTech 
                              ? `Anda ditawarkan tugas ini menggantikan teknisi lama. Alasan: "${reassignReason}"`
                              : `Administrator mengajukan penggantian Anda dengan ${newTechName}. Alasan: "${reassignReason}"`
                            }
                          </p>
                          <div style={{ display: "flex", gap: 12 }}>
                            {((isOldTech && !oldApprovedAt) || (isNewTech && !newApprovedAt)) ? (
                              <>
                                <button
                                  onClick={() => handleTechReassignDecision(selectedRequestDetail.id, true)}
                                  className="btn-primary"
                                  style={{ background: "#10b981", width: "auto", paddingInline: 16 }}
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleTechReassignDecision(selectedRequestDetail.id, false)}
                                  className="btn-logout"
                                  style={{ borderColor: "#ef4444", color: "#ef4444", width: "auto", paddingInline: 16 }}
                                >
                                  Tolak
                                </button>
                              </>
                            ) : (
                              <span style={{ fontSize: 13, color: "var(--text)", fontStyle: "italic" }}>
                                Anda telah menyetujui. Menunggu persetujuan dari teknisi lainnya.
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  )}

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase" }}>Lokasi</div>
                    <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequestDetail.location}</div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase" }}>Kategori</div>
                    <div style={{ color: "var(--text-h)", fontSize: 15 }}>{selectedRequestDetail.category}</div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase" }}>Deskripsi</div>
                    <div style={{ color: "var(--text-h)", fontSize: 14, background: "var(--bg)", padding: 12, borderRadius: 6, border: "1px solid var(--border)", whiteSpace: "pre-line" }}>
                      {selectedRequestDetail.description}
                    </div>
                  </div>

                  {/* COMMENTS IN TECHNICIAN DASHBOARD */}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
                    <h4 style={{ margin: "0 0 12px", color: "var(--text-h)" }}>Diskusi & Komentar</h4>
                    <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16, background: "var(--bg)", padding: 10, borderRadius: 6 }}>
                      {comments.length === 0 ? (
                        <p style={{ fontSize: 12, color: "var(--text)", fontStyle: "italic" }}>Belum ada komentar.</p>
                      ) : (
                        comments.map(c => (
                          <div key={c.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text)", marginBottom: 4 }}>
                              <strong>{c.author_name} ({c.author_role})</strong>
                              <span>{c.created_at}</span>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--text-h)" }}>{c.content}</div>
                          </div>
                        ))
                      )}
                    </div>
                    {detailMessage && <div style={{ fontSize: 12, color: "#3b82f6", marginBottom: 8 }}>{detailMessage}</div>}
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tulis komentar..."
                        className="form-input"
                        style={{ flex: 1, fontSize: 13 }}
                      />
                      <button
                        onClick={() => handleAddComment(selectedRequestDetail.id)}
                        className="btn-primary"
                        style={{ width: "auto", paddingInline: 12, fontSize: 13 }}
                      >
                        Kirim
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedRequestDetail(null)}
                    className="btn-logout"
                    style={{ width: "100%", marginTop: 20 }}
                  >
                    Tutup Detail
                  </button>
                </div>
              ) : (
                <p style={{ color: "var(--text)", marginTop: 16 }}>Pilih tugas untuk melihat detail perbaikan.</p>
              )}
            </div>
          </div>
        </main>
      )}

      {user.role === "FACILITY_MANAGER" && (
        <main className="workspace-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1>Dashboard Manajer Fasilitas</h1>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setActiveTab("DASHBOARD")}
                className={`btn-primary`}
                style={{ width: "auto", paddingInline: 16, background: activeTab === "DASHBOARD" ? "var(--text-h)" : "var(--social-bg)", color: activeTab === "DASHBOARD" ? "#fff" : "var(--text)" }}
              >
                Statistik & Laporan
              </button>
              <button
                onClick={() => setActiveTab("ROOMS")}
                className={`btn-primary`}
                style={{ width: "auto", paddingInline: 16, background: activeTab === "ROOMS" ? "var(--text-h)" : "var(--social-bg)", color: activeTab === "ROOMS" ? "#fff" : "var(--text)" }}
              >
                Kelola Ruangan
              </button>
            </div>
          </div>

          {activeTab === "ROOMS" ? (
            // Tab 1: ROOMS MANAGEMENT
            <div>
              <div className="flex-container">
                <div className="flex-main" style={{ flex: 1.5 }}>
                  <h2>Daftar Ruangan Kampus</h2>
                  {roomSuccess && <div className="alert-success">{roomSuccess}</div>}
                  {roomError && <div className="alert-error">{roomError}</div>}

                  {Object.keys(groupedRooms).length === 0 ? (
                    <div className="placeholder-view">
                      <p>Belum ada data ruangan.</p>
                    </div>
                  ) : (
                    Object.keys(groupedRooms).map(building => (
                      <div key={building} style={{ marginBottom: 24 }}>
                        <h3 style={{ borderBottom: "2px solid var(--border)", paddingBottom: 6, color: "var(--text-h)" }}>{building}</h3>
                        {Object.keys(groupedRooms[building]).map(floor => (
                          <div key={floor} style={{ marginLeft: 16, marginBottom: 12 }}>
                            <h4 style={{ color: "var(--text)", margin: "8px 0" }}>{floor}</h4>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {groupedRooms[building][floor].map(r => (
                                <div
                                  key={r.id}
                                  style={{
                                    background: "var(--social-bg)",
                                    padding: "8px 12px",
                                    borderRadius: 6,
                                    border: "1px solid var(--border)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12
                                  }}
                                >
                                  <span style={{ fontWeight: 600, color: "var(--text-h)" }}>{r.room_name}</span>
                                  <button
                                    onClick={() => handleDeactivateRoom(r.id)}
                                    className="btn-logout"
                                    style={{
                                      padding: "2px 6px",
                                      fontSize: 10,
                                      borderColor: "#ef4444",
                                      color: "#ef4444",
                                      width: "auto"
                                    }}
                                  >
                                    Nonaktifkan
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>

                <div className="flex-side" style={{ flex: 1 }}>
                  <h2>Tambah Ruangan Baru</h2>
                  <div className="premium-card" style={{ padding: 20 }}>
                    <form onSubmit={handleAddRoom}>
                      <div className="form-group">
                        <label>Nama Gedung</label>
                        <input
                          type="text"
                          value={roomBuildingInput}
                          onChange={(e) => setRoomBuildingInput(e.target.value)}
                          placeholder="misal: Gedung A"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Lantai</label>
                        <input
                          type="text"
                          value={roomFloorInput}
                          onChange={(e) => setRoomFloorInput(e.target.value)}
                          placeholder="misal: Lantai 2"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Nama / Nomor Ruangan</label>
                        <input
                          type="text"
                          value={roomNameInput}
                          onChange={(e) => setRoomNameInput(e.target.value)}
                          placeholder="misal: Ruang Rapat Utama"
                          className="form-input"
                        />
                      </div>
                      <button type="submit" className="btn-primary">Tambah</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Tab 2: ANALYTICS & REPORTS
            <div>
              {fmSuccess && <div className="alert-success">{fmSuccess}</div>}
              {fmError && <div className="alert-error">{fmError}</div>}

              {/* Stats Widgets */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 28 }}>
                <div className="premium-card" style={{ padding: 24, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: "var(--text)" }}>Total Masalah Selesai</h3>
                  <div style={{ fontSize: 64, fontWeight: 800, color: "#10b981", margin: "12px 0" }}>
                    {fmStats?.total_solved ?? 0}
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>laporan diselesaikan</span>
                </div>

                <div className="premium-card" style={{ padding: 24 }}>
                  <h3 style={{ margin: "0 0 16px" }}>Distribusi Kategori Masalah</h3>
                  {(!fmStats || fmStats.category_chart.length === 0) ? (
                    <p style={{ fontStyle: "italic", color: "var(--text)" }}>Tidak ada data laporan.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {fmStats.category_chart.map(item => {
                        const total = fmStats.category_chart.reduce((acc, c) => acc + c.count, 0);
                        const pct = total > 0 ? (item.count / total) * 100 : 0;
                        return (
                          <div key={item.category_name}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                              <span style={{ fontWeight: 600 }}>{item.category_name}</span>
                              <span>{item.count} ({pct.toFixed(0)}%)</span>
                            </div>
                            <div style={{ background: "var(--border)", height: 6, borderRadius: 3 }}>
                              <div style={{ background: "#3b82f6", height: "100%", borderRadius: 3, width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Filters Row */}
              <div className="premium-card" style={{ padding: 16, marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 12, alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600 }}>Kategori</label>
                    <select
                      value={fmFilterCategory}
                      onChange={(e) => setFmFilterCategory(e.target.value)}
                      className="form-select"
                      style={{ height: 38, fontSize: 13 }}
                    >
                      <option value="">Semua Kategori</option>
                      {categoriesList.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600 }}>Ruangan</label>
                    <select
                      value={fmFilterRoom}
                      onChange={(e) => setFmFilterRoom(e.target.value)}
                      className="form-select"
                      style={{ height: 38, fontSize: 13 }}
                    >
                      <option value="">Semua Ruangan</option>
                      {roomsList.map(r => (
                        <option key={r.id} value={r.id}>{r.building} - {r.room_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600 }}>Tanggal Mulai</label>
                    <input
                      type="date"
                      value={fmFilterStartDate}
                      onChange={(e) => setFmFilterStartDate(e.target.value)}
                      className="form-input"
                      style={{ height: 38, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600 }}>Tanggal Akhir</label>
                    <input
                      type="date"
                      value={fmFilterEndDate}
                      onChange={(e) => setFmFilterEndDate(e.target.value)}
                      className="form-input"
                      style={{ height: 38, fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, fontWeight: 600 }}>Urutan</label>
                      <select
                        value={fmSort}
                        onChange={(e) => setFmSort(e.target.value)}
                        className="form-select"
                        style={{ height: 38, fontSize: 13 }}
                      >
                        <option value="newest">Terbaru</option>
                        <option value="oldest">Terlama</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        let query = "?";
                        if (fmFilterCategory) query += `category_id=${fmFilterCategory}&`;
                        if (fmFilterRoom) query += `room_id=${fmFilterRoom}&`;
                        if (fmFilterStartDate) query += `start_date=${fmFilterStartDate}&`;
                        if (fmFilterEndDate) query += `end_date=${fmFilterEndDate}&`;
                        query += `sort=${fmSort}`;
                        window.open(`/api/reports/summary.csv${query}`);
                      }}
                      className="btn-primary"
                      style={{ height: 38, fontSize: 13, background: "#10b981", width: "auto", paddingInline: 12 }}
                    >
                      CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary Table */}
              <div className="flex-container">
                <div className="flex-main">
                  <h2>Laporan Ringkas</h2>
                  {fmSummary.length === 0 ? (
                    <div className="placeholder-view">
                      <p>Tidak ada laporan yang sesuai dengan filter.</p>
                    </div>
                  ) : (
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Nomor</th>
                          <th>Judul</th>
                          <th>Kategori</th>
                          <th>Lokasi</th>
                          <th>Status</th>
                          <th>Catatan</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fmSummary.map(row => (
                          <tr key={row.id}>
                            <td><code>{row.request_number}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.title}</td>
                            <td>{row.category}</td>
                            <td style={{ fontSize: 13 }}>{row.location}</td>
                            <td>
                              <span className={`status-indicator ${row.status.toLowerCase() === 'closed_reporter_confirmed' || row.status.toLowerCase() === 'closed_admin' || row.status.toLowerCase() === 'closed_auto' ? 'submitted' : 'progress'}`}
                                    style={['closed_reporter_confirmed', 'closed_admin', 'closed_auto'].includes(row.status.toLowerCase()) ? { background: "rgba(16, 185, 129, 0.1)", color: "#10b981" } : {}}>
                                {row.status}
                              </span>
                            </td>
                            <td style={{ fontSize: 12, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {row.follow_up_note || <span style={{ color: "var(--text)", fontStyle: "italic" }}>Belum ada</span>}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedFmReport(row);
                                  setFmNoteInput(row.follow_up_note || "");
                                  setFmNoteReasonInput("");
                                  setFmError("");
                                  setFmSuccess("");
                                }}
                                className="btn-primary"
                                style={{ padding: "4px 8px", fontSize: 12, width: "auto" }}
                              >
                                Catatan
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Follow-up Note Dialog */}
                {selectedFmReport && (
                  <div className="flex-side">
                    <h2>Catatan Tindak Lanjut</h2>
                    <div className="premium-card" style={{ padding: 20, background: "var(--social-bg)" }}>
                      <h4 style={{ margin: "0 0 8px", color: "var(--text-h)" }}>
                        Laporan {selectedFmReport.request_number}
                      </h4>
                      <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 16 }}>
                        Masukkan catatan tindak lanjut hasil evaluasi Anda.
                      </p>
                      <form onSubmit={handleAddFmFollowUp}>
                        <div className="form-group">
                          <label>Isi Catatan</label>
                          <textarea
                            value={fmNoteInput}
                            onChange={(e) => setFmNoteInput(e.target.value)}
                            placeholder="Catatan penanganan, kesimpulan atau instruksi lanjutan..."
                            rows={3}
                            className="form-textarea"
                          />
                        </div>
                        <div className="form-group">
                          <label>Alasan (wajib, min 5 karakter)</label>
                          <input
                            type="text"
                            value={fmNoteReasonInput}
                            onChange={(e) => setFmNoteReasonInput(e.target.value)}
                            placeholder="Alasan perubahan catatan..."
                            className="form-input"
                          />
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <button type="submit" className="btn-primary" style={{ width: "auto", paddingInline: 20 }}>
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedFmReport(null)}
                            className="btn-logout"
                            style={{ width: "auto", paddingInline: 20 }}
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}