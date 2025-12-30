-- Rewrite templates in clean format for proper PDF rendering

UPDATE admin_templates 
SET content = 'INSURAGUARD CLAIM FORM
Insurance-Backed Guarantee for Clean Energy Installations

IMPORTANT: Please complete all sections of this form in BLOCK CAPITALS.
Incomplete forms may delay the processing of your claim.

SECTION 1: POLICYHOLDER INFORMATION

Unique Reference Number (URN): IG-____-________

Full Name: _________________________________________________________________

Email Address: _____________________________________________________________

Contact Telephone: _________________________________________________________

Installation Address (if different from correspondence address):
___________________________________________________________________________
___________________________________________________________________________

Postcode: __________________________________________________________________


SECTION 2: INSTALLATION DETAILS

System Type (tick all that apply):
[ ] Solar PV System          [ ] Battery Storage System
[ ] Solar Thermal            [ ] Other (please specify): ___________________

Original Installer Company Name: __________________________________________

Installer Contact Details (if known): ____________________________________

Installation/Commissioning Date: __________________________________________

System Size/Capacity: ______________________________________________________

Inverter Serial Number: ____________________________________________________

Battery Serial Number (if applicable): ____________________________________


SECTION 3: CLAIM DETAILS

Date Issue First Noticed: _________________________________________________

Date Installer Contacted (if applicable): _________________________________

Has the installer ceased trading?  [ ] Yes   [ ] No   [ ] Unknown

If Yes, please provide evidence (e.g., Companies House dissolution notice,
administrator appointment, website closure, etc.):
___________________________________________________________________________
___________________________________________________________________________

Nature of Defect/Issue (please describe in detail):
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

Has the issue affected system performance?  [ ] Yes   [ ] No

If Yes, please describe impact:
___________________________________________________________________________
___________________________________________________________________________

Current system status:
[ ] Not operational    [ ] Partially operational    [ ] Fully operational


SECTION 4: PREVIOUS ACTIONS TAKEN

Have you contacted the original installer about this issue?  [ ] Yes  [ ] No

If Yes, please provide details and dates:
___________________________________________________________________________
___________________________________________________________________________

Have you obtained any quotes for repair work?  [ ] Yes  [ ] No

If Yes, please attach copies of all quotes received.

Have you made any temporary repairs?  [ ] Yes  [ ] No

If Yes, please provide details and retain all receipts:
___________________________________________________________________________
___________________________________________________________________________


SECTION 5: SUPPORTING DOCUMENTATION

Please attach the following documents to support your claim:

[ ] Copy of your InsuraGuard certificate
[ ] Photographs of the defect/issue (minimum 3 clear images)
[ ] Evidence of installer cessation of trading
[ ] Original installation documentation/warranty
[ ] Any correspondence with the installer
[ ] Repair quotes (if obtained)
[ ] System performance data/monitoring screenshots
[ ] Any other relevant documentation


SECTION 6: DECLARATION

I declare that:
  * The information provided in this claim form is true and accurate
  * I have not made any fraudulent statements
  * I understand that providing false information may invalidate my claim
  * I authorize InsuraGuard to contact relevant parties to verify this claim
  * I have read and understood the terms and conditions of my policy

Signature: _________________________________________________________________

Print Name: ________________________________________________________________

Date: ______________________________________________________________________


SUBMISSION INSTRUCTIONS

Email this completed form along with all supporting documentation to:
claims@insuraguard.com

Subject Line: CLAIM - [Your URN]

WHAT HAPPENS NEXT?

1. ACKNOWLEDGMENT (2 working days)
   We will confirm receipt of your claim

2. INITIAL ASSESSMENT (10 working days)
   Our team will review your claim and may request additional information

3. INSPECTION (if required)
   We may arrange an independent inspection of your installation

4. DECISION
   You will receive our decision and details of next steps

For urgent queries, contact: claims@insuraguard.com
Claim Reference: To be provided upon submission
'
WHERE template_type = 'claim_form';

UPDATE admin_templates 
SET content = 'DATA SUBJECT ACCESS REQUEST (DSAR) FORM
InsuraGuard
Exercising Your Rights Under UK GDPR & Data Protection Act 2018

IMPORTANT INFORMATION

Under the UK General Data Protection Regulation (UK GDPR) and the Data
Protection Act 2018, you have the right to request access to your personal
data held by InsuraGuard. This form allows you to exercise your data
protection rights.

We will respond to your request within 30 days. In complex cases, this may
be extended by up to 60 days, and we will notify you if this is necessary.


