-- Migration: 0004_assignments.sql
-- Create request_assignments table

-- Drop if exists
DROP TABLE IF EXISTS request_assignments;

-- Create table request_assignments
CREATE TABLE request_assignments (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES service_requests(id),
    technician_id TEXT NOT NULL REFERENCES users(id),
    assignment_type TEXT NOT NULL CHECK(assignment_type IN ('PRIMARY', 'ADDITIONAL')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'REPLACEMENT_PENDING', 'REPLACED', 'DECLINED')),
    assigned_by_user_id TEXT NOT NULL REFERENCES users(id),
    old_technician_approved_at TEXT,
    new_technician_approved_at TEXT,
    reason TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Core Indexes
CREATE INDEX idx_request_assignments_request ON request_assignments(request_id);
CREATE INDEX idx_request_assignments_tech ON request_assignments(technician_id);
CREATE INDEX idx_request_assignments_tech_status ON request_assignments(technician_id, status);
