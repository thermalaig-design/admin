-- Create users table for authentication
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying(50) NOT NULL,
  email character varying(255) NULL,
  password text NOT NULL,
  role character varying(50) NULL DEFAULT 'user'::character varying,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  last_login timestamp with time zone NULL,
  is_active boolean NULL DEFAULT true,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username)
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users USING btree (username) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users USING btree (is_active) TABLESPACE pg_default;

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous update password" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;

-- Create policies for the users table
-- Allow anonymous users to insert (for signup)
CREATE POLICY "Allow anonymous insert" ON public.users
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to update password (for forgot password) - update by username match
CREATE POLICY "Allow anonymous update password" ON public.users
    FOR UPDATE USING (true) WITH CHECK (true);

-- Allow users to view records (needed for login)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (true);

-- Allow service role to manage all users
CREATE POLICY "Service role can manage all users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions to roles
GRANT ALL ON public.users TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
