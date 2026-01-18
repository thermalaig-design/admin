#!/usr/bin/env node

/**
 * Force refresh Supabase schema cache and verify table access
 */

import { createClient } from '@supabase/supabase-js';

// Frontend project credentials
const frontendUrl = 'https://zcbjiozbymrymrhovlgm.supabase.co';
const frontendKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYmppb3pieW1yeW1yaG92bGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTI5MjksImV4cCI6MjA4MzcyODkyOX0.4GhckSCPsqol2fTlSZM9DQy3CY5ARii0mhD8taQvB-8';

console.log('🔄 Attempting to force refresh Supabase schema cache...\n');

const supabase = createClient(frontendUrl, frontendKey);

async function forceRefreshSchema() {
  console.log('1. Testing current table access...');
  
  try {
    const { data, error } = await supabase
      .from('marquee_updates')
      .select('count()', { count: 'exact', head: true });
      
    if (error) {
      console.log('❌ Current access failed:', error.message);
    } else {
      console.log('✅ Current access works! Count:', data?.length || 0);
      return true;
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
  
  console.log('\n2. Attempting schema refresh workaround...');
  
  // Try a different approach - use raw SQL to force cache refresh
  try {
    // This query forces PostgREST to re-read the schema
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.log('❌ Version check failed:', error.message);
    } else {
      console.log('✅ PostgREST is responsive');
    }
  } catch (err) {
    console.log('❌ Version check error:', err.message);
  }
  
  console.log('\n3. Trying alternative table access methods...');
  
  // Try accessing via information_schema
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'marquee_updates')
      .eq('table_schema', 'public');
      
    if (error) {
      console.log('❌ Information schema query failed:', error.message);
    } else {
      console.log('✅ Table found in information_schema:', data?.length > 0 ? 'YES' : 'NO');
      if (data?.length > 0) {
        console.log('   Table details:', data[0]);
      }
    }
  } catch (err) {
    console.log('❌ Information schema error:', err.message);
  }
  
  console.log('\n4. Final verification attempt...');
  
  // One more try with the original query
  setTimeout(async () => {
    try {
      const { data, error } = await supabase
        .from('marquee_updates')
        .select('*')
        .limit(1);
        
      if (error) {
        console.log('❌ Still failing:', error.message);
        console.log('\n🔧 Recommended Solutions:');
        console.log('   1. Go to Supabase Dashboard → Settings → General → Restart Project');
        console.log('   2. Or delete and recreate the marquee_updates table');
        console.log('   3. Or contact Supabase support about schema cache issue');
      } else {
        console.log('✅ Success! Table is now accessible');
        console.log('   Found records:', data?.length || 0);
      }
    } catch (err) {
      console.log('❌ Final attempt failed:', err.message);
    }
  }, 2000); // Wait 2 seconds before final attempt
}

forceRefreshSchema();