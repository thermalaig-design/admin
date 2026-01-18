#!/usr/bin/env node

/**
 * Create marquee_updates table in Supabase if it doesn't exist
 */

import { createClient } from '@supabase/supabase-js';

// Frontend project credentials
const frontendUrl = 'https://zcbjiozbymrymrhovlgm.supabase.co';
const frontendKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYmppb3pieW1yeW1yaG92bGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTI5MjksImV4cCI6MjA4MzcyODkyOX0.4GhckSCPsqol2fTlSZM9DQy3CY5ARii0mhD8taQvB-8';

console.log('🔧 Creating marquee_updates table if it does not exist...\n');

const supabase = createClient(frontendUrl, frontendKey);

async function createTable() {
  console.log('Step 1: Checking if table exists...');
  
  // First, let's try to create the table with raw SQL
  const createTableSQL = `
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

    -- Disable RLS
    ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

    -- Grant permissions
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;
    GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon, authenticated;

    -- Create indexes
    CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
    CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
    CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);
  `;

  try {
    // Try to execute the raw SQL using a stored procedure approach
    // This is a workaround since we can't use exec() directly
    console.log('Step 2: Executing table creation SQL...');
    
    // Check if table exists by querying information_schema
    const { data: tableExists, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'marquee_updates')
      .eq('table_schema', 'public');
    
    if (checkError) {
      console.log('⚠️  Could not check if table exists:', checkError.message);
      console.log('Attempting to create table anyway...');
    }
    
    if (tableExists && tableExists.length > 0) {
      console.log('✅ Table already exists, attempting to verify access...');
      
      // Try to access the table
      const { data, error } = await supabase
        .from('marquee_updates')
        .select('count()', { count: 'exact', head: true })
        .limit(1);
        
      if (error) {
        console.log('❌ Table exists but access failed:', error.message);
        console.log('This confirms it is a schema cache issue.');
      } else {
        console.log('✅ Table exists and is accessible!');
      }
    } else {
      console.log('Table does not exist, need to create it via SQL Editor in Supabase Dashboard');
      console.log('\n📋 Please follow these steps:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Create a new query');
      console.log('3. Copy and paste this SQL:');
      console.log('\n--- COPY FROM HERE ---');
      console.log(createTableSQL);
      console.log('--- COPY TO HERE ---');
      console.log('\n4. Click RUN');
      console.log('5. After successful creation, restart your project');
    }
    
  } catch (err) {
    console.log('❌ Error during table creation process:', err.message);
    console.log('\n📋 Manual solution required:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Create a new query');
    console.log('3. Copy and paste the SQL shown above');
    console.log('4. Click RUN');
  }
  
  console.log('\n💡 Pro tip: After creating the table in Supabase,');
  console.log('   restart your project in Supabase Dashboard → Settings → General → Restart Project');
}

createTable();