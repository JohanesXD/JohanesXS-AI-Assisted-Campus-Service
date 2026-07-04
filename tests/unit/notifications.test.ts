import { describe, it, expect, beforeEach } from "vitest";

interface MockNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  request_id: string | null;
  is_read: number;
  read_at: string | null;
  created_at: string;
}

interface MockCreateInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  requestId: string | null;
}

function generateId(): string {
  return `notif-${Math.random().toString(36).substring(2, 10)}`;
}

const notificationStore = new Map<string, MockNotification>();

function resetStore() {
  notificationStore.clear();
}

function createNotification(input: MockCreateInput): MockNotification {
  const notif: MockNotification = {
    id: generateId(),
    user_id: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    request_id: input.requestId,
    is_read: 0,
    read_at: null,
    created_at: new Date().toISOString()
  };
  notificationStore.set(notif.id, notif);
  return notif;
}

function getNotifications(userId: string): MockNotification[] {
  return Array.from(notificationStore.values())
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter(n => n.is_read === 0).length;
}

function markAsRead(notifId: string, userId: string): { success: boolean; error?: string } {
  const notif = notificationStore.get(notifId);
  if (!notif) return { success: false, error: "Notifikasi tidak ditemukan." };
  if (notif.user_id !== userId) return { success: false, error: "Anda hanya dapat menandai notifikasi milik sendiri." };
  notif.is_read = 1;
  notif.read_at = new Date().toISOString();
  return { success: true };
}

function markAllAsRead(userId: string): void {
  for (const notif of notificationStore.values()) {
    if (notif.user_id === userId && notif.is_read === 0) {
      notif.is_read = 1;
      notif.read_at = new Date().toISOString();
    }
  }
}

// Recipient determination for status changes
function getNotificationRecipients(status: string, reporterId: string, adminsCount: number): string[] {
  const recipients: string[] = [];
  switch (status) {
    case "SUBMITTED":
    case "REOPEN_REQUESTED":
    case "CLOSED_REPORTER_CONFIRMED":
    case "NEED_HELP":
      // Notify all admins
      for (let i = 0; i < adminsCount; i++) recipients.push(`admin-${i}`);
      break;
    case "REJECTED":
    case "IN_PROGRESS":
    case "WAITING_PARTS":
    case "PAUSED":
    case "CLOSED_AUTO":
    case "CLOSED_ADMIN":
    case "REOPENED":
      recipients.push(reporterId);
      break;
    case "WAITING_REPORTER_CONFIRMATION":
    case "RESOLVED":
      recipients.push(reporterId);
      break;
  }
  return recipients;
}

describe("createNotification", () => {
  beforeEach(() => resetStore());

  it("harus membuat notifikasi dengan data yang benar", () => {
    const notif = createNotification({
      userId: "usr-1",
      type: "STATUS_CHANGE",
      title: "Laporan Baru",
      message: "Ada laporan baru",
      requestId: "req-1"
    });
    expect(notif.user_id).toBe("usr-1");
    expect(notif.type).toBe("STATUS_CHANGE");
    expect(notif.title).toBe("Laporan Baru");
    expect(notif.is_read).toBe(0);
    expect(notif.read_at).toBeNull();
  });
});

describe("getNotifications", () => {
  beforeEach(() => resetStore());

  it("harus mengembalikan notifikasi untuk user tertentu", () => {
    createNotification({ userId: "usr-1", type: "STATUS_CHANGE", title: "Notif 1", message: "msg", requestId: null });
    createNotification({ userId: "usr-2", type: "STATUS_CHANGE", title: "Notif 2", message: "msg", requestId: null });
    createNotification({ userId: "usr-1", type: "RESOLVED", title: "Notif 3", message: "msg", requestId: "req-1" });

    const user1Notifs = getNotifications("usr-1");
    expect(user1Notifs.length).toBe(2);
    expect(user1Notifs.every(n => n.user_id === "usr-1")).toBe(true);
  });

  it("harus mengurutkan notifikasi dari yang terbaru", () => {
    createNotification({ userId: "usr-1", type: "STATUS_CHANGE", title: "Lama", message: "msg", requestId: null });
    const notifs = getNotifications("usr-1");
    expect(notifs.length).toBe(1);
  });
});

describe("getUnreadCount", () => {
  beforeEach(() => resetStore());

  it("harus menghitung notifikasi yang belum dibaca", () => {
    createNotification({ userId: "usr-1", type: "STATUS_CHANGE", title: "Notif 1", message: "msg", requestId: null });
    createNotification({ userId: "usr-1", type: "RESOLVED", title: "Notif 2", message: "msg", requestId: null });
    const notifs = getNotifications("usr-1");
    markAsRead(notifs[0].id, "usr-1");
    expect(getUnreadCount("usr-1")).toBe(1);
  });
});

describe("markAsRead", () => {
  beforeEach(() => resetStore());

  it("harus menandai notifikasi sebagai dibaca", () => {
    const notif = createNotification({ userId: "usr-1", type: "STATUS_CHANGE", title: "Test", message: "msg", requestId: null });
    const result = markAsRead(notif.id, "usr-1");
    expect(result.success).toBe(true);
    expect(notificationStore.get(notif.id)!.is_read).toBe(1);
    expect(notificationStore.get(notif.id)!.read_at).not.toBeNull();
  });

  it("harus menolak jika notifikasi tidak ditemukan", () => {
    const result = markAsRead("not-found", "usr-1");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Notifikasi tidak ditemukan.");
  });

  it("harus menolak jika user bukan pemilik", () => {
    const notif = createNotification({ userId: "usr-1", type: "STATUS_CHANGE", title: "Test", message: "msg", requestId: null });
    const result = markAsRead(notif.id, "usr-2");
    expect(result.success).toBe(false);
    expect(result.error).toContain("Anda hanya dapat menandai notifikasi milik sendiri");
  });
});

describe("markAllAsRead", () => {
  beforeEach(() => resetStore());

  it("harus menandai semua notifikasi user sebagai dibaca", () => {
    createNotification({ userId: "usr-1", type: "STATUS_CHANGE", title: "N1", message: "msg", requestId: null });
    createNotification({ userId: "usr-1", type: "RESOLVED", title: "N2", message: "msg", requestId: null });
    createNotification({ userId: "usr-2", type: "STATUS_CHANGE", title: "N3", message: "msg", requestId: null });

    markAllAsRead("usr-1");
    expect(getUnreadCount("usr-1")).toBe(0);
    expect(getUnreadCount("usr-2")).toBe(1);
  });
});

describe("getNotificationRecipients", () => {
  it("SUBMITTED harus notifikasi admin", () => {
    const recipients = getNotificationRecipients("SUBMITTED", "reporter-1", 2);
    expect(recipients).toEqual(["admin-0", "admin-1"]);
  });

  it("REJECTED harus notifikasi reporter", () => {
    const recipients = getNotificationRecipients("REJECTED", "reporter-1", 2);
    expect(recipients).toEqual(["reporter-1"]);
  });

  it("WAITING_REPORTER_CONFIRMATION harus notifikasi reporter", () => {
    const recipients = getNotificationRecipients("WAITING_REPORTER_CONFIRMATION", "reporter-1", 2);
    expect(recipients).toEqual(["reporter-1"]);
  });

  it("REOPEN_REQUESTED harus notifikasi admin", () => {
    const recipients = getNotificationRecipients("REOPEN_REQUESTED", "reporter-1", 3);
    expect(recipients).toEqual(["admin-0", "admin-1", "admin-2"]);
  });
});
