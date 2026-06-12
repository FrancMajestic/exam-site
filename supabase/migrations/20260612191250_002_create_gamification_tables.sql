/*
# Create gamification and social tables

1. New Tables
- `tests` — Available test variants
  - id (serial, PK), title, subject_id (FK), exam_type, task_count, duration, difficulty, year, completion_count, average_score
- `test_tasks` — Junction table linking tests to tasks
  - id (serial, PK), test_id (FK), task_id (FK), order_index
- `task_attempts` — Records of user answers to tasks
  - id (serial, PK), user_id (FK), task_id (FK), answer, correct, coins_earned, created_at
- `test_results` — Records of completed tests
  - id (serial, PK), user_id (FK), test_id (FK), score, max_score, time_spent_seconds, coins_earned, created_at
- `coin_transactions` — Coin earning/spending history
  - id (serial, PK), user_id (FK), amount, type, description, related_id, created_at
2. Security
- RLS enabled, public CRUD for all tables (single-tenant mode, no auth required)
*/

-- Tests table (must come before test_results which references it)
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL,
  task_count INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 90,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  year INTEGER,
  completion_count INTEGER NOT NULL DEFAULT 0,
  average_score REAL
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_tests" ON tests;
CREATE POLICY "public_read_tests" ON tests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_tests" ON tests;
CREATE POLICY "public_insert_tests" ON tests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_tests" ON tests;
CREATE POLICY "public_update_tests" ON tests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Test tasks junction
CREATE TABLE IF NOT EXISTS test_tasks (
  id SERIAL PRIMARY KEY,
  test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE test_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_test_tasks" ON test_tasks;
CREATE POLICY "public_read_test_tasks" ON test_tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_test_tasks" ON test_tasks;
CREATE POLICY "public_insert_test_tasks" ON test_tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Task attempts
CREATE TABLE IF NOT EXISTS task_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE task_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_task_attempts" ON task_attempts;
CREATE POLICY "public_select_task_attempts" ON task_attempts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_task_attempts" ON task_attempts;
CREATE POLICY "public_insert_task_attempts" ON task_attempts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_task_attempts" ON task_attempts;
CREATE POLICY "public_update_task_attempts" ON task_attempts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Test results
CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  time_spent_seconds INTEGER,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_test_results" ON test_results;
CREATE POLICY "public_select_test_results" ON test_results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_test_results" ON test_results;
CREATE POLICY "public_insert_test_results" ON test_results FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Coin transactions
CREATE TABLE IF NOT EXISTS coin_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  related_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_coin_transactions" ON coin_transactions;
CREATE POLICY "public_read_coin_transactions" ON coin_transactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_coin_transactions" ON coin_transactions;
CREATE POLICY "public_insert_coin_transactions" ON coin_transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_attempts_user_id ON task_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_task_attempts_task_id ON task_attempts(task_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_tasks_test_id ON test_tasks(test_id);
