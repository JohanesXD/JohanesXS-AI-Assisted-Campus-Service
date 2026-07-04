-- Migration 0009: Create notifications table
-- FR-022: In-app notifications on status changes
-- FR-023: Notify on resolved, waiting parts, need help, paused
-- FR-037: Read/unread history

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN (
    'STATUS_CHANGE', 'RESOLVED', 'WAITING_PARTS', 'NEED_HELP', 'PAUSED', 'REOPENED'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  request_id TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (request_id) REFERENCES service_requests(id)
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_user_all ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_request ON notifications(request_id);
