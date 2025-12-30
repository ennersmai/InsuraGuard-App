-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- URN (Unique Reference Number)
  urn TEXT UNIQUE NOT NULL,
  
  -- Customer Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  installation_address TEXT NOT NULL,
  
  -- System Info
  system_description TEXT NOT NULL,
  system_cost DECIMAL(10,2) NOT NULL,
  commissioning_date DATE NOT NULL,
  
  -- Installer Info
  installer_company TEXT NOT NULL,
  inverter_serial TEXT,
  battery_serial TEXT,
  
  -- Documents
  document_urls TEXT[],
  
  -- Payment
  stripe_payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  
  -- PDF
  pdf_url TEXT,
  
  -- Metadata
  registration_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin templates table
CREATE TABLE admin_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_type TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_registrations_urn ON registrations(urn);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);

-- RLS Policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Users can only view their own registrations
CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own registrations
CREATE POLICY "Users can insert own registrations"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON registrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin templates RLS
ALTER TABLE admin_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read templates
CREATE POLICY "Anyone can read templates"
  ON admin_templates FOR SELECT
  USING (true);

-- Only admins can modify templates
CREATE POLICY "Admins can modify templates"
  ON admin_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default templates
INSERT INTO admin_templates (template_type, content) VALUES
('pdf_legal_text', 'This insurance-backed guarantee protects your clean energy installation for 10 years from the commissioning date. Coverage applies if the original installer ceases to trade. Terms and conditions apply.'),
('claim_form', '# InsuraGuard Claim Form\n\nPlease complete this form to submit a claim.\n\n**Your Details:**\n- Name: _______________\n- URN: _______________\n- Email: _______________\n- Phone: _______________\n\n**Claim Details:**\n- Date of Issue: _______________\n- Description: _______________\n\nSubmit to: claims@insuraguard.com'),
('dsar_form', '# Data Subject Access Request Form\n\nTo request access to your personal data held by InsuraGuard, please complete:\n\n**Your Details:**\n- Full Name: _______________\n- Email: _______________\n- URN (if applicable): _______________\n\n**Request Type:**\n- [ ] Access to my data\n- [ ] Correction of my data\n- [ ] Deletion of my data\n- [ ] Data portability\n\nSubmit to: privacy@insuraguard.com'),
('underwriter_info', 'Underwritten by [Underwriter Name]\nAuthorized and regulated by the Financial Conduct Authority (FCA)\nRegistration Number: XXXXXX');
