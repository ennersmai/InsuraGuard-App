-- Add certificate template to admin_templates
INSERT INTO admin_templates (template_type, content, updated_at)
VALUES (
  'certificate_template',
  'CERTIFICATE OF INSURANCE-BACKED GUARANTEE

Unique Reference: {{urn}}

THE INSURED
Name: {{full_name}}
Email: {{email}}
Phone: {{phone}}
Installation Address: {{installation_address}}

SYSTEM DETAILS
System Description: {{system_description}}
System Cost: £{{system_cost}}
Commissioning Date: {{commissioning_date}}
Installer Company: {{installer_company}}
Inverter Serial: {{inverter_serial}}
Battery Serial: {{battery_serial}}

COVERAGE DETAILS
This insurance-backed guarantee protects your clean energy installation for 10 years from the commissioning date. Coverage applies if the original installer ceases to trade. Terms and conditions apply.

Registration Date: {{registration_date}}

---
Digitally Validated',
  NOW()
)
ON CONFLICT (template_type) DO UPDATE
SET content = EXCLUDED.content,
    updated_at = NOW();
