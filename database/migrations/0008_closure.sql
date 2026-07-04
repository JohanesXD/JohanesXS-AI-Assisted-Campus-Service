-- Migration: 0008_closure.sql
-- Add index for efficient auto-close queries on WAITING_REPORTER_CONFIRMATION

CREATE INDEX IF NOT EXISTS idx_service_requests_confirm_due
ON service_requests(status, confirmation_due_at)
WHERE status = 'WAITING_REPORTER_CONFIRMATION';
