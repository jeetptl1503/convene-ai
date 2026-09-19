-- =============================================================
-- Convene AI — Database Schema
-- Run this in the Supabase SQL Editor to create all tables.
-- =============================================================

-- Enable pgvector for document embeddings
create extension if not exists vector;

-- -----------------------------------------------------------
-- Events
-- -----------------------------------------------------------
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  date        timestamptz,
  location    text,
  status      text not null default 'planning' check (status in ('planning', 'active', 'completed', 'cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------
-- Members (volunteers / organizers)
-- -----------------------------------------------------------
create table if not exists members (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  name       text not null,
  email      text not null,
  role       text not null default 'volunteer',
  skills     text[] default '{}',
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------
-- Tasks
-- -----------------------------------------------------------
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events(id) on delete cascade,
  title       text not null,
  description text,
  owner_id    uuid references members(id) on delete set null,
  deadline    timestamptz,
  status      text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority    text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  depends_on  uuid references tasks(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------
-- Meetings
-- -----------------------------------------------------------
create table if not exists meetings (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  title      text not null,
  transcript text,
  summary    text,
  date       timestamptz not null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------
-- Risks
-- -----------------------------------------------------------
create table if not exists risks (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events(id) on delete cascade,
  task_id     uuid references tasks(id) on delete set null,
  severity    text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  title       text not null,
  explanation text,
  suggestion  text,
  resolved    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------
-- Announcements
-- -----------------------------------------------------------
create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  title      text not null,
  body       text,
  status     text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------
-- Documents
-- -----------------------------------------------------------
create table if not exists documents (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  title      text not null,
  content    text,
  file_url   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------
-- Document Chunks (for RAG / semantic search)
-- -----------------------------------------------------------
create table if not exists document_chunks (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content     text not null,
  embedding   vector(768),
  created_at  timestamptz not null default now()
);

-- Index for fast similarity search
create index if not exists idx_document_chunks_embedding
  on document_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- -----------------------------------------------------------
-- Activity Log
-- -----------------------------------------------------------
create table if not exists activity_log (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  action     text not null,
  details    text,
  created_at timestamptz not null default now()
);
