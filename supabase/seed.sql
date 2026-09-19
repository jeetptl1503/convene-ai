-- =============================================================
-- Convene AI — Seed Data
-- Run this in the Supabase SQL Editor AFTER schema.sql.
-- Creates one demo event, 8 volunteers, and 12 tasks.
-- =============================================================

-- -----------------------------------------------------------
-- 1. Demo Event
-- -----------------------------------------------------------
insert into events (id, name, description, date, location, status) values
  ('a0000000-0000-0000-0000-000000000001',
   'HackSphere 2026',
   'Annual 36-hour hackathon organized by the Computer Science Club. 200+ participants expected.',
   '2026-10-15 09:00:00+05:30',
   'University Auditorium & Labs',
   'planning');

-- -----------------------------------------------------------
-- 2. Volunteers (8 members)
-- -----------------------------------------------------------
insert into members (id, event_id, name, email, role, skills) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Arjun Mehta', 'arjun@club.edu', 'lead', '{project management, public speaking}'),

  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
   'Priya Sharma', 'priya@club.edu', 'co-lead', '{design, social media}'),

  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
   'Ravi Patel', 'ravi@club.edu', 'volunteer', '{web development, React}'),

  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001',
   'Sneha Iyer', 'sneha@club.edu', 'volunteer', '{content writing, documentation}'),

  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   'Karan Singh', 'karan@club.edu', 'volunteer', '{logistics, venue management}'),

  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001',
   'Ananya Desai', 'ananya@club.edu', 'volunteer', '{finance, sponsorship}'),

  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001',
   'Vikram Joshi', 'vikram@club.edu', 'volunteer', '{backend development, DevOps}'),

  ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001',
   'Meera Nair', 'meera@club.edu', 'volunteer', '{marketing, photography}');

-- -----------------------------------------------------------
-- 3. Tasks (12 — mix of statuses, some overdue, some unassigned)
-- -----------------------------------------------------------
insert into tasks (id, event_id, title, description, owner_id, deadline, status, priority) values

  -- Overdue tasks (deadlines in the past)
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Finalize venue booking',
   'Confirm auditorium and two lab rooms with the admin office. Get the booking confirmation letter.',
   'b0000000-0000-0000-0000-000000000005',
   '2026-09-10 17:00:00+05:30', 'todo', 'critical'),

  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
   'Send sponsor outreach emails',
   'Draft and send sponsorship pitch to at least 15 companies from the target list.',
   'b0000000-0000-0000-0000-000000000006',
   '2026-09-12 17:00:00+05:30', 'doing', 'high'),

  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
   'Design event poster and social media kit',
   'Create the main poster (A3), Instagram carousel, and LinkedIn banner using the brand guidelines.',
   'b0000000-0000-0000-0000-000000000002',
   '2026-09-15 17:00:00+05:30', 'done', 'high'),

  -- Unassigned tasks (no owner)
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001',
   'Set up participant registration form',
   'Create a Google Form or Typeform with fields: name, email, college, year, team name, dietary prefs.',
   null,
   '2026-09-25 17:00:00+05:30', 'todo', 'high'),

  ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   'Arrange catering for 200 people',
   'Get quotes from 3 caterers. Need breakfast, lunch, dinner, and midnight snacks for 36 hours.',
   null,
   '2026-10-01 17:00:00+05:30', 'todo', 'medium'),

  -- In-progress tasks
  ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001',
   'Build event website',
   'Landing page with schedule, FAQ, registration link, and sponsor logos. Deploy on Vercel.',
   'b0000000-0000-0000-0000-000000000003',
   '2026-09-28 17:00:00+05:30', 'doing', 'high'),

  ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001',
   'Write judging criteria document',
   'Define scoring rubric: innovation, technical complexity, presentation, impact. Get faculty approval.',
   'b0000000-0000-0000-0000-000000000004',
   '2026-09-30 17:00:00+05:30', 'doing', 'medium'),

  -- Upcoming tasks
  ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001',
   'Recruit mentors from industry',
   'Reach out to alumni and local tech companies for 10-12 mentors. Confirm availability for Oct 15-16.',
   'b0000000-0000-0000-0000-000000000001',
   '2026-10-05 17:00:00+05:30', 'todo', 'medium'),

  ('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001',
   'Set up Wi-Fi and power infrastructure',
   'Coordinate with IT dept for dedicated Wi-Fi. Arrange extension boards and UPS for all stations.',
   'b0000000-0000-0000-0000-000000000005',
   '2026-10-10 17:00:00+05:30', 'todo', 'high'),

  ('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001',
   'Prepare opening ceremony presentation',
   'Slides covering schedule, rules, prizes, mentor introductions, and sponsor shoutouts.',
   'b0000000-0000-0000-0000-000000000001',
   '2026-10-13 17:00:00+05:30', 'todo', 'low'),

  -- Done tasks
  ('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001',
   'Create club email and social accounts',
   'Set up hacksphere2026@gmail.com, Instagram, Twitter, and LinkedIn pages.',
   'b0000000-0000-0000-0000-000000000008',
   '2026-09-05 17:00:00+05:30', 'done', 'medium'),

  ('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001',
   'Draft event budget spreadsheet',
   'Itemized budget covering venue, catering, swag, prizes, travel, and contingency fund.',
   'b0000000-0000-0000-0000-000000000006',
   '2026-09-08 17:00:00+05:30', 'done', 'high');

-- -----------------------------------------------------------
-- 4. Seed activity log
-- -----------------------------------------------------------
insert into activity_log (event_id, action, details, created_at) values
  ('a0000000-0000-0000-0000-000000000001', 'event_created', 'HackSphere 2026 event was created', '2026-09-01 10:00:00+05:30'),
  ('a0000000-0000-0000-0000-000000000001', 'member_added', '8 volunteers were added to the team', '2026-09-01 10:30:00+05:30'),
  ('a0000000-0000-0000-0000-000000000001', 'task_completed', 'Arjun completed: Create club email and social accounts', '2026-09-05 16:00:00+05:30'),
  ('a0000000-0000-0000-0000-000000000001', 'task_completed', 'Ananya completed: Draft event budget spreadsheet', '2026-09-08 15:00:00+05:30'),
  ('a0000000-0000-0000-0000-000000000001', 'task_completed', 'Priya completed: Design event poster and social media kit', '2026-09-15 14:00:00+05:30');
