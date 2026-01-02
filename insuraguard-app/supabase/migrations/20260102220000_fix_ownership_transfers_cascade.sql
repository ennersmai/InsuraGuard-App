-- Drop the existing foreign key constraint
ALTER TABLE ownership_transfers 
DROP CONSTRAINT IF EXISTS ownership_transfers_registration_id_fkey;

-- Add the foreign key constraint with CASCADE delete
ALTER TABLE ownership_transfers 
ADD CONSTRAINT ownership_transfers_registration_id_fkey 
FOREIGN KEY (registration_id) 
REFERENCES registrations(id) 
ON DELETE CASCADE;

-- Add comment
COMMENT ON CONSTRAINT ownership_transfers_registration_id_fkey ON ownership_transfers IS 'Cascades delete when registration is deleted';
