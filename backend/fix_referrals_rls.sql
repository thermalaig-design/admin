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