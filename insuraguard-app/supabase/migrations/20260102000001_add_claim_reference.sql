-- Add claim_reference column to claims table
ALTER TABLE claims
  ADD COLUMN IF NOT EXISTS claim_reference TEXT UNIQUE;

-- Create index for claim reference lookups
CREATE INDEX IF NOT EXISTS idx_claims_claim_reference ON claims(claim_reference);

-- Function to generate claim reference
CREATE OR REPLACE FUNCTION generate_claim_reference()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  random_part TEXT;
  new_reference TEXT;
  reference_exists BOOLEAN;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  LOOP
    -- Generate 4 random uppercase alphanumeric characters
    random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    new_reference := 'CLM-' || date_part || '-' || random_part;
    
    -- Check if reference already exists
    SELECT EXISTS(SELECT 1 FROM claims WHERE claim_reference = new_reference) INTO reference_exists;
    
    -- If unique, return it
    IF NOT reference_exists THEN
      RETURN new_reference;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate claim reference on insert
CREATE OR REPLACE FUNCTION set_claim_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.claim_reference IS NULL THEN
    NEW.claim_reference := generate_claim_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_claim_reference
  BEFORE INSERT ON claims
  FOR EACH ROW
  EXECUTE FUNCTION set_claim_reference();
