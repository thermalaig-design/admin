-- Drop the old appointments_status_check constraint
ALTER TABLE appointments 
DROP CONSTRAINT IF EXISTS appointments_status_check;

-- Add the new constraint with 'Rescheduled' status included
ALTER TABLE appointments 
ADD CONSTRAINT appointments_status_check CHECK (
  status IN (
    'Pending',
    'Confirmed',
    'Cancelled',
    'Completed',
    'Rescheduled'
  )
);
