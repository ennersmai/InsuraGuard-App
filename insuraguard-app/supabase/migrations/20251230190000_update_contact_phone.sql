-- Update contact phone number in templates

UPDATE admin_templates 
SET content = REPLACE(content, 'claims@insuraguard.com', 'claims@insuraguard.com
Phone: +44 (0)161 520 1169')
WHERE template_type = 'claim_form';

UPDATE admin_templates 
SET content = REPLACE(content, 'privacy@insuraguard.com', 'privacy@insuraguard.com
Phone: +44 (0)161 520 1169')
WHERE template_type = 'dsar_form';
