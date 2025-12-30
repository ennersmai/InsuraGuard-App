-- Fix RLS policies to avoid querying auth.users table directly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own registrations" ON registrations;
DROP POLICY IF EXISTS "Users can insert own registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON registrations;

-- Create new policies without querying auth.users
CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin policy using user metadata check
CREATE POLICY "Admins can view all registrations"
  ON registrations FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Drop and recreate admin templates policies
DROP POLICY IF EXISTS "Anyone can read templates" ON admin_templates;
DROP POLICY IF EXISTS "Admins can modify templates" ON admin_templates;

CREATE POLICY "Anyone can read templates"
  ON admin_templates FOR SELECT
  USING (true);

CREATE POLICY "Admins can modify templates"
  ON admin_templates FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
