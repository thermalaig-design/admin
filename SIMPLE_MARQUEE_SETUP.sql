-- SIMPLE STEP-BY-STEP SETUP FOR marquee_updates TABLE
-- Copy this ENTIRE script and paste in Supabase SQL Editor, then click RUN

-- ============================================================================
-- STEP 1: CREATE THE TABLE
-- ============================================================================
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

-- ============================================================================
-- STEP 2: REMOVE SECURITY RESTRICTIONS
-- ============================================================================
ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: GIVE PERMISSIONS TO EVERYONE
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO authenticated;

-- ============================================================================
-- STEP 4: ADD YOUR SAMPLE DATA
-- ============================================================================
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

-- ============================================================================
-- VERIFY: Check if table was created successfully
-- ============================================================================
SELECT 'Table created successfully!' as status, COUNT(*) as notification_count FROM public.marquee_updates;
