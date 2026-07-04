-- Migration: 0012_admin_management.sql
-- Add duplicate_of_id and create facility_manager_notes table

-- Add duplicate_of_id to service_requests for merging duplicate reports
ALTER TABLE service_requests ADD COLUMN duplicate_of_id TEXT REFERENCES service_requests(id);

-- Create table facility_manager_notes for follow-up notes
CREATE TABLE IF NOT EXISTS facility_manager_notes (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES service_requests(id),
  manager_id TEXT NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fm_notes_request ON facility_manager_notes(request_id);
