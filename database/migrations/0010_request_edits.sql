-- Migration: Request Edit History
-- Tracks changes made by reporters to their service requests

CREATE TABLE IF NOT EXISTS request_edits (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  edited_by_user_id TEXT NOT NULL,
  old_title TEXT,
  new_title TEXT,
  old_description TEXT,
  new_description TEXT,
  old_category_id TEXT,
  new_category_id TEXT,
  old_room_id TEXT,
  new_room_id TEXT,
  old_urgency TEXT,
  new_urgency TEXT,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES service_requests(id),
  FOREIGN KEY (edited_by_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_request_edits_request_id ON request_edits(request_id);
CREATE INDEX IF NOT EXISTS idx_request_edits_created_at ON request_edits(created_at);
