#!/usr/bin/env node

/**
 * Automatic setup script for marquee_updates table
 * Run with: node setup_marquee_simple.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

// Load .env file
let envVars = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Missing environment variables!');
  console.error('Please ensure .env file has:');
  console.error('   VITE_SUPABASE_URL=your_url');
  console.error('   VITE_SUPABASE_ANON_KEY=your_key\n');
  process.exit(1);
}

console.log('\n🔧 Setting up marquee_updates table...\n');

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  try {
    // First, check if table already exists
    console.log('📋 Checking if table exists...');
    const checkResult = await supabase
      .from('marquee_updates')
      .select('id')
      .limit(1);

    if (!checkResult.error) {
      console.log('✅ Table already exists!\n');
      
      // Check how many records
      const countResult = await supabase
        .from('marquee_updates')
        .select('*', { count: 'exact' });
      
      console.log(`📊 Current notifications: ${countResult.count || 0}\n`);
      console.log('✅ Table is ready to use!');
      console.log('\n📝 Go back to your app and press Ctrl+Shift+R to refresh.\n');
      process.exit(0);
    }

    // Table doesn't exist, try to create via raw SQL
    if (checkResult.error?.code === 'PGRST116') {
      console.log('⚠️  Table not found, attempting to create...\n');
      
      // Try to create using Supabase REST API with raw SQL
      console.log('📝 This requires manual setup in Supabase SQL Editor.');
      console.log('\n🔗 Follow these steps:\n');
      console.log('1. Open: https://supabase.com/dashboard');
      console.log('2. Go to your hospital_management project');
      console.log('3. Click: SQL Editor (left sidebar)');
      console.log('4. Click: New Query');
      console.log('5. Copy this SQL and paste it:\n');
      
      // Print the SQL that needs to be run
      const sql = `
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

GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.marquee_updates_id_seq TO authenticated;

CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);

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

SELECT COUNT(*) as total FROM public.marquee_updates;
      `;
      
      console.log(sql);
      console.log('\n6. Click [RUN] button');
      console.log('7. Wait for ✅ Success message');
      console.log('8. Return to your app and press Ctrl+Shift+R\n');
      
      process.exit(1);
    }

    throw checkResult.error;

  } catch (error) {
    console.error('❌ Error:', error?.message);
    console.log('\n📝 Please follow manual setup in Supabase:\n');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. SQL Editor → New Query');
    console.log('3. Copy from: backend/SIMPLE_MARQUEE_SETUP.sql');
    console.log('4. Click [RUN]\n');
    process.exit(1);
  }
}

setup();
