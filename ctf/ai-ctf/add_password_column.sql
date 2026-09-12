-- Run this in Supabase SQL Editor to add password column
ALTER TABLE ctf_players ADD COLUMN IF NOT EXISTS pw_hash TEXT;
