import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fixAppointmentsConstraint() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing environment variables:');
      console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
      console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
      console.error('\nPlease add these to your .env file');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔄 Fixing appointments status constraint...\n');

    // Step 1: Drop the old constraint
    console.log('Step 1: Dropping old constraint...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;`
    }).catch(err => ({ error: err }));

    if (dropError && dropError.message && !dropError.message.includes('does not exist')) {
      console.error('❌ Error dropping constraint:', dropError);
      // Continue anyway as constraint might not exist in some cases
    } else {
      console.log('✅ Old constraint dropped (or didn\'t exist)');
    }

    // Step 2: Add the new constraint with Rescheduled status
    console.log('\nStep 2: Adding new constraint with Rescheduled status...');
    const { error: addError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (
        status IN (
          'Pending',
          'Confirmed',
          'Cancelled',
          'Completed',
          'Rescheduled'
        )
      );`
    }).catch(err => ({ error: err }));

    if (addError) {
      console.error('❌ Error adding constraint:', addError);
      process.exit(1);
    }

    console.log('✅ New constraint added successfully!');
    console.log('\n✅ ✅ ✅ Appointments constraint fixed! ✅ ✅ ✅');
    console.log('\nYou can now reschedule appointments without errors.');

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

fixAppointmentsConstraint();
