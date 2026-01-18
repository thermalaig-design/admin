#!/usr/bin/env node

/**
 * Setup marquee_updates table for the frontend Supabase project
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

// Load .env file
let supabaseUrl, supabaseKey;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env\n');
  process.exit(1);
}

console.log('\n🔧 Setting up marquee_updates table...');
console.log(`📍 Project: ${supabaseUrl.split('https://')[1].split('.')[0]}\n`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  try {
    // Check if table exists
    console.log('📋 Checking if table exists...');
    const { data, error: selectError } = await supabase
      .from('marquee_updates')
      .select('id')
      .limit(1);

    if (!selectError) {
      console.log('✅ Table already exists!\n');
      
      // Count records
      const { count } = await supabase
        .from('marquee_updates')
        .select('*', { count: 'exact' });
      
      console.log(`📊 Current notifications: ${count || 0}\n`);
      console.log('✨ Ready to use! Refresh your browser.\n');
      process.exit(0);
    }

    if (selectError?.code === 'PGRST116') {
      console.log('❌ Table not found - manual setup required\n');
      console.log('📝 Please follow these steps:\n');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Select your "hospital_management" project');
      console.log('3. Go to: SQL Editor (left sidebar)');
      console.log('4. Click: New Query');
      console.log('5. Copy & paste this SQL:\n');
      console.log('─'.repeat(70));
      
      const sql = `-- Create marquee_updates table
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

-- Disable RLS for easier access (can be secured later)
ALTER TABLE public.marquee_updates DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon, authenticated;

-- Create indexes
CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);`;
      
      console.log(sql);
      console.log('─'.repeat(70));
      console.log('\n6. Click: Run');
      console.log('7. Return here and run this script again\n');
      process.exit(1);
    }

    console.error('❌ Unexpected error:', selectError);
    process.exit(1);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setup();
