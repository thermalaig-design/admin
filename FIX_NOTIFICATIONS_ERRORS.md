# Fix Notifications/Marquee Errors - Quick Guide

## ❌ Problem
Your application is showing this error:
```
Could not find the table 'public.marquee_updates' in the schema cache
GET https://zcbjiozbymrymrhovlgm.supabase.co/rest/v1/marquee_updates 404 (Not Found)
```

## ✅ Solution

### Step 1: Go to Supabase Dashboard
1. Open: **https://supabase.com/dashboard**
2. Click on your **hospital_management** project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Create the Table
Copy the entire SQL below and paste it into the Supabase SQL Editor:

```sql
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

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon, authenticated;

-- Create indexes
CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);

-- Insert sample data
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

-- Verify
SELECT COUNT(*) as total_notifications FROM public.marquee_updates;
```

### Step 3: Run the Query
1. Click **Run** button (or press Ctrl+Enter)
2. Wait for success message
3. You should see "total_notifications: 9" at the bottom

### Step 4: Test Your App
1. Go back to your application browser tab
2. Press **Ctrl+Shift+R** (hard refresh)
3. The notifications should now load without errors

## 📋 File References

- **SQL Setup**: [SETUP_MARQUEE_TABLE.sql](SETUP_MARQUEE_TABLE.sql)
- **Notifications API**: [src/services/notificationsApi.js](src/services/notificationsApi.js)
- **Notifications Component**: [src/admin/components/NotificationsSection.jsx](src/admin/components/NotificationsSection.jsx)

## 🚀 Verification

After setup, you should see:
- ✅ 9 notifications loading in the admin panel
- ✅ No 404 errors in console
- ✅ Ability to add/edit/delete notifications
- ✅ Ability to toggle active/inactive status

## ❓ If it still doesn't work

1. **Check your Supabase project URL**:
   - Should be: `https://zcbjiozbymrymrhovlgm.supabase.co`
   - Check in your `.env` file for `VITE_SUPABASE_URL`

2. **Hard refresh your browser**:
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

3. **Check database permissions**:
   - Go to Supabase Dashboard → Tables → marquee_updates
   - Verify RLS is disabled or policies are set correctly

4. **Check for table with different schema**:
   - Go to Supabase SQL Editor
   - Run: `SELECT * FROM information_schema.tables WHERE table_name = 'marquee_updates';`
