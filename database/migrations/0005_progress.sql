-- Migration: 0005_progress.sql
-- Create technician_progress table

-- Drop if exists
DROP TABLE IF EXISTS technician_progress;

-- Create table technician_progress
CREATE TABLE technician_progress (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES service_requests(id),
    technician_id TEXT NOT NULL REFERENCES users(id),
    status TEXT NOT NULL CHECK(status IN ('ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED')),
    notes TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Core Indexes
CREATE INDEX idx_technician_progress_request ON technician_progress(request_id);
CREATE INDEX idx_technician_progress_tech ON technician_progress(technician_id);
