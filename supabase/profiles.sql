-- =============================================================
-- Convene AI — Profiles Table (Authentication)
-- Run this in the Supabase SQL Editor.
-- =============================================================

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);
