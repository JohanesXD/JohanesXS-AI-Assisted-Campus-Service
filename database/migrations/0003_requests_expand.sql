-- Migration: 0003_requests_expand.sql
-- Expand service_requests schema to relate to users, categories, and rooms, and support lifecycle fields.

-- Drop old service_requests if exists (temporary drop for development D1 migration)
DROP TABLE IF EXISTS service_requests;

-- Re-create service_requests table
CREATE TABLE service_requests (
    id TEXT PRIMARY KEY,
    request_number TEXT UNIQUE NOT NULL,
    reporter_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories(id),
    room_id TEXT NOT NULL REFERENCES rooms(id),
    urgency TEXT NOT NULL CHECK(urgency IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status TEXT NOT NULL DEFAULT 'SUBMITTED',
    rejection_reason TEXT,
    cancel_reason TEXT,
    resolution_rejected_reason TEXT,
    resolved_at TEXT,
    confirmation_due_at TEXT,
    closed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Core Indexes for Performance
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_reporter_id ON service_requests(reporter_id);
CREATE INDEX idx_service_requests_room_id ON service_requests(room_id);
CREATE INDEX idx_service_requests_category_id ON service_requests(category_id);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at);
