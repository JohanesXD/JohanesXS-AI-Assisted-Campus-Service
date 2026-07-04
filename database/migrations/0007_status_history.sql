-- Migration: 0007_status_history.sql
-- Create request_status_history table for status change tracking

-- Drop if exists
DROP TABLE IF EXISTS request_status_history;

-- Create table request_status_history
CREATE TABLE request_status_history (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES service_requests(id),
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_by_user_id TEXT REFERENCES users(id),
    reason TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Core Indexes
CREATE INDEX idx_req_status_history_request ON request_status_history(request_id);
CREATE INDEX idx_req_status_history_created ON request_status_history(created_at);
