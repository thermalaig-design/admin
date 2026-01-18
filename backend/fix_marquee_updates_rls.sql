-- Fix marquee_updates table RLS issue
-- This script disables RLS on marquee_updates to allow public access via PostgREST API

-- Step 1: Disable RLS on marquee_updates table
ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant permissions to anon role (for public access)
GRANT SELECT ON public.marquee_updates TO anon;
GRANT INSERT ON public.marquee_updates TO anon;
GRANT UPDATE ON public.marquee_updates TO anon;
GRANT DELETE ON public.marquee_updates TO anon;

-- Step 3: Grant permissions to authenticated role
GRANT SELECT ON public.marquee_updates TO authenticated;
GRANT INSERT ON public.marquee_updates TO authenticated;
GRANT UPDATE ON public.marquee_updates TO authenticated;
GRANT DELETE ON public.marquee_updates TO authenticated;
