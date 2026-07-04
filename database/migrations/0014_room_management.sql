-- Migration: Room Management for Facility Manager
-- FR-030, FR-035

-- Ensure rooms table has proper indexes (already created in 0002, adding any missing ones)
CREATE INDEX IF NOT EXISTS idx_rooms_is_active ON rooms(is_active);

-- Table for tracking room management audit (optional, for tracking who added/modified rooms)
CREATE TABLE IF NOT EXISTS room_management_log (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id),
  action TEXT NOT NULL CHECK(action IN ('CREATE', 'UPDATE', 'DEACTIVATE')),
  performed_by_user_id TEXT NOT NULL REFERENCES users(id),
  old_building TEXT,
  old_floor TEXT,
  old_room_name TEXT,
  new_building TEXT,
  new_floor TEXT,
  new_room_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_room_management_log_room ON room_management_log(room_id);