SECTION 1: YOUR DETAILS

Full Name: _________________________________________________________________

Previous Names (if applicable): ___________________________________________

Date of Birth: _____________________________________________________________

Current Address:
___________________________________________________________________________
___________________________________________________________________________

Postcode: __________________________________________________________________

Email Address: _____________________________________________________________

Contact Telephone: _________________________________________________________

InsuraGuard URN (if applicable): IG-____-________


SECTION 2: IDENTITY VERIFICATION

To protect your privacy, we require proof of identity. Please attach ONE
of the following documents:

[ ] Copy of current passport (photo page)
[ ] Copy of current UK driving license (both sides)
[ ] Copy of national identity card

IMPORTANT: We will only use this document to verify your identity and will
securely delete it once your request has been processed.


SECTION 3: TYPE OF REQUEST

Please tick the right(s) you wish to exercise:

[ ] RIGHT TO ACCESS (Article 15)
    Request a copy of the personal data we hold about you

[ ] RIGHT TO RECTIFICATION (Article 16)
    Request correction of inaccurate or incomplete personal data

[ ] RIGHT TO ERASURE / "Right to be Forgotten" (Article 17)
    Request deletion of your personal data (subject to legal obligations)

[ ] RIGHT TO RESTRICTION OF PROCESSING (Article 18)
    Request limitation of how we process your data

[ ] RIGHT TO DATA PORTABILITY (Article 20)
    Request your data in a structured, commonly used, machine-readable format

[ ] RIGHT TO OBJECT (Article 21)
    Object to processing of your personal data for specific purposes


SECTION 4: SPECIFIC INFORMATION REQUESTED

If you are requesting access to specific information, please provide
details below. If you want access to all personal data we hold, write "ALL":

___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

Time Period (if applicable):
From: ____________________  To: ____________________


SECTION 5: RECTIFICATION DETAILS (if applicable)

If you are requesting rectification, please specify what information is
incorrect and what it should be corrected to:

Incorrect Information:
___________________________________________________________________________
___________________________________________________________________________

Correct Information:
___________________________________________________________________________
___________________________________________________________________________


SECTION 6: ERASURE/DELETION REQUEST (if applicable)

Please note: We may be required to retain certain data for legal,
regulatory, or contractual purposes. We will inform you if this applies.

Reason for deletion request:
[ ] Data no longer necessary for original purpose
[ ] Withdrawal of consent
[ ] Objection to processing
[ ] Data processed unlawfully
[ ] Legal obligation to erase
[ ] Other (please specify): ____________________________________________


SECTION 7: PREFERRED FORMAT FOR RESPONSE

How would you like to receive your information?

[ ] Email (PDF format)
[ ] Postal mail (printed copy)
[ ] Secure electronic portal (if available)


SECTION 8: ADDITIONAL INFORMATION

Please provide any additional information that may help us locate your data:

___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________


SECTION 9: DECLARATION

I declare that:
  * I am the data subject or have legal authority to act on their behalf
  * The information provided in this form is true and accurate
  * I understand that providing false information may constitute fraud
  * I have attached valid proof of identity

Signature: _________________________________________________________________

Print Name: ________________________________________________________________

Date: ______________________________________________________________________

If submitting on behalf of someone else:

Your Name: _________________________________________________________________

Relationship to Data Subject: _____________________________________________

Authority to Act (please attach evidence, e.g., power of attorney):
___________________________________________________________________________


SUBMISSION INSTRUCTIONS

Email this completed form along with proof of identity to:
privacy@insuraguard.com

Subject Line: DSAR REQUEST - [Your Name]

Postal Address (if preferred):
Data Protection Officer
InsuraGuard
[Address to be provided]


WHAT INFORMATION WE HOLD

When you submit a DSAR, we will provide you with:

  * Your registration and account details
  * Installation and system information
  * Payment and transaction records
  * Communication history (emails, calls, correspondence)
  * Claims history (if applicable)
  * Any other personal data we process about you


YOUR RIGHTS

If you are not satisfied with how we handle your request, you have the
right to lodge a complaint with the Information Commissioner''s Office (ICO):

Website: www.ico.org.uk
Telephone: 0303 123 1113
Address: Information Commissioner''s Office
         Wycliffe House, Water Lane
         Wilmslow, Cheshire SK9 5AF

For more information about how we process your data, please see our
Privacy Policy available at: www.insuraguard.com/privacy
'
WHERE template_type = 'dsar_form';
