-- Migration: 0015_update_progress_constraint.sql
-- Update check constraint on technician_progress status column to support NEED_HELP and WAITING_PARTS

-- Rename old table
ALTER TABLE technician_progress RENAME TO technician_progress_old;

-- Create new table with updated check constraint
CREATE TABLE technician_progress (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES service_requests(id),
    technician_id TEXT NOT NULL REFERENCES users(id),
    status TEXT NOT NULL CHECK(status IN ('ASSIGNED', 'IN_PROGRESS', 'NEED_HELP', 'WAITING_PARTS', 'ON_HOLD', 'RESOLVED')),
    notes TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Copy data
INSERT INTO technician_progress (id, request_id, technician_id, status, notes, created_at)
SELECT id, request_id, technician_id, status, notes, created_at FROM technician_progress_old;

-- Drop old table
DROP TABLE technician_progress_old;

-- Recreate indexes
CREATE INDEX idx_technician_progress_request ON technician_progress(request_id);
CREATE INDEX idx_technician_progress_tech ON technician_progress(technician_id);
