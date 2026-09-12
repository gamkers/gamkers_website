-- GAMKERS AI CTF — Supabase Table DDL
-- Run this in the Supabase SQL Editor

-- Players
CREATE TABLE IF NOT EXISTS ctf_players (
  id BIGSERIAL PRIMARY KEY,
  team TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Solves (which player solved which lab)
CREATE TABLE IF NOT EXISTS ctf_solves (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES ctf_players(id),
  lab_id INTEGER NOT NULL,
  solved_at TIMESTAMPTZ DEFAULT now(),
  first_blood BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  UNIQUE(player_id, lab_id)
);

-- Chat logs (every message + response)
CREATE TABLE IF NOT EXISTS ctf_chat_logs (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES ctf_players(id),
  lab_id INTEGER NOT NULL,
  message TEXT,
  response TEXT,
  ts TIMESTAMPTZ DEFAULT now()
);

-- Flag submission attempts
CREATE TABLE IF NOT EXISTS ctf_submissions (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES ctf_players(id),
  lab_id INTEGER NOT NULL,
  flag_attempt TEXT,
  correct BOOLEAN DEFAULT FALSE,
  ts TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (allow all for anon key)
ALTER TABLE ctf_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_solves ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for ctf_players" ON ctf_players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ctf_solves" ON ctf_solves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ctf_chat_logs" ON ctf_chat_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ctf_submissions" ON ctf_submissions FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_solves_player ON ctf_solves(player_id);
CREATE INDEX IF NOT EXISTS idx_logs_player ON ctf_chat_logs(player_id);
CREATE INDEX IF NOT EXISTS idx_subs_player ON ctf_submissions(player_id);
CREATE INDEX IF NOT EXISTS idx_players_score ON ctf_players(score DESC);
