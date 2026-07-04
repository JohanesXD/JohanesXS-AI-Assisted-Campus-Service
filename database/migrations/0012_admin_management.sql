-- Migration: 0012_admin_management.sql
-- Add duplicate_of_id to service_requests for merging duplicate reports

ALTER TABLE service_requests ADD COLUMN duplicate_of_id TEXT REFERENCES service_requests(id);
