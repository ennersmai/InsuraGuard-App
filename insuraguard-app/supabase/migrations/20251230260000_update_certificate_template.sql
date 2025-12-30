-- Update certificate template with full structure
UPDATE admin_templates 
SET content = 'CERTIFICATE OF INSURANCE-BACKED GUARANTEE

Unique Reference: {{urn}}

THE INSURED
---
Policyholder Name: {{full_name}}
Installation Address: {{installation_address}}
Registration Date: {{registration_date}}
System Details: {{system_description}}

COVERAGE SUMMARY
---
Period of Cover: 10 years from {{commissioning_date}} to {{coverage_end_date}}
Insured Value: £{{system_cost}}
Scope of Cover: This policy protects the guarantee if the original installer ceases to trade.

Underwriter: {{underwriter_info}}

TECHNICAL SPECIFICATIONS
---
Installer Company: {{installer_company}}
Inverter Serial: {{inverter_serial}}
Battery Serial: {{battery_serial}}
Commissioning Date: {{commissioning_date}}

KEY POLICY TERMS
---
This insurance-backed guarantee protects your clean energy installation for 10 years from the commissioning date. Coverage applies if the original installer ceases to trade. Terms and conditions apply.

How to Claim: Visit insuraguard.com/claim',
    updated_at = NOW()
WHERE template_type = 'certificate_template';
