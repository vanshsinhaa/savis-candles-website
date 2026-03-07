-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Creates the leads table used by the Ember chatbot widget

CREATE TABLE IF NOT EXISTS leads (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT,
  phone      TEXT,
  message    TEXT,                            -- conversation transcript
  source     TEXT        NOT NULL DEFAULT 'chatbot',
  contacted  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying by contacted status (admin dashboard use)
CREATE INDEX IF NOT EXISTS leads_contacted_idx ON leads (contacted, created_at DESC);

-- RLS: disable all public access — only the service role key can write
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- No public policies — service role bypasses RLS automatically
-- To allow your admin dashboard to read leads via the anon key, add:
-- CREATE POLICY "admin read leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
