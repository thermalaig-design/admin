# Step-by-Step Visual Guide: Fix Marquee Notifications

## The Problem
Your marquee (notifications) aren't showing because the database table doesn't exist.

```
❌ Error in browser console:
   GET https://zcbjiozbymrymrhovlgm.supabase.co/rest/v1/marquee_updates
   Status: 404 Not Found
```

---

## The Solution (4 Simple Steps)

### STEP 1️⃣: Open Supabase Dashboard

1. Go to https://supabase.com
2. Click your **hospital_management** project
3. You should see this screen:

```
┌─────────────────────────────────┐
│ Dashboard | Tables | SQL Editor │
│                                 │
│ Looking at: hospital_management │
└─────────────────────────────────┘
```

---

### STEP 2️⃣: Go to SQL Editor

Click on **SQL Editor** in the left sidebar:

```
Left Sidebar:
├─ Dashboard
├─ Tables
├─ SQL Editor  ← CLICK HERE
├─ Functions
└─ ...
```

---

### STEP 3️⃣: Create New Query

Click the **New Query** button:

```
┌──────────────────────┐
│ [+ New Query] button │
└──────────────────────┘
```

You'll see an empty SQL editor:

```
┌─────────────────────────────────────┐
│ SQL Editor (Empty)                  │
│                                     │
│ SELECT * FROM users;  ← Clear this  │
│                                     │
│ [Run] button in top right           │
└─────────────────────────────────────┘
```

---

### STEP 4️⃣: Copy & Paste the SQL Script

**Option A: From the repo file (RECOMMENDED)**
1. Open [backend/MARQUEE_TABLE_SETUP.sql](./backend/MARQUEE_TABLE_SETUP.sql) in your code editor
2. Copy ALL the content (from `CREATE TABLE` to the end)
3. Paste into the Supabase SQL Editor

**Option B: Direct copy from below**

Copy everything below and paste:

```sql
-- ============================================================================
-- Create marquee_updates table
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

ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read marquee_updates" ON public.marquee_updates;
DROP POLICY IF EXISTS "Allow authenticated users to insert marquee_updates" ON public.marquee_updates;
DROP POLICY IF EXISTS "Allow authenticated users to update marquee_updates" ON public.marquee_updates;
DROP POLICY IF EXISTS "Allow authenticated users to delete marquee_updates" ON public.marquee_updates;

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;

GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO authenticated;

CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);

SELECT 
  table_name,
  table_schema,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'marquee_updates';

-- OPTIONAL: Add sample data
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

SELECT COUNT(*) as notification_count FROM public.marquee_updates;
SELECT * FROM public.marquee_updates ORDER BY priority ASC;
```

---

### STEP 5️⃣: Click RUN

```
┌─────────────────────────────────────┐
│ SQL Script pasted                   │
│                                     │
│                          [RUN] ← HERE│
└─────────────────────────────────────┘
```

**Wait for completion** - You should see:

```
✅ SUCCESS
- Table created
- Permissions granted
- Indexes created
- Sample data inserted (optional)
```

---

## STEP 6️⃣: Refresh Your App

Go back to your React app and:

**Hard Refresh:**
- **Windows:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

OR

Close and reopen your browser.

---

## Expected Result

After the hard refresh, you should see:

```
┌──────────────────────────────────────┐
│ NOTIFICATIONS                        │
│ Manage system announcements          │
│                                      │
│ [Add] button                         │
│                                      │
│ ✅ Free Cardiac Checkup Camp...      │
│ ✅ New Specialist Dr. Neha Kapoor... │
│ ✅ 24x7 Emergency Helpline...        │
│ ✅ Tele Consultation Services...     │
│ ... (more notifications)             │
└──────────────────────────────────────┘
```

All notifications displaying with:
- Edit button (pencil icon) ✏️
- Delete button (trash icon) 🗑️
- Toggle button (check icon) ✓
- Priority sorting

---

## Troubleshooting

### 📌 Problem: Still seeing 404 errors after refresh

**Solution:**
1. Go to Supabase → Table Editor
2. Look for `marquee_updates` table in the list
3. If NOT there → Run the SQL script again
4. If YES there → Hard refresh browser again (Ctrl+Shift+R)

### 📌 Problem: SQL script shows errors

**Solution:**
- Copy the ENTIRE script from `backend/MARQUEE_TABLE_SETUP.sql`
- Make sure you didn't miss any lines
- Some commands create the table, others fix permissions
- All need to run

### 📌 Problem: Chrome extension errors appearing

**Solution:**
- These are NOT caused by your app
- They're harmless browser extension noise
- They won't affect functionality
- Can be ignored

---

## Verification Checklist

After setup, verify everything works:

- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Can see notifications in home dashboard
- [ ] Can click "Add Notification" button
- [ ] Can create a new notification
- [ ] Can edit existing notifications
- [ ] Can delete notifications
- [ ] Can toggle notification status
- [ ] No 404 errors in browser console

---

## What Each SQL Command Does

| Command | Purpose |
|---------|---------|
| `CREATE TABLE` | Creates the marquee_updates table |
| `ALTER TABLE` | Disables security restrictions (allows public access) |
| `DROP POLICY` | Removes old permission rules |
| `GRANT` | Gives permissions to users |
| `CREATE INDEX` | Makes queries faster |
| `INSERT INTO` | Adds sample notification data |

---

## Files Created for You

- ✅ `backend/MARQUEE_TABLE_SETUP.sql` - The complete SQL script
- ✅ `MARQUEE_FIX_SUMMARY.md` - Technical summary
- ✅ `MARQUEE_SETUP_QUICK_FIX.md` - Detailed setup guide
- ✅ `ERROR_ANALYSIS_AND_FIXES.md` - What was wrong and fixed
- ✅ `VISUAL_SETUP_GUIDE.md` - This file!

---

**That's it! Your marquee notifications will work after following these steps.** 🎉

Need help? Check the other markdown files in the root directory.
