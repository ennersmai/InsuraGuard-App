# InsuraGuard - Product Requirements Document (PRD)

**Project Timeline:** 7 days (December 29, 2025 - January 5, 2026)  
**Budget:** £500  
**Tech Stack:** Nuxt 3, Supabase, Stripe, SendGrid, Vercel  

---

## 1. Project Overview

InsuraGuard is an insurance-backed guarantee platform for clean energy installations (solar panels, battery storage systems). The platform enables customers to register their installations, pay for insurance coverage, and receive automated insurance documentation with unique reference numbers.

**Core User Journey:**
1. Customer creates account (Supabase Auth)
2. Customer fills registration form with installation details
3. Customer uploads proof of purchase documents
4. Customer pays via Stripe
5. System auto-generates unique insurance number (URN)
6. System creates branded PDF certificate
7. System emails PDF to customer
8. Admin can view/search/export all registrations

---

## 2. Brand Guidelines (InsuraGuard)

**Colors:**
- Primary: Charcoal Grey (#3A3A3A) - 60-70% usage
- Accent: Warm Amber Orange (#E67E22) - 5-10% usage (CTAs, highlights)
- Background: White (#FFFFFF) - 20-30% usage

**Typography:**
- Font: Inter (or modern sans-serif equivalent)
- Headings: SemiBold
- Body: Regular
- CTAs: Medium

**Logo:**
- "Insura" in Charcoal Grey
- "Guard" in Warm Amber Orange
- Shield symbol positioned top-right of wordmark

**Tone:**
- Clear, confident, reassuring
- Modern and professional
- Avoid jargon, favor clarity

# InsuraGuard Brand Guidelines

## 1. Brand Overview

**InsuraGuard** is a clean‑energy protection brand combining modern energy technology with insurance‑backed guarantees. The brand exists to provide clarity, confidence, and peace of mind for homeowners, businesses, and installers investing in solar and energy storage.

### Brand Promise

**Protection you can trust for clean energy investments.**

### Brand Pillars

* Trust & reliability
* Clean energy innovation
* Insurance‑backed assurance
* Simplicity and clarity

### Brand Positioning

InsuraGuard sits at the intersection of **insurance credibility** and **clean‑energy optimism**. It should feel as trustworthy as a financial institution, yet as modern and progressive as a technology company.

* Trust & reliability
* Clean energy innovation
* Assurance & protection
* Simplicity and clarity

---

## 2. Logo Usage

### Primary Logo

* Text‑only wordmark: **InsuraGuard**
* "Insura" in Charcoal Grey
* "Guard" in Warm Amber Orange
* symbol positioned top‑right of the wordmark

This is the default logo and should be used wherever possible.

### Logo Variants

* Full‑colour (preferred)
* All‑charcoal
* All‑white (for dark backgrounds)

### Clear Space

Maintain clear space around the logo equal to the height of the capital **I** in "Insura".

### Minimum Size

* Digital minimum width: **120px**
* Print minimum width: **30mm**

### Incorrect Usage (Do Not)

* Recolour the logo
* Stretch or distort proportions
* Add shadows, outlines, or gradients
* Place on busy or low‑contrast backgrounds
* Remove or reposition the symbol

---

## 3. Colour Palette

### Primary Colours

**Charcoal Grey**

* HEX: #3A3A3A
* RGB: 58, 58, 58
* Usage: Primary text, "Insura", body copy

**Warm Amber Orange**

* HEX: #E67E22
* RGB: 230, 126, 34
* Usage: "Guard", highlights, calls‑to‑action, accents

### Supporting Colour

**White**

* HEX: #FFFFFF
* Usage: Primary background, spacing, clarity

### Colour Ratios

* Charcoal Grey: 60–70%
* White: 20–30%
* Amber Orange: 5–10% (accent only)

Orange should never dominate a layout; it is used to signal importance and reassurance.

---

## 4. Typography

### Primary Typeface (Recommended)

**Inter** (or equivalent modern sans‑serif)

* Weights: Regular, Medium, SemiBold
* Characteristics: neutral, modern, highly legible

### Usage Rules

* Headings: SemiBold
* Body text: Regular
* CTAs & highlights: Medium

### Typography Principles

* Favour clarity over personality
* Avoid condensed or decorative fonts
* Never use serif fonts in digital UI

---

## 5. Tone of Voice

InsuraGuard communication should always be:

* Clear and plain‑spoken
* Calm and confident
* Reassuring, not sales‑heavy
* Modern and human

### Voice Attributes

* **Confident:** backed by insurance, not hype
* **Reassuring:** reduces perceived risk
* **Accessible:** avoids jargon

### Writing Examples

“Industry‑leading next‑generation energy insurance solutions”

“Insurance‑backed protection for your clean energy system”

“Maximum performance guarantee optimisation”

“Protection that gives you peace of mind”

---

## 6. Imagery & Visual Style

### Imagery

* Clean, well‑lit environments
* Real homes, businesses, and installers
* Renewable energy in use (solar, batteries)

Avoid:

* Stock clichés
* Overly technical visuals
* Dark or dramatic imagery

### Design Style

* Minimal layouts
* Plenty of white space
* Strong hierarchy
* Simple iconography when needed

---

## 7. Digital & UI Usage

* Use the SVG logo for web whenever possible
* Ensure strong contrast for accessibility
* Orange should be used sparingly in UI elements
* Logo must remain legible at all sizes

---

## 8. Brand Values in Practice

Every InsuraGuard touchpoint should feel:

* Dependable
* Clear
* Forward‑looking
* Professionally reassuring

If in doubt: choose clarity over cleverness.

---

## 9. Contact & Governance

Any changes to logo, colour, or typography must be approved by brand owners before use.

This document defines the official InsuraGuard brand system.

InsuraGuard — Future‑focused security for clean energy.
---

## 3. Technical Architecture

### 3.1 Tech Stack

**Frontend:**
- Nuxt 3 (Vue 3 framework)
- TypeScript
- TailwindCSS (using Inter font)
- Deployed on Vercel

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth (email/password)
- Supabase Storage (PDF and document storage)
- Supabase Edge Functions (webhooks, PDF generation)

**Integrations:**
- Stripe (payments)
- SendGrid (email delivery)

**Libraries:**
- PDF generation: `@react-pdf/renderer` or `pdfkit` or `puppeteer`
- Form validation: `vee-validate` + `zod`
- Date handling: `date-fns`

### 3.2 Database Schema (Supabase) (proposed, not definitive)

```sql
-- Registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- URN (Unique Reference Number)
  urn TEXT UNIQUE NOT NULL, -- Format: IG-2025-XXXXX (obfuscated)
  
  -- Customer Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  installation_address TEXT NOT NULL,
  
  -- System Info
  system_description TEXT NOT NULL, -- e.g., "5kW Solar PV + 10kWh Battery Storage"
  system_cost DECIMAL(10,2) NOT NULL, -- Insured value
  commissioning_date DATE NOT NULL,
  
  -- Installer Info
  installer_company TEXT NOT NULL,
  inverter_serial TEXT,
  battery_serial TEXT,
  
  -- Documents
  document_urls TEXT[], -- Array of Supabase Storage URLs
  
  -- Payment
  stripe_payment_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed
  payment_amount DECIMAL(10,2),
  
  -- PDF
  pdf_url TEXT, -- Supabase Storage URL for generated certificate
  
  -- Metadata
  registration_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- active, cancelled, expired
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin templates table
CREATE TABLE admin_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_type TEXT UNIQUE NOT NULL, -- pdf_legal_text, claim_form, dsar_form, underwriter_info
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

-- Admin policy (requires admin role check)
CREATE POLICY "Admins can view all registrations"
  ON registrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### 3.3 Supabase Storage Buckets

```
insuraguard-documents/
├── proof-of-purchase/
│   └── {user_id}/{registration_id}/{filename}
└── certificates/
    └── {registration_id}/certificate.pdf
```

**Bucket Policies:**
- `proof-of-purchase`: Private (only accessible by user and admin)
- `certificates`: Private (only accessible by user and admin)

### 3.4 URN Generation Logic

**Format:** `IG-2025-XXXXX` (obfuscated, 5-character alphanumeric)

**Implementation:**
```javascript
function generateURN() {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars (0, O, I, 1)
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IG-${year}-${code}`;
}

// Check uniqueness in database before saving
async function getUniqueURN() {
  let urn;
  let exists = true;
  while (exists) {
    urn = generateURN();
    const { data } = await supabase
      .from('registrations')
      .select('id')
      .eq('urn', urn)
      .single();
    exists = !!data;
  }
  return urn;
}
```

---

## 4. User Flows

### 4.1 Customer Registration Flow

```
[Landing Page] 
    ↓
[Sign Up / Login] (Supabase Auth)
    ↓
[Registration Form]
    ↓
[Payment (Stripe Checkout)]
    ↓
[Stripe Webhook] → [Supabase Edge Function]
    ↓
[Generate URN]
    ↓
[Create PDF Certificate]
    ↓
[Upload PDF to Storage]
    ↓
[Send Email via SendGrid]
    ↓
[Confirmation Page]
```

### 4.2 Admin Flow

```
[Admin Login] (Supabase Auth with admin role)
    ↓
[Admin Dashboard]
    ├─ [View Registrations Table]
    │   ├─ Search by name/email/URN
    │   ├─ Click row → View Details
    │   └─ Export to CSV
    ├─ [Template Editor]
    │   ├─ PDF Legal Text
    │   ├─ Claim Form Template
    │   ├─ DSAR Form Template
    │   └─ Underwriter Info
    └─ [GDPR Tools]
        └─ Delete Registration (manual)
```

### 4.3 Public Verification Flow

```
[Landing Page]
    ↓
[URN Verification Box]
    ↓
[Enter URN: IG-2025-XXXXX]
    ↓
[Query Database]
    ↓
[Display: Valid ✓ or Invalid ✗]
```

---

## 5. Pages & Routes

### Landing Page Structure (InsuraGuard - Based on HomeServe)

1. Header/Navigation
┌─────────────────────────────────────────────────────┐
│ [InsuraGuard Logo]    About | FAQ | Contact | Login │
└─────────────────────────────────────────────────────┘

Logo: Charcoal + Amber wordmark
Simple nav (not dropdown heavy like HomeServe)
Right: Login button (Amber Orange)


2. Hero Section
┌──────────────────────────────────────────────┐
│  [Clean energy illustration/photo]          │
│                                              │
│  Insurance-Backed Protection                │
│  for Your Clean Energy System               │
│                                              │
│  10-year guarantee protection if your       │
│  installer ceases to trade                  │
│                                              │
│  [Register Now Button - Amber Orange]       │
│                                              │
│  ✓ Insurance-backed | ✓ 10-year coverage   │
│  ✓ Instant certification                    │
└──────────────────────────────────────────────┘
Key differences from HomeServe:

Clean, modern photo (solar panels on modern home)
No cartoon mascot (more professional/insurance credibility)
Trust badges integrated into hero
Single clear CTA


3. URN Verification Widget (HomeServe doesn't have this)
┌──────────────────────────────────────────────┐
│  Verify Your Insurance Certificate          │
│                                              │
│  [Input: IG-2025-XXXXX] [Verify Button]    │
│                                              │
│  ✓ Valid Policy  /  ✗ Invalid Reference    │
└──────────────────────────────────────────────┘

Centered, white card
Amber Orange button
Good trust signal + useful tool


4. "How It Works" Section (replaces HomeServe's service grid)
Heading: "Simple Protection in 3 Steps"

┌──────────┐  ┌──────────┐  ┌──────────┐
│ 1️⃣ Icon  │  │ 2️⃣ Icon  │  │ 3️⃣ Icon  │
│ Register │  │   Pay    │  │ Protected│
│          │  │          │  │          │
│ Upload   │  │ Secure   │  │ Instant  │
│ system   │  │ payment  │  │ insurance│
│ details  │  │ via      │  │ certifi- │
│          │  │ Stripe   │  │ cate     │
└──────────┘  └──────────┘  └──────────┘
3 cards, icon-based, simple flow

5. Features/Benefits Grid (like HomeServe's service cards)
Heading: "Why Choose InsuraGuard?"

┌────────────────┐  ┌────────────────┐
│ 🛡️ Shield Icon │  │ ⚡ Speed Icon  │
│                │  │                │
│ Insurance-     │  │ Instant        │
│ Backed         │  │ Certification  │
│                │  │                │
│ Protection you │  │ Receive your   │
│ can trust...   │  │ certificate... │
└────────────────┘  └────────────────┘

┌────────────────┐  ┌────────────────┐
│ 📋 Document    │  │ 🔒 Lock Icon   │
│                │  │                │
│ 10-Year        │  │ GDPR           │
│ Coverage       │  │ Compliant      │
│                │  │                │
│ Long-term...   │  │ Your data...   │
└────────────────┘  └────────────────┘
4 cards, 2x2 grid on desktop, stack on mobile

6. Social Proof Section (like HomeServe's reviews)
Heading: "Trusted by Clean Energy Homeowners"

[Underwriter logo/badge]
"Backed by [Underwriter Name]"
Authorized and regulated by FCA

Optional: If Simon gets testimonials later, add carousel here
Keep simple for launch - just underwriter trust badge
Later: Add customer testimonials when available

7. CTA Section
┌──────────────────────────────────────────────┐
│  Ready to Protect Your Investment?          │
│                                              │
│  Register your clean energy system today    │
│                                              │
│  [Get Started - Large Amber Button]         │
└──────────────────────────────────────────────┘
White background, centered, Amber CTA

8. Footer
┌─────────────────────────────────────────────────┐
│ [InsuraGuard Logo]                              │
│                                                 │
│ Quick Links    |  Legal         |  Contact     │
│ • About        |  • Privacy     |  Email: ...  │
│ • FAQ          |  • Terms       |  Phone: ...  │
│ • Register     |  • Cookies     |              │
│ • Verify       |  • GDPR/DSAR   |              │
│ • Claim Form   |                |              │
│                                                 │
│ © 2025 InsuraGuard. All rights reserved.       │
│ [Company registration info]                    │
└─────────────────────────────────────────────────┘
Dark charcoal background (#3A3A3A)
Links in white or light grey
Keep it clean, not overly complex

KEY DIFFERENCES FROM HOMESERVE:
What to KEEP:

✅ Hero with clear value prop
✅ Social proof section
✅ Service/feature cards
✅ Clean footer with links

What to CHANGE:

❌ No cartoon mascot (too playful for insurance)
❌ No complex mega-menu navigation
❌ No pricing in hero (they pay once for registration)
✅ ADD: URN verification widget (unique to InsuraGuard)
✅ More minimal/modern aesthetic (less busy)

Tone:

HomeServe = friendly, approachable, "we're here for emergencies"
InsuraGuard = professional, trustworthy, "long-term protection"


COPY EXAMPLES:
Hero headline:
"Insurance-Backed Protection for Your Clean Energy System"
Subheading:
"10-year guarantee protection if your installer ceases to trade. Register in minutes, protected for a decade."
Feature cards:

"Insurance-Backed Security" - Protection you can trust for clean energy investments
"Instant Certification" - Receive your certificate immediately after registration
"10-Year Coverage" - Long-term peace of mind for your solar and battery systems
"GDPR Compliant" - Your data is secure and handled with care

### 5.1 Public Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `index.vue` | Landing page with hero, features, verification box |
| `/register` | `register.vue` | Registration form (auth required) |
| `/verify` | `verify.vue` | URN verification tool |
| `/privacy` | `privacy.vue` | Privacy Policy (hardcoded, no admin edit) |
| `/terms` | `terms.vue` | Terms & Conditions (hardcoded, no admin edit) |
| `/faq` | `faq.vue` | Frequently Asked Questions |
| `/contact` | `contact.vue` | Contact form/info |
| `/claim` | `claim.vue` | Downloadable Claim Form (uses admin template) |
| `/dsar` | `dsar.vue` | Downloadable DSAR Form (uses admin template) |

### 5.2 Auth Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `login.vue` | Customer/Admin login |
| `/signup` | `signup.vue` | Customer signup |
| `/forgot-password` | `forgot-password.vue` | Password reset |

### 5.3 Customer Dashboard

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | `dashboard.vue` | Customer's registrations list |
| `/dashboard/[id]` | `dashboard/[id].vue` | View single registration details |

### 5.4 Admin Panel

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | `admin/index.vue` | Admin dashboard (all registrations) |
| `/admin/templates` | `admin/templates.vue` | Template editor |
| `/admin/registration/[id]` | `admin/registration/[id].vue` | View/edit/delete registration |

---

## 6. Registration Form Fields

### 6.1 Form Structure

**Section 1: Customer Information**
- Full Name (text, required)
- Email Address (email, required, auto-filled from auth)
- Phone Number (tel, required)
- Installation Address (textarea, required)

**Section 2: System Information**
- System Description (text, required)
  - Placeholder: "e.g., 5kW Solar PV + 10kWh Battery Storage"
- System Cost (number, required, £)
  - Used as insured value
- Commissioning Date (date, required)

**Section 3: Installer Information**
- Installer Company Name (text, required)
- Inverter Serial Number (text, optional)
- Battery Serial Number (text, optional)

**Section 4: Documentation**
- Proof of Purchase Upload (file, required)
  - Accepted formats: PDF, TXT, JPEG, PNG
  - Max file size: 10MB per file
  - Multiple files allowed (up to 5)

**Section 5: Payment**
- Total Amount (display only, pulled from Stripe config)
- Stripe Checkout Button

### 6.2 Validation Rules

```typescript
const registrationSchema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, 'Valid phone number required'),
  installation_address: z.string().min(10, 'Full address required'),
  
  system_description: z.string().min(5, 'System description required'),
  system_cost: z.number().min(1, 'System cost required').max(999999, 'Invalid amount'),
  commissioning_date: z.date().max(new Date(), 'Date cannot be in future'),
  
  installer_company: z.string().min(2, 'Installer company required'),
  inverter_serial: z.string().optional(),
  battery_serial: z.string().optional(),
  
  documents: z.array(z.instanceof(File))
    .min(1, 'At least one proof of purchase required')
    .max(5, 'Maximum 5 files allowed')
});
```

---

## 7. PDF Certificate Generation

### 7.1 PDF Structure

**Page Layout:**
- A4 size (210mm × 297mm)
- Margins: 20mm all sides
- Font: Inter (embedded)
- Colors: Charcoal Grey (#3A3A3A), Amber Orange (#E67E22)

**Content Sections:**

**1. Header (Top 60mm)**
```
┌─────────────────────────────────────────┐
│  [InsuraGuard Logo]          [Shield]   │
│                                         │
│  CERTIFICATE OF INSURANCE-BACKED        │
│  GUARANTEE                              │
│                                         │
│  Unique Reference: IG-2025-XXXXX        │ ← Amber Orange
│                                         │
└─────────────────────────────────────────┘
```

**2. The Insured (80mm)**
```
THE INSURED
───────────── ← Amber Orange divider

Policyholder Name:     {full_name}
Installation Address:  {installation_address}
Registration Date:     {registration_date}
System Details:        {system_description}
```

**3. Coverage Summary (100mm)**
```
COVERAGE SUMMARY
───────────── ← Amber Orange divider

Period of Cover:       10 years from {commissioning_date}
Insured Value:         £{system_cost}
Scope of Cover:        This policy protects the guarantee if the 
                       original installer ceases to trade.

Underwriter:           {underwriter_info from admin template}
```

**4. Technical Specifications (80mm)**
```
TECHNICAL SPECIFICATIONS
───────────── ← Amber Orange divider

Installer Company:     {installer_company}
Inverter Serial:       {inverter_serial or "N/A"}
Battery Serial:        {battery_serial or "N/A"}
Commissioning Date:    {commissioning_date}
```

**5. Policy Terms (100mm)**
```
KEY POLICY TERMS
───────────── ← Amber Orange divider

{pdf_legal_text from admin template}

How to Claim: Visit insuraguard.com/claim
```

**6. Footer (40mm)**
```
───────────── ← Amber Orange divider

InsuraGuard Company Information
{company_address}
Company Number: {company_number}

Regulatory Statement:
{underwriter_info}

Data Protection: See Privacy Notice at insuraguard.com/privacy

Document Generated: {timestamp}
"Digitally Validated" ← Amber Orange stamp/badge
```

**7. Embedded Documents (Last Page)**
```
ATTACHED DOCUMENTS
───────────── ← Amber Orange divider

[Embedded proof of purchase files as images/pages]
```

### 7.2 PDF Generation Implementation

**Supabase Edge Function: `generate-certificate`**

```typescript
// /supabase/functions/generate-certificate/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import PDFDocument from 'https://cdn.skypack.dev/pdfkit'

serve(async (req) => {
  const { registrationId } = await req.json()
  
  // Fetch registration data
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', registrationId)
    .single()
  
  // Fetch templates
  const { data: templates } = await supabase
    .from('admin_templates')
    .select('*')
  
  const pdfLegalText = templates.find(t => t.template_type === 'pdf_legal_text')?.content
  const underwriterInfo = templates.find(t => t.template_type === 'underwriter_info')?.content
  
  // Generate PDF using pdfkit
  const doc = new PDFDocument({ size: 'A4', margin: 57 }) // 20mm = 57 points
  
  // Add logo and header
  doc.fontSize(24).text('CERTIFICATE OF INSURANCE-BACKED GUARANTEE', { align: 'center' })
  doc.moveDown()
  doc.fontSize(16).fillColor('#E67E22').text(`Unique Reference: ${registration.urn}`, { align: 'center' })
  doc.fillColor('#3A3A3A')
  
  // Add sections...
  // (Full implementation would go here)
  
  // Save to Supabase Storage
  const pdfBuffer = await new Promise((resolve) => {
    const chunks = []
    doc.on('data', chunks.push.bind(chunks))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.end()
  })
  
  const filePath = `certificates/${registrationId}/certificate.pdf`
  await supabase.storage
    .from('insuraguard-documents')
    .upload(filePath, pdfBuffer, { contentType: 'application/pdf' })
  
  // Update registration with PDF URL
  const { data: { publicUrl } } = supabase.storage
    .from('insuraguard-documents')
    .getPublicUrl(filePath)
  
  await supabase
    .from('registrations')
    .update({ pdf_url: publicUrl })
    .eq('id', registrationId)
  
  return new Response(JSON.stringify({ pdfUrl: publicUrl }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 8. Payment Integration (Stripe)

### 8.1 Stripe Setup Requirements

**From Simon:**
- Stripe account (test + live keys)
- Price ID for insurance registration fee (amount TBD)
- Webhook endpoint URL (Supabase Edge Function)

### 8.2 Payment Flow

```typescript
// Frontend: Initiate Stripe Checkout

// Frontend (Nuxt component)
async function initiatePayment(registrationData) {
  // Call Supabase Edge Function
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { 
      registrationId: registration.id,
      priceId: 'price_xxxxx'
    }
  })
  
  // Redirect to Stripe
  window.location.href = data.url
}
```

**Backend: Create Checkout Session**

```typescript
// /supabase/functions/create-checkout-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0'

serve(async (req) => {
  const { registrationId, priceId } = await req.json()
  
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${Deno.env.get('BASE_URL')}/success`,
    cancel_url: `${Deno.env.get('BASE_URL')}/register`,
    metadata: { registrationId }
  })
  
  return new Response(JSON.stringify({ url: session.url }))
})
```

### 8.3 Stripe Webhook Handler

**Supabase Edge Function: `stripe-webhook`**

```typescript
// /supabase/functions/stripe-webhook/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0'

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()
  
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16'
  })
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  )
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const registrationId = session.metadata.registrationId
    
    // 1. Generate unique URN
    const urn = await getUniqueURN()
    
    // 2. Update registration
    await supabase
      .from('registrations')
      .update({
        urn,
        stripe_payment_id: session.payment_intent,
        payment_status: 'completed',
        payment_amount: session.amount_total / 100
      })
      .eq('id', registrationId)
    
    // 3. Generate PDF certificate
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-certificate`, {
      method: 'POST',
      body: JSON.stringify({ registrationId })
    })
    
    // 4. Send email via SendGrid
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-confirmation-email`, {
      method: 'POST',
      body: JSON.stringify({ registrationId })
    })
  }
  
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 9. Email System (SendGrid)

### 9.1 Email Configuration

**SendGrid Setup:**
- API Key from Simon's account
- Sender email: `noreply@insuraguard.com` (verified domain)
- Templates stored in SendGrid or as HTML strings

**Email Types:**
1. Welcome email (Supabase Auth)
2. Password reset (Supabase Auth)
3. Registration confirmation + PDF (SendGrid)

### 9.2 Confirmation Email Template

**Subject:** Your InsuraGuard Certificate - {urn}

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, Arial, sans-serif; color: #3A3A3A; }
    .header { background: #E67E22; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
    .button { background: #E67E22; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>InsuraGuard</h1>
  </div>
  
  <div class="content">
    <h2>Thank you for registering with InsuraGuard</h2>
    
    <p>Dear {full_name},</p>
    
    <p>Your clean energy system is now protected under insurance-backed guarantee.</p>
    
    <p><strong>Your Unique Reference Number:</strong> {urn}</p>
    
    <p>Your insurance certificate is attached to this email. Please keep it safe for your records.</p>
    
    <p><strong>Coverage Details:</strong></p>
    <ul>
      <li>Period: 10 years from {commissioning_date}</li>
      <li>Insured Value: £{system_cost}</li>
      <li>System: {system_description}</li>
    </ul>
    
    <p>If you need to make a claim, visit: <a href="https://insuraguard.com/claim">insuraguard.com/claim</a></p>
    
    <p>
      <a href="https://insuraguard.com/dashboard" class="button">View Dashboard</a>
    </p>
    
    <p>Thank you for choosing InsuraGuard.</p>
  </div>
  
  <div class="footer">
    <p>InsuraGuard - Protection you can trust for clean energy investments</p>
    <p><a href="https://insuraguard.com/privacy">Privacy Policy</a> | <a href="https://insuraguard.com/terms">Terms & Conditions</a></p>
  </div>
</body>
</html>
```

**Attachment:** certificate.pdf (from Supabase Storage)

### 9.3 SendGrid Implementation

**Supabase Edge Function: `send-confirmation-email`**

```typescript
// /supabase/functions/send-confirmation-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { registrationId } = await req.json()
  
  // Fetch registration
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', registrationId)
    .single()
  
  // Download PDF from storage
  const { data: pdfBlob } = await supabase.storage
    .from('insuraguard-documents')
    .download(`certificates/${registrationId}/certificate.pdf`)
  
  const pdfBase64 = await blobToBase64(pdfBlob)
  
  // Send via SendGrid
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: registration.email, name: registration.full_name }],
        dynamic_template_data: {
          full_name: registration.full_name,
          urn: registration.urn,
          commissioning_date: registration.commissioning_date,
          system_cost: registration.system_cost,
          system_description: registration.system_description
        }
      }],
      from: { email: 'noreply@insuraguard.com', name: 'InsuraGuard' },
      subject: `Your InsuraGuard Certificate - ${registration.urn}`,
      content: [{ type: 'text/html', value: emailHtmlTemplate }],
      attachments: [{
        content: pdfBase64,
        filename: `InsuraGuard_Certificate_${registration.urn}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }]
    })
  })
  
  return new Response(JSON.stringify({ sent: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 10. Admin Panel Features

### 10.1 Admin Authentication

**Admin Role Setup:**
```sql
-- Add role to user metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'simon@insuraguard.com';
```

**Middleware for admin routes:**
```typescript
// /middleware/admin.ts

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  
  if (!user.value) {
    return navigateTo('/login')
  }
  
  const { data: { user: userData } } = await useSupabaseClient().auth.getUser()
  
  if (userData?.user_metadata?.role !== 'admin') {
    return abortNavigation('Unauthorized')
  }
})
```

### 10.2 Registrations Dashboard

**Features:**
- Table view with pagination (25 per page)
- Columns: URN, Name, Email, System, Date, Status, Actions
- Search bar (searches: URN, name, email)
- Filter by status (active, cancelled, expired)
- Sort by: Date (newest/oldest), Name (A-Z)
- Export all to CSV button

**Component Structure:**
```vue
<template>
  <div class="admin-dashboard">
    <div class="toolbar">
      <input v-model="searchQuery" placeholder="Search by URN, name, or email..." />
      <select v-model="statusFilter">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="cancelled">Cancelled</option>
        <option value="expired">Expired</option>
      </select>
      <button @click="exportToCSV">Export to CSV</button>
    </div>
    
    <table class="registrations-table">
      <thead>
        <tr>
          <th @click="sortBy('urn')">URN</th>
          <th @click="sortBy('full_name')">Name</th>
          <th>Email</th>
          <th>System</th>
          <th @click="sortBy('created_at')">Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reg in filteredRegistrations" :key="reg.id">
          <td>{{ reg.urn }}</td>
          <td>{{ reg.full_name }}</td>
          <td>{{ reg.email }}</td>
          <td>{{ reg.system_description }}</td>
          <td>{{ formatDate(reg.created_at) }}</td>
          <td>
            <span :class="statusClass(reg.status)">{{ reg.status }}</span>
          </td>
          <td>
            <NuxtLink :to="`/admin/registration/${reg.id}`">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div class="pagination">
      <!-- Pagination controls -->
    </div>
  </div>
</template>
```

### 10.3 Template Editor

**Editable Templates:**
1. PDF Legal Text (policy wording)
2. Claim Form Template
3. DSAR Form Template
4. Underwriter Info

**Editor Component:**
```vue
<template>
  <div class="template-editor">
    <h2>Template Editor</h2>
    
    <div class="template-selector">
      <button
        v-for="type in templateTypes"
        :key="type.id"
        @click="selectedTemplate = type.id"
        :class="{ active: selectedTemplate === type.id }"
      >
        {{ type.label }}
      </button>
    </div>
    
    <div class="editor-area">
      <label>{{ currentTemplate.label }}</label>
      <textarea
        v-model="currentTemplate.content"
        rows="20"
        class="template-textarea"
      ></textarea>
      
      <div class="editor-actions">
        <button @click="saveTemplate" class="save-btn">Save Changes</button>
        <button @click="previewTemplate" class="preview-btn">Preview</button>
      </div>
    </div>
    
    <div class="help-text">
      <p><strong>Available Variables:</strong></p>
      <ul>
        <li v-for="variable in availableVariables" :key="variable">
          <code>{{ `{${variable}}` }}</code>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const templateTypes = [
  { id: 'pdf_legal_text', label: 'PDF Legal Text' },
  { id: 'claim_form', label: 'Claim Form' },
  { id: 'dsar_form', label: 'DSAR Form' },
  { id: 'underwriter_info', label: 'Underwriter Information' }
]

const availableVariables = [
  'full_name', 'email', 'urn', 'system_description', 
  'commissioning_date', 'system_cost', 'installer_company'
]
</script>
```

### 10.4 Registration Detail View

**Features:**
- Full registration details (read-only)
- View uploaded documents (download links)
- Download PDF certificate
- GDPR delete button (with confirmation modal)
- Resend email button

### 10.5 CSV Export Function

```typescript
function exportToCSV(registrations) {
  const headers = [
    'URN', 'Full Name', 'Email', 'Phone', 'Address',
    'System Description', 'System Cost', 'Commissioning Date',
    'Installer', 'Payment Status', 'Registration Date'
  ]
  
  const rows = registrations.map(reg => [
    reg.urn,
    reg.full_name,
    reg.email,
    reg.phone,
    reg.installation_address,
    reg.system_description,
    reg.system_cost,
    reg.commissioning_date,
    reg.installer_company,
    reg.payment_status,
    reg.created_at
  ])
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `insuraguard-registrations-${new Date().toISOString()}.csv`
  link.click()
}
```

---

## 11. GDPR Compliance Implementation

### 11.1 Required GDPR Features

**Data Encryption:**
- ✅ Supabase encrypts data at rest by default
- ✅ HTTPS/TLS encrypts data in transit
- ✅ Environment variables for API keys

**Pseudonymization:**
- User IDs are UUIDs (not directly identifiable)
- URNs are obfuscated (not sequential)

**Storage Limitation:**
- Define retention policy: "10 years from registration date"
- Implement auto-deletion cron job (optional, can be manual via admin)

**Data Minimization:**
- Only collect necessary fields
- No unnecessary tracking/analytics

**Access Controls:**
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Admin role required for admin panel
- MFA recommended for admin accounts

### 11.2 Cookie Consent Banner

**Implementation:**
```vue
<template>
  <div v-if="!cookiesAccepted" class="cookie-banner">
    <div class="cookie-content">
      <p>
        We use essential cookies to ensure the website functions properly. 
        <NuxtLink to="/privacy">Learn more</NuxtLink>
      </p>
      <button @click="acceptCookies" class="accept-btn">Accept</button>
    </div>
  </div>
</template>

<script setup>
const cookiesAccepted = useCookie('cookies-accepted', { 
  maxAge: 60 * 60 * 24 * 365 // 1 year
})

function acceptCookies() {
  cookiesAccepted.value = 'true'
}
</script>
```

### 11.3 Data Subject Rights Implementation

**Rights to Implement:**
1. **Right to Access:** Customer dashboard shows all their data
2. **Right to Rectification:** Contact form for corrections (manual process)
3. **Right to Erasure:** Admin "Delete" button (hard delete from database)
4. **Right to Data Portability:** CSV export of user's data (download button)

**DSAR (Data Subject Access Request) Process:**
1. Customer downloads DSAR form template (admin-editable)
2. Customer submits form via email/contact page
3. Admin manually processes request
4. Admin exports user's data to CSV or PDF
5. Admin sends data to customer via email

### 11.4 Privacy Policy Requirements

**Must Include:**
- Data Controller information (InsuraGuard company details)
- Types of data collected (personal, system, payment)
- Purpose of processing (insurance registration, payment, email)
- Legal basis (contract, consent)
- Data retention period (10 years)
- Third-party processors (Stripe, SendGrid, Supabase)
- User rights (access, rectify, delete, portability)
- How to exercise rights (contact email)
- Complaint procedure (ICO/DPC)

**Template Location:** `/pages/privacy.vue` (hardcoded, Mai edits)

### 11.5 GDPR Audit Checklist

```markdown
## GDPR Compliance Checklist

- [ ] Privacy Policy published and linked in footer
- [ ] Terms & Conditions published
- [ ] Cookie consent banner implemented
- [ ] Data encrypted (at rest and in transit)
- [ ] Row Level Security enabled on all tables
- [ ] User authentication required for sensitive data
- [ ] Admin role-based access control
- [ ] DSAR form template available for download
- [ ] Claim form template available
- [ ] Customer can view all their data (dashboard)
- [ ] Customer can download their data (CSV export)
- [ ] Admin can delete user data (hard delete)
- [ ] No unnecessary data collected
- [ ] Third-party processors documented
- [ ] Data retention policy defined
- [ ] Breach notification procedure documented
```

---

## 12. Content Requirements

### 12.1 Landing Page (`/`)

**Hero Section:**
- Headline: "Insurance-Backed Protection for Your Clean Energy System"
- Subheading: "10-year guarantee protection if your installer ceases to trade"
- CTA Button: "Register Now" (→ `/register`)
- Hero Image: Solar panels on roof (clean, modern aesthetic)

**Features Section:**
- Feature 1: "Insurance-Backed Security" (shield icon)
- Feature 2: "10-Year Coverage" (clock icon)
- Feature 3: "Simple Registration" (checkmark icon)
- Feature 4: "Instant Certification" (document icon)

**URN Verification Box:**
- Input field: "Enter your insurance reference (e.g., IG-2025-XXXXX)"
- Button: "Verify"
- Result display: "✓ Valid Policy" or "✗ Invalid Reference"

**Trust Signals:**
- "Regulated by [Underwriter]"
- "GDPR Compliant"
- "Secure Payment Processing"

**Footer:**
- Links: About, Privacy, Terms, FAQ, Contact, Claim, DSAR
- Copyright: "© 2025 InsuraGuard. All rights reserved."

### 12.2 FAQ Page (`/faq`)

**Sample Questions (to be created following brand guidelines):**

1. **What does InsuraGuard cover?**
   - Answer: Protection if installer ceases trading, 10-year coverage...

2. **How do I register my system?**
   - Answer: Create account, fill form, upload documents, pay...

3. **What if my installer goes out of business?**
   - Answer: Your guarantee remains valid, submit claim form...

4. **How long does registration take?**
   - Answer: 5-10 minutes, instant certificate after payment...

5. **Can I register an existing installation?**
   - Answer: Yes, as long as system is under 12 months old...

6. **How do I make a claim?**
   - Answer: Download claim form, submit with documentation...

7. **Is my data secure?**
   - Answer: GDPR compliant, encrypted storage, secure payment...

8. **What payment methods are accepted?**
   - Answer: All major credit/debit cards via Stripe...

### 12.3 About Page (`/about`)

**Content Outline:**
- Brand promise: "Protection you can trust for clean energy investments"
- Mission statement (following brand guidelines)
- How InsuraGuard works (3-step process visual)
- Why choose InsuraGuard (trust, innovation, clarity)

### 12.4 Terms & Conditions

**Source:** Copy from similar insurance provider, adapt to InsuraGuard
**Key Sections:**
- Eligibility criteria
- Coverage scope
- Exclusions
- Claims process
- Cancellation policy
- Dispute resolution

### 12.5 Contact Page (`/contact`)

**Content:**
- Email: support@insuraguard.com
- Phone: [TBD from Simon]
- Address: [Company registered address]
- Contact form (name, email, message) → sends to admin email

---

## 13. File Structure

```
insuraguard/
├── .output/
├── .nuxt/
├── node_modules/
│
├── assets/
│   ├── css/
│   │   └── main.css (Tailwind + custom styles)
│   └── images/
│       ├── logo-charcoal-amber.svg
│       ├── logo-white.svg
│       ├── shield-icon.svg
│       └── hero-solar.jpg
│
├── components/
│   ├── layout/
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── CookieBanner.vue
│   ├── forms/
│   │   ├── RegistrationForm.vue
│   │   ├── LoginForm.vue
│   │   └── ContactForm.vue
│   ├── admin/
│   │   ├── RegistrationsTable.vue
│   │   ├── TemplateEditor.vue
│   │   └── RegistrationDetail.vue
│   └── ui/
│       ├── Button.vue
│       ├── Input.vue
│       ├── Card.vue
│       └── Modal.vue
│
├── composables/
│   ├── useAuth.ts
│   ├── useRegistration.ts
│   └── useAdmin.ts
│
├── layouts/
│   ├── default.vue
│   └── admin.vue
│
├── middleware/
│   ├── auth.ts
│   └── admin.ts
│
├── pages/
│   ├── index.vue (Landing page)
│   ├── register.vue
│   ├── login.vue
│   ├── signup.vue
│   ├── verify.vue
│   ├── privacy.vue
│   ├── terms.vue
│   ├── faq.vue
│   ├── about.vue
│   ├── contact.vue
│   ├── claim.vue
│   ├── dsar.vue
│   ├── success.vue (Stripe success redirect)
│   ├── dashboard/
│   │   ├── index.vue
│   │   └── [id].vue
│   └── admin/
│       ├── index.vue
│       ├── templates.vue
│       └── registration/
│           └── [id].vue
│
├── plugins/
│   └── supabase.client.ts
│
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── server/
│   ├── api/
│   │   ├── create-checkout.post.ts
│   │   └── verify-urn.get.ts
│   └── middleware/
│       └── cors.ts
│
├── supabase/
│   ├── functions/
│   │   ├── stripe-webhook/
│   │   │   └── index.ts
│   │   ├── generate-certificate/
│   │   │   └── index.ts
│   │   └── send-confirmation-email/
│   │       └── index.ts
│   └── migrations/
│       └── 20250101_initial_schema.sql
│
├── types/
│   ├── database.types.ts
│   └── registration.types.ts
│
├── utils/
│   ├── urn-generator.ts
│   ├── csv-export.ts
│   └── validators.ts
│
├── .env.example
├── .gitignore
├── nuxt.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 14. Environment Variables

```bash
# .env.example

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx

# SendGrid
SENDGRID_API_KEY=SG.xxxxx

# App
BASE_URL=http://localhost:3000
```

---

## 15. Implementation Phases

### Phase 1: Foundation 
- [ ] Initialize Nuxt 3 project
- [ ] Set up TailwindCSS with Inter font
- [ ] Configure Supabase client
- [ ] Create database schema + migrations
- [ ] Set up Supabase Storage buckets
- [ ] Implement RLS policies
- [ ] Create layout components (Header, Footer)
- [ ] Build landing page structure

### Phase 2: Authentication 
- [ ] Implement Supabase Auth
- [ ] Create login/signup pages
- [ ] Set up auth middleware
- [ ] Configure SendGrid for auth emails
- [ ] Test password reset flow

### Phase 3: Registration Flow 
- [ ] Build registration form component
- [ ] Implement form validation (zod)
- [ ] Set up file upload to Supabase Storage
- [ ] Create URN generation utility
- [ ] Integrate Stripe Checkout
- [ ] Build Stripe webhook handler (Edge Function)
- [ ] Test end-to-end registration flow

### Phase 4: PDF & Email 
- [ ] Create PDF generation Edge Function
- [ ] Design PDF template (matching brand)
- [ ] Implement document embedding in PDF
- [ ] Create email template
- [ ] Build send-confirmation-email Edge Function
- [ ] Test PDF generation + email delivery

### Phase 5: Admin Panel 
- [ ] Set up admin role + middleware
- [ ] Build admin dashboard (registrations table)
- [ ] Implement search/filter/sort
- [ ] Create registration detail view
- [ ] Build template editor
- [ ] Implement CSV export
- [ ] Add GDPR delete functionality

### Phase 6: Content & Legal 
- [ ] Write FAQ content
- [ ] Write About page
- [ ] Copy/adapt Terms & Conditions
- [ ] Copy/adapt Privacy Policy
- [ ] Create Claim form template
- [ ] Create DSAR form template
- [ ] Build URN verification tool
- [ ] Implement cookie consent banner

### Phase 7: Polish & Testing 
- [ ] Mobile responsiveness check
- [ ] Accessibility audit (WCAG AA)
- [ ] Test all user flows
- [ ] Test admin flows
- [ ] Security audit (OWASP basics)
- [ ] Performance optimization
- [ ] SEO meta tags
- [ ] Error handling + user feedback
- [ ] Final brand consistency check

### Phase 8: Deployment 
- [ ] Set up Vercel project
- [ ] Configure environment variables (production)
- [ ] Deploy Supabase Edge Functions
- [ ] Set up Stripe webhooks (production)
- [ ] Deploy to Vercel
- [ ] Test production environment
- [ ] Prepare handover documentation for Simon

---

## 16. Testing Checklist

### 16.1 Registration Flow Testing
- [ ] User can sign up with email/password
- [ ] Email verification works
- [ ] User can log in
- [ ] Form validation displays errors correctly
- [ ] File upload works (PDF, TXT, JPEG, PNG)
- [ ] File upload rejects invalid formats
- [ ] File upload enforces size limit (10MB)
- [ ] Stripe Checkout redirects correctly
- [ ] Payment success triggers URN generation
- [ ] Payment success triggers PDF generation
- [ ] Payment success triggers email
- [ ] Cancelled payment returns user to form
- [ ] URN is unique every time
- [ ] User can view registration in dashboard

### 16.2 PDF Generation Testing
- [ ] PDF includes all required sections
- [ ] PDF uses correct branding (colors, fonts)
- [ ] PDF includes customer details correctly
- [ ] PDF includes unique URN
- [ ] PDF includes uploaded documents
- [ ] PDF includes admin-editable legal text
- [ ] PDF includes underwriter info
- [ ] PDF is properly formatted (A4, margins)
- [ ] PDF downloads successfully
- [ ] PDF can be opened in all major PDF readers

### 16.3 Email Testing
- [ ] Welcome email sends on signup
- [ ] Password reset email works
- [ ] Confirmation email sends after payment
- [ ] Email includes PDF attachment
- [ ] Email displays correctly in Gmail
- [ ] Email displays correctly in Outlook
- [ ] Email displays correctly on mobile
- [ ] Unsubscribe link works (if applicable)

### 16.4 Admin Panel Testing
- [ ] Admin login works
- [ ] Non-admin cannot access admin routes
- [ ] Registrations table loads all data
- [ ] Search works (URN, name, email)
- [ ] Filter by status works
- [ ] Sort by date/name works
- [ ] Pagination works
- [ ] Click row opens detail view
- [ ] Detail view shows all information
- [ ] Uploaded documents can be downloaded
- [ ] PDF certificate can be downloaded
- [ ] CSV export works
- [ ] CSV includes all fields
- [ ] Template editor loads templates
- [ ] Template editor saves changes
- [ ] Template changes reflect in new PDFs
- [ ] GDPR delete removes all user data
- [ ] GDPR delete removes files from storage

### 16.5 URN Verification Testing
- [ ] Valid URN shows "Valid" status
- [ ] Invalid URN shows "Invalid" status
- [ ] Non-existent URN shows "Invalid"
- [ ] Malformed input handled gracefully

### 16.6 Security Testing
- [ ] RLS prevents users accessing other's data
- [ ] Admin middleware blocks non-admin users
- [ ] File uploads reject malicious files
- [ ] SQL injection attempts fail
- [ ] XSS attempts sanitized
- [ ] CSRF protection enabled
- [ ] Environment variables not exposed
- [ ] API keys not leaked in frontend
- [ ] HTTPS enforced in production
- [ ] Passwords hashed (Supabase default)

### 16.7 Mobile Responsiveness Testing
- [ ] Landing page mobile-friendly
- [ ] Registration form mobile-friendly
- [ ] Payment flow works on mobile
- [ ] Dashboard works on mobile
- [ ] Admin panel works on tablet
- [ ] All forms usable on small screens
- [ ] Images load properly on mobile
- [ ] Navigation menu works on mobile

### 16.8 Performance Testing
- [ ] Landing page loads < 3 seconds
- [ ] Registration form submits < 2 seconds
- [ ] Dashboard loads < 2 seconds
- [ ] Admin table loads < 3 seconds (100 records)
- [ ] PDF generation completes < 10 seconds
- [ ] Images optimized (WebP where possible)
- [ ] CSS/JS minified in production
- [ ] Lazy loading implemented where appropriate

---

## 17. Handover Documentation for Simon

### 17.1 Account Setup Required

**Before going live, Simon needs to set up:**

1. **Stripe Account**
   - Sign up at stripe.com
   - Complete business verification
   - Create product + price for insurance registration
   - Get API keys (test + live)
   - Set up webhook endpoint (provided by us)

2. **SendGrid Account**
   - Sign up at sendgrid.com
   - Verify sender email (noreply@insuraguard.com)
   - Get API key
   - (Optional) Create email templates

3. **Supabase Account**
   - Project already created (by us)
   - Provide Simon with admin credentials
   - No additional setup needed

4. **Vercel Account**
   - Project already deployed (by us)
   - Add custom domain (insuraguard.com)
   - Configure DNS records

5. **Domain & Email**
   - Purchase domain (insuraguard.com)
   - Set up business email (support@, noreply@)
   - Configure SPF/DKIM for SendGrid

### 17.2 Admin Guide

**Login:** https://insuraguard.com/admin

**Managing Registrations:**
1. View all registrations in table
2. Use search bar to find specific customer
3. Click row to view full details
4. Download customer's documents
5. Resend confirmation email if needed
6. Export all data to CSV for records

**Editing Templates:**
1. Go to "Templates" tab
2. Select template type
3. Edit content (use {variables} for dynamic data)
4. Click "Save Changes"
5. Preview before saving
6. Changes apply to all new registrations

**GDPR Requests:**
1. Customer emails request to support@
2. Verify customer identity
3. Find customer in admin panel
4. Export their data (CSV) OR delete account
5. Send exported data to customer
6. Log the request (spreadsheet or CRM)

**Stripe Integration:**
1. Go to Stripe Dashboard
2. Navigate to Developers → Webhooks
3. Add endpoint: `https://xxxxx.supabase.co/functions/v1/stripe-webhook`
4. Select events: `checkout.session.completed`
5. Copy webhook secret
6. Provide webhook secret to developer (us) for env variable

### 17.3 Troubleshooting Guide

**Customer didn't receive email:**
1. Check spam folder
2. Verify email in SendGrid logs
3. Resend from admin panel
4. Check SendGrid API key is valid

**Payment succeeded but no certificate:**
1. Check Stripe webhook logs
2. Check Supabase Edge Function logs
3. Manually trigger certificate generation (admin button)

**URN verification not working:**
1. Check database for URN existence
2. Verify RLS policies allow public read on URN field
3. Check API endpoint logs

**Admin can't log in:**
1. Verify admin role set in Supabase Auth
2. Reset password via forgot-password flow
3. Check middleware is not blocking

### 17.4 Maintenance Tasks

**Monthly:**
- Review new registrations count
- Check SendGrid usage (avoid quota)
- Check Stripe failed payments
- Review customer support requests

**Quarterly:**
- Update content (FAQ, About page)
- Review GDPR compliance
- Check for outdated dependencies (notify developer)

**Annually:**
- Renew domain
- Review and update Terms & Conditions
- Review insurance coverage with underwriter
- Update legal text templates

---

## 18. Success Metrics

**Launch Targets (First 30 Days):**
- Minimum 10 successful registrations
- Zero critical bugs reported
- 100% payment success rate
- < 5% customer support requests
- Mobile usage > 40% of traffic

**Quality Metrics:**
- Page load time < 3 seconds (75th percentile)
- Mobile responsiveness score > 95 (Google PageSpeed)
- Accessibility score > 90 (WAVE)
- Uptime > 99.5%

**User Experience:**
- Registration completion rate > 80%
- Payment abandonment rate < 10%
- Customer satisfaction (via feedback form) > 4.5/5

---

## 19. Post-Launch Enhancements (Optional Future Phases)

**Phase 2 Features (if Simon requests):**
- Customer portal with claim submission
- Automated GDPR data export (self-service)
- Multi-language support (Irish, Welsh)
- Installer portal (bulk registration)
- Analytics dashboard (charts, trends)
- Automated certificate renewal reminders
- Live chat support integration
- Mobile app (iOS/Android)

**Pricing for Future Phases:**
- TBD based on scope and timeline

---

## 20. Final Notes for Windsurf Agent

**Code Quality Standards:**
- Use TypeScript strict mode
- Follow Vue 3 Composition API best practices
- Use Tailwind utility classes (no custom CSS unless necessary)
- Implement proper error handling (try/catch, user-friendly messages)
- Add loading states for async operations
- Use semantic HTML (accessibility)
- Comment complex logic
- Keep components under 300 lines
- Extract reusable logic to composables
- Use Zod for all form validation

**Performance Optimizations:**
- Lazy load heavy components
- Use `nuxt/image` for optimized images
- Implement infinite scroll for large tables (admin)
- Cache static content (FAQ, About)
- Minimize bundle size (analyze with Vite)

**Security Best Practices:**
- Never expose service role key in frontend
- Validate all user inputs (frontend + backend)
- Sanitize data before rendering
- Use parameterized queries (Supabase handles this)
- Implement rate limiting on API routes
- Add CORS restrictions
- Use Content Security Policy headers

**Accessibility (WCAG AA):**
- All forms have labels
- Color contrast ratio > 4.5:1
- Keyboard navigation works
- Screen reader friendly
- Alt text for all images
- Focus indicators visible
- Error messages descriptive

**Testing Strategy:**
- Manual testing of all flows
- Test on Chrome, Firefox, Safari
- Test on mobile (iOS Safari, Android Chrome)
- Test admin panel on desktop only (tablet acceptable)
- No automated tests required (7-day deadline)

**Deployment:**
- Use Vercel for frontend (automatic deployments from Git)
- Use Supabase for backend (already hosted)
- Edge Functions deployed via Supabase CLI
- Environment variables set in Vercel dashboard

---

## 21. Quick Reference

**Key URLs:**
- Frontend: https://insuraguard.vercel.app (temp)
- Supabase: https://xxxxx.supabase.co
- Admin Panel: /admin
- Customer Dashboard: /dashboard

**Key Contacts:**
- Developer: Mai (mai@example.com)
- Client: Simon (simon@insuraguard.com)

**Key Dates:**
- Start: December 29, 2025
- Delivery: January 5, 2026 
- Payment: £250 upfront (in escrow), £250 on delivery

**Budget Breakdown:**
- Development: £500
- Supabase: Free tier (sufficient for launch)
- Vercel: Free tier (sufficient for launch)
- Stripe: 1.5% + 20p per transaction (Simon's cost)
- SendGrid: Free tier 100 emails/day (upgrade if needed)

---

**END OF PRD**

This document contains everything needed to build InsuraGuard. Windsurf agent should follow this spec exactly, implementing features in the order specified in Phase Implementation (Section 15). Any ambiguities should be resolved by asking Mai before proceeding.
