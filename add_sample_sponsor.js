import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import process from 'process';

dotenv.config(); // Load environment variables from .env file

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables in .env file');
  console.log('SUPABASE_URL:', !!supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  process.exit(1);
}

// Use the service role key for direct database access
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function addSampleSponsor() {
  try {
    console.log('Adding sample sponsor...');
    
    // Sample sponsor data
    const sampleSponsor = {
      name: 'ABC Healthcare Solutions',
      position: 'Premium Healthcare Partner',
      positions: ['Healthcare Partner', 'Medical Equipment Supplier'],
      about: 'Leading provider of medical equipment and healthcare solutions with over 10 years of experience.',
      photo_url: 'https://via.placeholder.com/150x150/4f46e5/ffffff?text=ABC+Logo',
      is_active: true,
      priority: 10,
      created_by: 'system'
    };

    const { data, error } = await supabase
      .from('sponsors')
      .insert([sampleSponsor])
      .select()
      .single();

    if (error) {
      console.error('Error adding sponsor:', error);
      // Try to check if the table exists
      const { error: tableError } = await supabase.from('sponsors').select('id').limit(1);
      if (tableError && tableError.code === '42P01') {
        console.error('Table "sponsors" does not exist in Supabase.');
        console.log('You may need to create the sponsors table first.');
      }
      return;
    }

    console.log('Sample sponsor added successfully:', data);
    console.log('Sponsor ID:', data.id);
  } catch (error) {
    console.error('Error in addSampleSponsor:', error);
  }
}

// Run the function
addSampleSponsor();