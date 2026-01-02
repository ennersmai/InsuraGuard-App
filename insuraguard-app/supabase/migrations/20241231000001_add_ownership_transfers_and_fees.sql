-- Add ownership transfer tracking table
CREATE TABLE IF NOT EXISTS ownership_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id),
  previous_owner_name TEXT NOT NULL,
  previous_owner_email TEXT NOT NULL,
  new_owner_name TEXT NOT NULL,
  new_owner_email TEXT NOT NULL,
  new_owner_phone TEXT,
  new_owner_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'completed', 'cancelled', 'failed')),
  stripe_session_id TEXT,
  stripe_payment_id TEXT,
  payment_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Add partial unique constraint for pending transfers
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_transfer 
ON ownership_transfers(registration_id) 
WHERE status = 'pending_payment';

-- Add indexes for ownership_transfers
CREATE INDEX IF NOT EXISTS idx_ownership_transfers_registration_id ON ownership_transfers(registration_id);
CREATE INDEX IF NOT EXISTS idx_ownership_transfers_status ON ownership_transfers(status);
CREATE INDEX IF NOT EXISTS idx_ownership_transfers_stripe_session ON ownership_transfers(stripe_session_id);

-- Add columns to registrations table for ownership history and Stripe customer
ALTER TABLE registrations 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS previous_owner_name TEXT,
  ADD COLUMN IF NOT EXISTS previous_owner_email TEXT,
  ADD COLUMN IF NOT EXISTS ownership_transferred_at TIMESTAMPTZ;

-- Add columns to claims table for excess fee tracking (moved to claims migration)

-- Enable RLS on ownership_transfers
ALTER TABLE ownership_transfers ENABLE ROW LEVEL SECURITY;

-- RLS policies for ownership_transfers
CREATE POLICY "Users can view their own transfers" ON ownership_transfers
  FOR SELECT
  USING (
    new_owner_email = auth.jwt() ->> 'email' 
    OR previous_owner_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Service role can manage all transfers" ON ownership_transfers
  FOR ALL
  USING (auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON TABLE ownership_transfers IS 'Tracks ownership transfer requests and their payment status';
COMMENT ON COLUMN ownership_transfers.status IS 'pending_payment: awaiting payment, completed: transfer done, cancelled: user cancelled, failed: payment failed';
COMMENT ON COLUMN registrations.stripe_customer_id IS 'Stripe customer ID for off-session payments (e.g., excess fees)';
