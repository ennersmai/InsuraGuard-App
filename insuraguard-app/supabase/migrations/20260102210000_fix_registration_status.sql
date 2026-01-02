-- Change default status from 'active' to 'pending'
ALTER TABLE registrations 
ALTER COLUMN status SET DEFAULT 'pending';

-- Update existing test registrations with pending payment to have pending status
UPDATE registrations
SET status = 'pending'
WHERE payment_status = 'pending';

-- Update registrations with completed payment to have active status
UPDATE registrations
SET status = 'active'
WHERE payment_status = 'completed';

-- Add comment
COMMENT ON COLUMN registrations.status IS 'Registration status: pending (awaiting payment), active (paid), cancelled, or expired';
