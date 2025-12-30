-- Add certificate_generated column to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS certificate_generated BOOLEAN DEFAULT false;
