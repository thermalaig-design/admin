import { supabase } from './backend/config/supabase.js';

async function testSponsorsTable() {
  console.log('Testing sponsors table access...');
  
  try {
    // Test fetching all sponsors
    const { data, error } = await supabase
      .from('sponsors')
      .select('*');
    
    if (error) {
      console.error('Error fetching sponsors:', error);
      return;
    }
    
    console.log('Sponsors found:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('Sample sponsor data:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('No sponsors found in the database.');
    }
  } catch (err) {
    console.error('Error in testSponsorsTable:', err);
  }
}

testSponsorsTable();