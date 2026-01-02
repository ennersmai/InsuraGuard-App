-- Add excess fee payment tracking columns to claims table
ALTER TABLE claims
  ADD COLUMN IF NOT EXISTS excess_payment_status TEXT DEFAULT 'pending' CHECK (excess_payment_status IN ('pending', 'paid', 'failed', 'waived')),
  ADD COLUMN IF NOT EXISTS excess_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS excess_payment_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS excess_payment_error TEXT;

-- Create index for claims excess payment status
CREATE INDEX IF NOT EXISTS idx_claims_excess_payment_status ON claims(excess_payment_status);
