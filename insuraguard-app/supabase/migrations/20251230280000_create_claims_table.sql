-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  urn TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  claim_description TEXT NOT NULL,
  document_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Users can view their own claims
CREATE POLICY "Users can view their own claims"
ON claims FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own claims
CREATE POLICY "Users can create claims"
ON claims FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view all claims
CREATE POLICY "Admins can view all claims"
ON claims FOR SELECT
TO authenticated
USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- Admins can update claims
CREATE POLICY "Admins can update claims"
ON claims FOR UPDATE
TO authenticated
USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS claims_user_id_idx ON claims(user_id);
CREATE INDEX IF NOT EXISTS claims_urn_idx ON claims(urn);
CREATE INDEX IF NOT EXISTS claims_status_idx ON claims(status);
