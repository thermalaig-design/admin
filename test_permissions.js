#!/usr/bin/env node

/**
 * Test table permissions and RLS configuration
 */

import { createClient } from '@supabase/supabase-js';

// Frontend project credentials
const frontendUrl = 'https://zcbjiozbymrymrhovlgm.supabase.co';
const frontendKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYmppb3pieW1yeW1yaG92bGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTI5MjksImV4cCI6MjA4MzcyODkyOX0.4GhckSCPsqol2fTlSZM9DQy3CY5ARii0mhD8taQvB-8';

console.log('🔍 Testing table permissions and access...\n');

const supabase = createClient(frontendUrl, frontendKey);

async function testPermissions() {
  console.log('1. Testing basic table access...');
  
  try {
    const { data, error } = await supabase
      .from('marquee_updates')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Select error:', error.message);
      console.log('   Code:', error.code);
      if (error.hint) {
        console.log('   Hint:', error.hint);
      }
    } else {
      console.log('✅ Select works! Found records:', data?.length || 0);
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
  
  console.log('\n2. Testing table metadata...');
  
  try {
    // Try to get table info from information_schema
    const { data, error } = await supabase
      .rpc('exec', {
        sql: `SELECT table_name, table_schema 
              FROM information_schema.tables 
              WHERE table_name = 'marquee_updates'`
      });
      
    if (error) {
      console.log('❌ Metadata query error:', error.message);
    } else {
      console.log('✅ Table metadata:', data);
    }
  } catch (err) {
    console.log('❌ Metadata error:', err.message);
  }
  
  console.log('\n3. Testing with different query patterns...');
  
  // Test various query approaches
  const queries = [
    { desc: 'Simple select *', query: () => supabase.from('marquee_updates').select('*') },
    { desc: 'Count query', query: () => supabase.from('marquee_updates').select('count()', { count: 'exact', head: true }) },
    { desc: 'Specific columns', query: () => supabase.from('marquee_updates').select('id,message,is_active') }
  ];
  
  for (const { desc, query } of queries) {
    try {
      const { data, error } = await query();
      if (error) {
        console.log(`❌ ${desc}:`, error.message);
      } else {
        console.log(`✅ ${desc}: Success`);
      }
    } catch (err) {
      console.log(`❌ ${desc}:`, err.message);
    }
  }
}

testPermissions();