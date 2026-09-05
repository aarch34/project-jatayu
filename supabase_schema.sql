-- ===================================================================
-- PROJECT JATAYU 3.0 — SUPABASE QUIZ LEADERBOARD DATABASE SCHEMA
-- ===================================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- to create the quiz_attempts table, performance index, and RLS policies.

-- 1. Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rotaract_club TEXT NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 15,
  score INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create performance & strict competitive ordering index:
-- Primary: correct_answers DESC
-- Secondary: time_seconds ASC (lower time is faster)
-- Tertiary: completed_at ASC (earlier submission tie-breaker)
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_leaderboard
ON quiz_attempts (correct_answers DESC, time_seconds ASC, completed_at ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if already created to allow re-running
DROP POLICY IF EXISTS "Allow public read access to leaderboard" ON quiz_attempts;
DROP POLICY IF EXISTS "Allow public insert access for quiz submissions" ON quiz_attempts;

-- 5. Policy: Public READ access for global leaderboard display
CREATE POLICY "Allow public read access to leaderboard"
ON quiz_attempts
FOR SELECT
USING (true);

-- 6. Policy: Public INSERT access for quiz submissions
CREATE POLICY "Allow public insert access for quiz submissions"
ON quiz_attempts
FOR INSERT
WITH CHECK (true);

-- ===================================================================
-- END OF SCHEMA
-- ===================================================================
