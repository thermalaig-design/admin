# FIX APPOINTMENTS CONSTRAINT ERROR

## Problem
You're getting this error when trying to reschedule appointments:
```
Error: new row for relation "appointments" violates check constraint "appointments_status_check"
```

The "Rescheduled" status is not included in the database constraint, even though your frontend supports it.

## Solution

### Option 1: Using Supabase SQL Editor (RECOMMENDED)

1. Go to your Supabase Dashboard
2. Open the SQL Editor
3. Create a new query and paste this SQL:

```sql
-- Drop the old constraint that doesn't include 'Rescheduled'
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;

-- Add the new constraint that includes 'Rescheduled'
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (
  status IN (
    'Pending',
    'Confirmed',
    'Cancelled',
    'Completed',
    'Rescheduled'
  )
);
```

4. Click "Run" to execute
5. You should see "Success" message
6. Now try rescheduling an appointment again - it should work!

### Option 2: Using psql (if you have access)

```bash
psql postgresql://user:password@your-db-host/your-db << 'EOF'
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (
  status IN (
    'Pending',
    'Confirmed',
    'Cancelled',
    'Completed',
    'Rescheduled'
  )
);
EOF
```

## Verification

After running the SQL, you can verify the constraint exists:

```sql
SELECT constraint_name, constraint_definition 
FROM information_schema.table_constraints 
WHERE table_name = 'appointments' AND constraint_name = 'appointments_status_check';
```

Or check the constraint details:
```sql
SELECT con.conname, pg_get_constraintdef(con.oid)
FROM pg_constraint con
WHERE con.conrelid = 'appointments'::regclass
AND con.conname LIKE '%status%';
```

## What Changed?
- ✅ Added 'Rescheduled' to the list of valid statuses
- ✅ Now appointments can be updated with status='Rescheduled'
- ✅ All other functionality remains the same

## Need Help?
If you still get an error after running the SQL:
1. Check that the SQL ran without errors
2. Make sure you're connected to the right database
3. Try refreshing your app and trying again
