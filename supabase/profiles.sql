-- Run this in the Supabase SQL Editor.
-- Creates a minimal profiles table: no passwords, no personal data beyond name + email.

CREATE TABLE IF NOT EXISTS profiles (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text        NOT NULL,
  email      text        NOT NULL UNIQUE CHECK (email = lower(email)),
  created_at timestamptz DEFAULT now()
);

-- Optional: index on email for fast look-ups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);
