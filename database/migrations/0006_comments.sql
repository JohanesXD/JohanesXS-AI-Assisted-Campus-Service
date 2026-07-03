-- Migration: 0006_comments.sql
-- Create request_comments table for reporter additional comments

-- Drop if exists
DROP TABLE IF EXISTS request_comments;

-- Create table request_comments
CREATE TABLE request_comments (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES service_requests(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Core Indexes
CREATE INDEX idx_request_comments_request ON request_comments(request_id);
CREATE INDEX idx_request_comments_user ON request_comments(user_id);
