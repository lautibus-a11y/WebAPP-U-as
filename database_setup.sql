
-- ======================================================
-- BELLEZZA BY NAOMI - EMERGENCY DB RESET & PERMISSIONS
-- ======================================================

-- Disable RLS on all tables to bypass security policies during admin operations
ALTER TABLE IF EXISTS appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS servicios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gallery DISABLE ROW LEVEL SECURITY;

-- Ensure public access for management (simplifies the admin panel)
GRANT ALL ON TABLE appointments TO anon, authenticated, postgres;
GRANT ALL ON TABLE servicios TO anon, authenticated, postgres;
GRANT ALL ON TABLE gallery TO anon, authenticated, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres;

-- Add necessary columns if missing
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS end_time TIME;

-- Clean up any conflicting policies
DROP POLICY IF EXISTS "Public access" ON appointments;
DROP POLICY IF EXISTS "Public access" ON servicios;
DROP POLICY IF EXISTS "Public access" ON gallery;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
