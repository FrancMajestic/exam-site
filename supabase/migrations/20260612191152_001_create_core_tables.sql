/*
# Create core tables for EGE/OGE Preparation Platform

1. New Tables
- `subjects` — Exam subjects (Math, Russian, Physics, etc.) with EGE/OGE type
  - id (serial, PK), name, exam_type, task_count, color, icon, description
- `topics` — Subject topics/chapters
  - id (serial, PK), subject_id (FK), name, task_count
- `tasks` — Individual exam tasks/questions
  - id (serial, PK), subject_id (FK), topic_id (FK), task_number, exam_type, difficulty, question, image_url, answer_type, options (jsonb), correct_answer, solution, lifehack, year, source
- `users` — Platform users
  - id (serial, PK), clerk_id, name, email, role, grade_level, selected_subject_ids, level, coin_balance, total_earned, total_tasks_solved, correct_answers, current_streak, max_streak, created_at, last_active_at
2. Security
- RLS enabled on all tables
- Public read access for subjects, topics, tasks (exam content is openly available)
- Users table accessible to anon + authenticated
*/

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  task_count INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT 'book',
  description TEXT
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_subjects" ON subjects;
CREATE POLICY "public_read_subjects" ON subjects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_subjects" ON subjects;
CREATE POLICY "public_insert_subjects" ON subjects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_subjects" ON subjects;
CREATE POLICY "public_update_subjects" ON subjects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  task_count INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_topics" ON topics;
CREATE POLICY "public_read_topics" ON topics FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_topics" ON topics;
CREATE POLICY "public_insert_topics" ON topics FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_topics" ON topics;
CREATE POLICY "public_update_topics" ON topics FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  task_number INTEGER NOT NULL,
  exam_type TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  question TEXT NOT NULL,
  image_url TEXT,
  answer_type TEXT NOT NULL DEFAULT 'text',
  options JSONB,
  correct_answer TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  lifehack TEXT,
  year INTEGER,
  source TEXT
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_tasks" ON tasks;
CREATE POLICY "public_read_tasks" ON tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_tasks" ON tasks;
CREATE POLICY "public_insert_tasks" ON tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_tasks" ON tasks;
CREATE POLICY "public_update_tasks" ON tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'student',
  grade_level INTEGER,
  selected_subject_ids JSONB DEFAULT '[]',
  level INTEGER NOT NULL DEFAULT 1,
  coin_balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_tasks_solved INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  max_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_users" ON users;
CREATE POLICY "public_read_users" ON users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_users" ON users;
CREATE POLICY "public_insert_users" ON users FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_users" ON users;
CREATE POLICY "public_update_users" ON users FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_subject_id ON tasks(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_topic_id ON tasks(topic_id);
CREATE INDEX IF NOT EXISTS idx_tasks_exam_type ON tasks(exam_type);
CREATE INDEX IF NOT EXISTS idx_tasks_difficulty ON tasks(difficulty);
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);
