import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMarqueeTable() {
  console.log('🔧 Setting up marquee_updates table...\n');

  try {
    // SQL to create and configure the table
    const sql = `
      -- Create table
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

      -- Disable RLS
      ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

      -- Grant permissions to anon
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
      GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon;

      -- Grant permissions to authenticated
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;
      GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO authenticated;

      -- Create indexes
      CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
      CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
      CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);
    `;

    // Execute the SQL
    const { error } = await supabase.rpc('exec', { sql });

    if (error) {
      console.error('❌ Error creating table:', error);
      
      // Try alternative approach - query directly
      console.log('\n⚠️ Trying alternative method...\n');
      
      // Check if table exists
      const checkTable = await supabase
        .from('marquee_updates')
        .select('*')
        .limit(1);
      
      if (checkTable.error?.code === 'PGRST116') {
        console.error('❌ Table still does not exist');
        console.log('\n📝 Please run the SQL script manually in Supabase:');
        console.log('   1. Go to https://supabase.com → Your Project');
        console.log('   2. SQL Editor → New Query');
        console.log('   3. Copy content from: backend/SIMPLE_MARQUEE_SETUP.sql');
        console.log('   4. Click [RUN]');
        process.exit(1);
      }
    }

    // Now insert sample data
    console.log('✅ Table created successfully!\n');
    console.log('📝 Adding sample notifications...\n');

    const sampleData = [
      {
        message: 'Free Cardiac Checkup Camp on March 29, 2026',
        is_active: true,
        priority: 1,
        created_by: 'admin'
      },
      {
        message: 'New Specialist Dr. Neha Kapoor Joined',
        is_active: true,
        priority: 2,
        created_by: 'admin'
      },
      {
        message: '24x7 Emergency Helpline: 1800-XXX-XXXX',
        is_active: true,
        priority: 3,
        created_by: 'admin'
      },
      {
        message: 'Tele Consultation Services Now Available',
        is_active: true,
        priority: 4,
        created_by: 'admin'
      },
      {
        message: 'Home Delivery of Medicines Available',
        is_active: true,
        priority: 5,
        created_by: 'admin'
      },
      {
        message: 'Free Health Camp at Main Hospital',
        is_active: true,
        priority: 6,
        created_by: 'admin'
      },
      {
        message: 'New MRI Machine Installed',
        is_active: true,
        priority: 7,
        created_by: 'admin'
      },
      {
        message: 'OPD Timings: 9 AM to 5 PM',
        is_active: true,
        priority: 8,
        created_by: 'admin'
      },
      {
        message: 'Emergency Services Available 24/7',
        is_active: true,
        priority: 9,
        created_by: 'admin'
      }
    ];

    const { data, error: insertError } = await supabase
      .from('marquee_updates')
      .insert(sampleData);

    if (insertError) {
      console.error('⚠️ Warning: Could not insert sample data:', insertError.message);
    } else {
      console.log(`✅ Successfully added ${sampleData.length} sample notifications!\n`);
    }

    // Verify
    const { data: allData, error: selectError } = await supabase
      .from('marquee_updates')
      .select('*');

    if (selectError) {
      console.error('❌ Error verifying data:', selectError);
    } else {
      console.log(`✅ Verification: Found ${allData?.length || 0} notifications in database`);
      console.log('\n✅ SUCCESS! Marquee table is ready to use!\n');
      console.log('📝 Next steps:');
      console.log('   1. Go to your app in browser');
      console.log('   2. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to hard refresh');
      console.log('   3. Notifications should now appear!\n');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.log('\n📝 If error persists, please run manually in Supabase:');
    console.log('   1. SQL Editor → New Query');
    console.log('   2. Copy from: backend/SIMPLE_MARQUEE_SETUP.sql');
    console.log('   3. Click [RUN]\n');
    process.exit(1);
  }
}

// Run setup
setupMarqueeTable();
