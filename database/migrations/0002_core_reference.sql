-- Migration: 0002_core_reference.sql
-- Create users, categories, and rooms tables

-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    campus_email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('REPORTER', 'ADMIN', 'TECHNICIAN', 'FACILITY_MANAGER')),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table
CREATE TABLE rooms (
    id TEXT PRIMARY KEY,
    building TEXT NOT NULL,
    floor TEXT NOT NULL,
    room_name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(building, floor, room_name)
);

-- Index for Rooms search
CREATE INDEX idx_rooms_building_floor ON rooms(building, floor);

-- Seed Initial Users
INSERT INTO users (id, campus_email, name, role) VALUES
('usr-001', 'student@campus.ac.id', 'Mahasiswa Tester', 'REPORTER'),
('usr-002', 'admin@campus.ac.id', 'Admin Utama', 'ADMIN'),
('usr-003', 'tech@campus.ac.id', 'Teknisi AC Budi', 'TECHNICIAN'),
('usr-004', 'manager@campus.ac.id', 'Manajer Fasilitas Sari', 'FACILITY_MANAGER');

-- Seed Initial Categories
INSERT INTO categories (id, name) VALUES
('cat-001', 'Internet'),
('cat-002', 'AC'),
('cat-003', 'Peralatan Kelas'),
('cat-004', 'Kebersihan'),
('cat-005', 'Lainnya');

-- Seed Initial Rooms
INSERT INTO rooms (id, building, floor, room_name) VALUES
('rm-001', 'Gedung A', 'Lantai 1', 'Ruang 101'),
('rm-002', 'Gedung A', 'Lantai 2', 'Ruang 201'),
('rm-003', 'Gedung B', 'Lantai 1', 'Lab Komputer'),
('rm-004', 'Gedung B', 'Lantai 3', 'Perpustakaan');
