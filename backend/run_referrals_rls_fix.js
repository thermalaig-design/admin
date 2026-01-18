import process from 'process';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables. Please check your .env file.');
  console.error('Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Alternative approach: Execute statements individually using Supabase edge functions or stored procedures
// Since direct SQL execution isn't supported in client-side Supabase, we'll need to implement the policy changes manually
async function updateReferralsPoliciesManually() {
  console.log('Updating referrals RLS policies manually...');
  
  // This would typically be done in Supabase dashboard or via database migration
  // For now, we'll log what needs to be done
  
  console.log(`
  Please run these commands in your Supabase SQL Editor (Database -> SQL Editor):
  
  -- Fix RLS policies for referrals table to allow service role access
  -- This will enable admin panel to view all referrals

  -- Drop existing policies that might conflict
  DROP POLICY IF EXISTS "Users can view their own referrals" ON referrals;
  DROP POLICY IF EXISTS "Service role can access all referrals" ON referrals;

  -- Create new policy to allow service role to access all referrals
  CREATE POLICY "Service role can access all referrals"
      ON referrals FOR ALL
      USING (auth.role() = 'service_role');

  -- Create policy to allow users to access their own referrals
  CREATE POLICY "Users can view their own referrals"
      ON referrals FOR SELECT
      USING (
          auth.uid()::text = user_id 
          OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
      );

  -- Create policy to allow users to insert their own referrals
  CREATE POLICY "Users can insert their own referrals"
      ON referrals FOR INSERT
      WITH CHECK (
          auth.uid()::text = user_id 
          OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
      );

  -- Create policy to allow service role and users to update referrals
  CREATE POLICY "Users and service role can update referrals"
      ON referrals FOR UPDATE
      USING (
          auth.uid()::text = user_id 
          OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
          OR auth.role() = 'service_role'
      );

  -- Create policy to allow service role and users to delete referrals
  CREATE POLICY "Users and service role can delete referrals"
      ON referrals FOR DELETE
      USING (
          auth.uid()::text = user_id 
          OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
          OR auth.role() = 'service_role'
      );
  `);
}

// Run the manual update approach
updateReferralsPoliciesManually()
  .then(() => {
    console.log('Process completed. Please execute the SQL commands in your Supabase dashboard.');
  })
  .catch(console.error);