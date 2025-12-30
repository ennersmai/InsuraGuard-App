-- Expand claims table to include all form fields
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS installation_address TEXT,
ADD COLUMN IF NOT EXISTS postcode TEXT,
ADD COLUMN IF NOT EXISTS system_type_solar_pv BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS system_type_battery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS system_type_solar_thermal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS system_type_other TEXT,
ADD COLUMN IF NOT EXISTS installer_company TEXT,
ADD COLUMN IF NOT EXISTS installer_contact TEXT,
ADD COLUMN IF NOT EXISTS installation_date TEXT,
ADD COLUMN IF NOT EXISTS system_size TEXT,
ADD COLUMN IF NOT EXISTS inverter_serial TEXT,
ADD COLUMN IF NOT EXISTS battery_serial TEXT,
ADD COLUMN IF NOT EXISTS issue_first_noticed TEXT,
ADD COLUMN IF NOT EXISTS installer_contacted_date TEXT,
ADD COLUMN IF NOT EXISTS installer_ceased_trading TEXT,
ADD COLUMN IF NOT EXISTS cessation_evidence TEXT,
ADD COLUMN IF NOT EXISTS issue_affected_performance BOOLEAN,
ADD COLUMN IF NOT EXISTS performance_impact TEXT,
ADD COLUMN IF NOT EXISTS system_status TEXT,
ADD COLUMN IF NOT EXISTS contacted_installer BOOLEAN,
ADD COLUMN IF NOT EXISTS installer_contact_details TEXT,
ADD COLUMN IF NOT EXISTS obtained_quotes BOOLEAN,
ADD COLUMN IF NOT EXISTS temporary_repairs BOOLEAN,
ADD COLUMN IF NOT EXISTS temporary_repairs_details TEXT,
ADD COLUMN IF NOT EXISTS declaration_accepted BOOLEAN DEFAULT false;

-- Rename claim_description to nature_of_issue for clarity
ALTER TABLE claims RENAME COLUMN claim_description TO nature_of_issue;
