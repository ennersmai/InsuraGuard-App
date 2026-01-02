-- Add pricing_tier column to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS pricing_tier TEXT;

-- Add comment
COMMENT ON COLUMN registrations.pricing_tier IS 'Selected pricing tier: 0-12, 12-24, 24-36, or 36-48';
