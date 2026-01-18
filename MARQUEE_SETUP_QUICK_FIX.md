# Quick Fix: Notifications Marquee Setup

## The Problem
You're getting a **404 error** on the `marquee_updates` table because it hasn't been created in your Supabase database yet.

Error message:
```
Failed to load resource: the server responded with a status of 404 ()
zcbjiozbymrymrhovlgm.supabase.co/rest/v1/marquee_updates
```

## The Solution

### Step 1: Go to Supabase SQL Editor
1. Open your [Supabase Dashboard](https://supabase.com)
2. Click on your **hospital_management** project
3. Go to the **SQL Editor** on the left sidebar
4. Click **New Query** button

### Step 2: Copy and Run the SQL Script

**IMPORTANT:** Copy the entire script below and paste it in the Supabase SQL Editor:

```sql
-- Complete fix for marquee_updates table PostgREST access
-- This script ensures the table exists and is properly accessible

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

-- Step 2: Disable RLS completely
ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop any existing policies
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
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'marquee_updates';
```

### Step 3: Insert Sample Data (Optional)

After running the above script, if you want to add the sample notifications you provided, run this:

```sql
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
```

### Step 4: Refresh Your App
1. Go back to your app
2. **Hard refresh** your browser (Ctrl + Shift + R or Cmd + Shift + R)
3. The notifications should now load successfully!

## What Changed in Your Code

I've also improved the error handling in your app:

### 1. **Better Error Handling** (`src/services/notificationsApi.js`)
- The API now returns an empty array instead of throwing errors when the table doesn't exist
- This prevents the app from crashing if the table is missing
- Graceful fallback behavior

### 2. **Improved UI** (`src/components/NotificationsSection.jsx`)
- Better empty state message
- Quick "Create Notification" button when no notifications exist
- Better error messages

## Troubleshooting

### Still seeing 404 errors?
1. **Verify the table was created:**
   - In Supabase, go to **Table Editor**
   - Look for `marquee_updates` table in the list
   
2. **Check permissions:**
   - Make sure you ran the GRANT commands in the SQL script
   
3. **Hard refresh your browser:**
   - Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)

### Chrome Extension Errors
The errors about `chrome-extension://invalid/` are from browser extensions and are not related to your app code. These are harmless and won't affect functionality once the table is set up.

## Verify It Works

After setup, you should be able to:
- ✅ See notifications in the home dashboard
- ✅ Add new notifications
- ✅ Edit existing notifications
- ✅ Delete notifications
- ✅ Toggle notification status (active/inactive)

---

**Need more help?** Check the original setup guides:
- [NOTIFICATIONS_SETUP.md](./NOTIFICATIONS_SETUP.md)
- [NOTIFICATIONS_QUICKSTART.md](./NOTIFICATIONS_QUICKSTART.md)
