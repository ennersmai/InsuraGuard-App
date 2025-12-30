-- Fix admin RLS policy to check user_metadata instead of role claim
-- The admin role is stored in raw_user_meta_data which maps to user_metadata in JWT

-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can view all registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can modify templates" ON admin_templates;

-- Create new admin policy checking user_metadata
CREATE POLICY "Admins can view all registrations"
  ON registrations FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can modify templates"
  ON admin_templates FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
