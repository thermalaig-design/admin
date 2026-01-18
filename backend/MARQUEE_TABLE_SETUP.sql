-- ============================================================================
-- Complete setup for marquee_updates table
-- ============================================================================
-- This script creates the marquee_updates table and configures all permissions
-- Run this in your Supabase SQL Editor to fix the 404 errors
-- ============================================================================

-- Step 1: Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.marquee_updates (
  id serial primary key,
  message text not null,
  is_active boolean default true,
  priority integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by character varying(100),
  updated_by character varying(100)
);

-- Step 2: Disable RLS completely (allows public access)
ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop any existing policies (cleanup)
DROP POLICY IF EXISTS "Allow authenticated users to read marquee_updates" ON public.marquee_updates;
DROP POLICY IF EXISTS "Allow authenticated users to insert marquee_updates" ON public.marquee_updates;
DROP POLICY IF EXISTS "Allow authenticated users to update marquee_updates" ON public.marquee_updates;
DROP POLICY IF EXISTS "Allow authenticated users to delete marquee_updates" ON public.marquee_updates;

-- Step 4: Grant schema usage permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 5: Grant table permissions to anon role (for public read access)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;

-- Step 6: Grant table permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;

-- Step 7: Grant sequence permissions (for id auto-increment)
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO authenticated;

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);

-- Step 9: Verify table exists
SELECT 
  table_name,
  table_schema,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'marquee_updates';

-- ============================================================================
-- OPTIONAL: Insert sample data
-- ============================================================================
-- Uncomment and run this section if you want to add sample notifications

INSERT INTO public.marquee_updates (message, is_active, priority, created_by, created_at)
VALUES 
  ('Free Cardiac Checkup Camp on March 29, 2026', true, 1, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('New Specialist Dr. Neha Kapoor Joined', true, 2, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('24x7 Emergency Helpline: 1800-XXX-XXXX', true, 3, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('Tele Consultation Services Now Available', true, 4, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('Home Delivery of Medicines Available', true, 5, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('Free Health Camp at Main Hospital', true, 6, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('New MRI Machine Installed', true, 7, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('OPD Timings: 9 AM to 5 PM', true, 8, 'admin', '2026-01-15 07:09:23.589977+00'),
  ('Emergency Services Available 24/7', true, 9, 'admin', '2026-01-15 07:09:23.589977+00');

-- Verify data was inserted
SELECT COUNT(*) as notification_count FROM public.marquee_updates;
SELECT * FROM public.marquee_updates ORDER BY priority ASC;
