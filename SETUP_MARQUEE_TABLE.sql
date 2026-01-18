-- ============================================
-- Marquee Updates / Notifications Table Setup
-- ============================================
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard

-- Create the marquee_updates table
CREATE TABLE IF NOT EXISTS public.marquee_updates (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(100),
  updated_by VARCHAR(100)
);

-- Disable RLS for easier access
ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

-- Grant permissions to both anon and authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);

-- Insert sample data (optional)
INSERT INTO public.marquee_updates (message, is_active, priority, created_by) VALUES
  ('Free Cardiac Checkup Camp on March 29, 2026', true, 1, 'admin'),
  ('New Specialist Dr. Neha Kapoor Joined', true, 2, 'admin'),
  ('24x7 Emergency Helpline: 1800-XXX-XXXX', true, 3, 'admin'),
  ('Tele Consultation Services Now Available', true, 4, 'admin'),
  ('Home Delivery of Medicines Available', true, 5, 'admin'),
  ('Free Health Camp at Main Hospital', true, 6, 'admin'),
  ('New MRI Machine Installed', true, 7, 'admin'),
  ('OPD Timings: 9 AM to 5 PM', true, 8, 'admin'),
  ('Emergency Services Available 24/7', true, 9, 'admin')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT COUNT(*) as total_notifications FROM public.marquee_updates;
