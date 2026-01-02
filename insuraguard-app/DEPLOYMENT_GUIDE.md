# InsuraGuard Production Deployment Guide

## 🎯 Pre-Deployment Checklist

### ✅ Code Quality
- [x] All user flows tested (Registration, Claims, Ownership Transfer, PDF Download)
- [x] All emails consolidated to support@insuraguard.co.uk
- [x] Dark mode support implemented
- [x] Logo sizes optimized
- [x] No test emails or hardcoded values in production code
- [x] Console.logs are for debugging only (acceptable for Edge Functions)

### ⚠️ Known Items (Non-blocking)
- Console.logs in Edge Functions are intentional for debugging/monitoring
- TypeScript lints for Deno modules are expected (IDE doesn't have Deno types)

---

## 📋 Deployment Steps

### **STEP 1: Create Stripe Products (Live Mode)**

⚠️ **IMPORTANT:** Switch to **LIVE MODE** in Stripe Dashboard

#### 1.1 Create Missing Fee Products

You already have these products in TEST mode. Now create them in LIVE mode:

**A. Claim Excess Fee Product**
1. Go to Stripe Dashboard → Products → Create Product
2. **Name:** Claim Excess Fee
3. **Description:** Excess fee for insurance claim submission
4. **Pricing:**
   - **Price:** £29.95
   - **Billing:** One-time
   - **Currency:** GBP
5. Click **Save Product**
6. **Copy the Price ID** (starts with `price_live_...`)
7. Save as: `STRIPE_PRICE_EXCESS`

**B. Ownership Transfer Admin Fee Product**
1. Go to Stripe Dashboard → Products → Create Product
2. **Name:** Ownership Transfer Admin Fee
3. **Description:** Administrative fee for ownership transfer
4. **Pricing:**
   - **Price:** £25.00
   - **Billing:** One-time
   - **Currency:** GBP
5. Click **Save Product**
6. **Copy the Price ID** (starts with `price_live_...`)
7. Save as: `STRIPE_PRICE_ADMIN`

#### 1.2 Verify Existing Registration Products

Make sure you have these 4 products in LIVE mode:
- **Under 12 months:** £99.99
- **1-2 years:** £199.99
- **2-3 years:** £289.00
- **3-4 years:** £499.99

Copy all 4 Price IDs for later.

#### 1.3 Create Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add Endpoint**
3. **Endpoint URL:** `https://gkgjckeqralugtncfwva.supabase.co/functions/v1/stripe-webhook`
4. **Events to send:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Click **Add Endpoint**
6. **Copy the Signing Secret** (starts with `whsec_...`)
7. Save as: `STRIPE_WEBHOOK_SECRET`

---

### **STEP 2: Configure Supabase Secrets**

#### 2.1 Set Edge Function Secrets

Run these commands in your terminal (replace values with your LIVE credentials):

```bash
# Navigate to project directory
cd c:\Users\Mai\Desktop\InsuraGuard\insuraguard-app

# Set Stripe secrets (LIVE mode keys)
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# Set Stripe Price IDs (LIVE mode)
npx supabase secrets set STRIPE_PRICE_0_12=price_live_YOUR_PRICE_ID
npx supabase secrets set STRIPE_PRICE_12_24=price_live_YOUR_PRICE_ID
npx supabase secrets set STRIPE_PRICE_24_36=price_live_YOUR_PRICE_ID
npx supabase secrets set STRIPE_PRICE_36_48=price_live_YOUR_PRICE_ID
npx supabase secrets set STRIPE_PRICE_EXCESS=price_live_YOUR_EXCESS_PRICE_ID
npx supabase secrets set STRIPE_PRICE_ADMIN=price_live_YOUR_ADMIN_PRICE_ID

# Set SendGrid API Key
npx supabase secrets set SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY

# Set Site URL (your production domain)
npx supabase secrets set SITE_URL=https://insuraguard.co.uk

# Set Supabase credentials (already set, but verify)
npx supabase secrets set SUPABASE_URL=https://gkgjckeqralugtncfwva.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

#### 2.2 Verify Secrets

```bash
npx supabase secrets list
```

You should see all secrets listed (values will be hidden).

---

### **STEP 3: Deploy to Vercel**

#### 3.1 Prepare Environment Variables

Create a `.env.production` file with these values:

```env
# Supabase
SUPABASE_URL=https://gkgjckeqralugtncfwva.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Stripe (LIVE MODE)
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# Stripe Price IDs (LIVE MODE)
STRIPE_PRICE_0_12=price_live_YOUR_PRICE_ID
STRIPE_PRICE_12_24=price_live_YOUR_PRICE_ID
STRIPE_PRICE_24_36=price_live_YOUR_PRICE_ID
STRIPE_PRICE_36_48=price_live_YOUR_PRICE_ID
STRIPE_PRICE_EXCESS=price_live_YOUR_EXCESS_PRICE_ID
STRIPE_PRICE_ADMIN=price_live_YOUR_ADMIN_PRICE_ID

# SendGrid
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY

# Site
SITE_URL=https://insuraguard.co.uk
```

#### 3.2 Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to client's Vercel account
vercel login

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Login to **client's account**
3. Click **Add New Project**
4. Import from Git repository
5. Configure:
   - **Framework Preset:** Nuxt.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.output`
6. Add all environment variables from `.env.production`
7. Click **Deploy**

#### 3.3 Configure Environment Variables in Vercel

After deployment, verify all environment variables:

1. Go to Project Settings → Environment Variables
2. Ensure all variables are set for **Production** environment
3. Redeploy if you add/change any variables

---

### **STEP 4: Configure Custom Domain**

#### 4.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Click **Add Domain**
3. Enter: `insuraguard.co.uk`
4. Add: `www.insuraguard.co.uk` (optional)
5. Vercel will provide DNS records

#### 4.2 Update DNS Records

Go to your domain registrar and add these DNS records:

**For root domain (insuraguard.co.uk):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 4.3 Update SITE_URL

After domain is active, update the SITE_URL:

**In Vercel:**
1. Project Settings → Environment Variables
2. Update `SITE_URL` to `https://insuraguard.co.uk`
3. Redeploy

**In Supabase:**
```bash
npx supabase secrets set SITE_URL=https://insuraguard.co.uk
```

---

### **STEP 5: Final Verification**

#### 5.1 Test Registration Flow
1. Go to https://insuraguard.co.uk/register
2. Complete registration form
3. Pay with test card: `4242 4242 4242 4242`
4. Verify:
   - ✅ Payment successful
   - ✅ Certificate generated
   - ✅ Confirmation email received
   - ✅ Email from support@insuraguard.co.uk

#### 5.2 Test Claim Flow (Online Submission)
1. Go to https://insuraguard.co.uk/claim
2. Fill out claim form
3. Upload documents
4. Pay excess fee (£29.95)
5. Verify:
   - ✅ Payment successful
   - ✅ Claim submitted
   - ✅ User confirmation email received
   - ✅ Support email with attachments received

#### 5.3 Test Claim Flow (PDF Download)
1. Go to https://insuraguard.co.uk/claim
2. Enter URN
3. Click "Pay & Download PDF Form"
4. Pay excess fee (£29.95)
5. Verify:
   - ✅ Payment successful
   - ✅ PDF downloads with claim ID
   - ✅ Instructions email received
   - ✅ Claim ID visible in PDF

#### 5.4 Test Ownership Transfer
1. Login to dashboard
2. Select a registration
3. Click "Transfer Ownership"
4. Enter new owner details
5. Pay admin fee (£25.00)
6. Verify:
   - ✅ Payment successful
   - ✅ Ownership transferred
   - ✅ New owner email received
   - ✅ Previous owner email received
   - ✅ Support notification received

#### 5.5 Verify Stripe Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Check recent events
4. Verify all events show "Succeeded"

#### 5.6 Verify Dark Mode
1. Enable dark mode in browser
2. Check:
   - ✅ Navbar shows white logo
   - ✅ Navbar text is white
   - ✅ Footer logos show white
   - ✅ All text is readable

---

## 🔐 Security Checklist

- [x] All API keys are in environment variables (not hardcoded)
- [x] Service role key is only used in Edge Functions (server-side)
- [x] Anon key is used in frontend (safe for public)
- [x] Stripe webhook signature verification enabled
- [x] RLS (Row Level Security) enabled on all tables
- [x] Admin routes protected with middleware
- [x] All emails use support@insuraguard.co.uk

---

## 📧 Email Configuration

All emails are sent from: **support@insuraguard.co.uk**

**Email Types:**
1. **Registration Confirmation** - Certificate + Receipt
2. **Claim Confirmation (Online)** - Claim reference + next steps
3. **Claim Instructions (PDF)** - Claim reference + submission instructions
4. **Claim Support Email** - Full claim details with attachments
5. **Ownership Transfer (New Owner)** - Welcome + certificate
6. **Ownership Transfer (Previous Owner)** - Confirmation
7. **Ownership Transfer (Support)** - Notification

---

## 🎨 Branding

**Logo Files:**
- Light backgrounds: `/InsuraGuard-logo-transparent-1200.png`
- Dark backgrounds: `/InsuraGuard-logo-transparent_white-1200.png`

**Colors:**
- Orange: `#E67E22`
- Charcoal: `#3A3A3A`
- Black: `#000000`

**Email Branding:**
- Header: Black "Insura" + Orange "Guard" on white background
- All emails from: support@insuraguard.co.uk

---

## 🔄 Post-Deployment Monitoring

### Monitor These:

1. **Stripe Dashboard**
   - Check for failed payments
   - Monitor webhook delivery

2. **Supabase Logs**
   - Edge Functions logs
   - Database errors

3. **Email Delivery**
   - SendGrid dashboard
   - Check spam reports

4. **Support Email**
   - Monitor support@insuraguard.co.uk
   - Respond to claim submissions

---

## 🆘 Troubleshooting

### Issue: Webhook not receiving events
**Solution:** 
- Verify webhook URL in Stripe
- Check webhook secret matches
- Review Supabase Edge Function logs

### Issue: Emails not sending
**Solution:**
- Verify SendGrid API key
- Check SendGrid dashboard for errors
- Ensure sender email is verified

### Issue: Payment fails
**Solution:**
- Check Stripe price IDs are correct (LIVE mode)
- Verify Stripe secret key is LIVE key
- Check customer has valid payment method

### Issue: Certificate not generating
**Solution:**
- Check Supabase storage bucket exists
- Verify service role key has permissions
- Review Edge Function logs

---

## 📞 Support Contacts

**Technical Issues:**
- Supabase: https://supabase.com/dashboard/support
- Stripe: https://support.stripe.com
- Vercel: https://vercel.com/help

**Email Support:**
- support@insuraguard.co.uk

---

## ✅ Deployment Complete!

Once all steps are completed and verified, your InsuraGuard application is live and ready for production use! 🚀

**Next Steps:**
1. Monitor the first few transactions closely
2. Set up error alerting (Sentry, LogRocket, etc.)
3. Create backup/restore procedures
4. Document admin procedures for claim processing
5. Train support staff on admin panel usage

---

**Deployed by:** [Your Name]  
**Deployment Date:** [Date]  
**Version:** 1.0.0
