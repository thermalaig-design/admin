#!/usr/bin/env node

/**
 * Test both Supabase projects to see which one has the marquee_updates table
 */

import { createClient } from '@supabase/supabase-js';

// Frontend project
const frontendUrl = 'https://zcbjiozbymrymrhovlgm.supabase.co';
const frontendKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYmppb3pieW1yeW1yaG92bGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTI5MjksImV4cCI6MjA4MzcyODkyOX0.4GhckSCPsqol2fTlSZM9DQy3CY5ARii0mhD8taQvB-8';

// Backend project  
const backendUrl = 'https://gskzafarbzhdcgvrrkdc.supabase.co';
const backendKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdza3phZmFyYnpoZGNndnJya2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODQwMzIsImV4cCI6MjA4MjY2MDAzMn0.dRlyyK0f5OnK76mv2yRMhI7YWqY1AJ-99JJga9QL9SI';

console.log('🔍 Testing both Supabase projects for marquee_updates table...\n');

// Test frontend project
async function testFrontend() {
  console.log('📱 Testing Frontend Project:');
  console.log('URL:', frontendUrl);
  
  const supabase = createClient(frontendUrl, frontendKey);
  
  try {
    const { data, error } = await supabase
      .from('marquee_updates')
      .select('count()', { count: 'exact', head: true });
      
    if (error) {
      console.log('❌ Frontend project error:', error.message);
      if (error.code === 'PGRST205') {
        console.log('   📍 Table does not exist in frontend project\n');
      }
    } else {
      console.log('✅ Frontend project: Table exists!\n');
    }
  } catch (err) {
    console.log('❌ Frontend project connection error:', err.message, '\n');
  }
}

// Test backend project
async function testBackend() {
  console.log('⚙️  Testing Backend Project:');
  console.log('URL:', backendUrl);
  
  const supabase = createClient(backendUrl, backendKey);
  
  try {
    const { data, error } = await supabase
      .from('marquee_updates')
      .select('count()', { count: 'exact', head: true });
      
    if (error) {
      console.log('❌ Backend project error:', error.message);
      if (error.code === 'PGRST205') {
        console.log('   📍 Table does not exist in backend project\n');
      }
    } else {
      console.log('✅ Backend project: Table exists!\n');
    }
  } catch (err) {
    console.log('❌ Backend project connection error:', err.message, '\n');
  }
}

// Run both tests
async function runTests() {
  await testFrontend();
  await testBackend();
  
  console.log('💡 Solution:');
  console.log('If table exists in backend but not frontend:');
  console.log('   1. Copy the SUPABASE_URL and SUPABASE_ANON_KEY from backend/.env');
  console.log('   2. Paste them into the frontend .env file');
  console.log('   3. Or create the table in the frontend project');
}

runTests();