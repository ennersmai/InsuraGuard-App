# Stripe Integration Setup Instructions

## Overview
This guide will help you set up Stripe for InsuraGuard with 4 pricing tiers, webhook integration, and proper API key configuration.

## Step 1: Create Stripe Account
1. Go to https://stripe.com and create an account (or log in)
2. Complete business verification
3. Navigate to your Dashboard

## Step 2: Create Products and Prices

Create 4 products in Stripe Dashboard (Products → Add Product):

### Product 1: Under 12 Months Coverage
- **Product Name:** InsuraGuard - Under 12 Months
- **Description:** 10 years of insurance-backed guarantee coverage for battery systems under 12 months old
- **Price:** £99.99 GBP
- **Billing:** One-time payment
- **After creation, copy the Price ID** (starts with `price_...`)

### Product 2: 1-2 Years Coverage
- **Product Name:** InsuraGuard - 1-2 Years Old
- **Description:** 8-9 years of insurance-backed guarantee coverage for battery systems 1-2 years old
- **Price:** £199.99 GBP
- **Billing:** One-time payment
- **After creation, copy the Price ID** (starts with `price_...`)

### Product 3: 2-3 Years Coverage
- **Product Name:** InsuraGuard - 2-3 Years Old
- **Description:** 7-8 years of insurance-backed guarantee coverage for battery systems 2-3 years old
- **Price:** £289.00 GBP
- **Billing:** One-time payment
- **After creation, copy the Price ID** (starts with `price_...`)

### Product 4: 3-4 Years Coverage
- **Product Name:** InsuraGuard - 3-4 Years Old
- **Description:** 6-7 years of insurance-backed guarantee coverage for battery systems 3-4 years old
- **Price:** £499.99 GBP
- **Billing:** One-time payment
- **After creation, copy the Price ID** (starts with `price_...`)

## Step 3: Configure Webhook

1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter the webhook URL:
   ```
   https://gkgjckeqralugtncfwva.supabase.co/functions/v1/stripe-webhook
   ```
4. Select the following events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing Secret** (starts with `whsec_...`)

## Step 4: Get API Keys

### For Testing (Development):
1. Go to **Developers → API Keys**
2. Copy the **Publishable key** (starts with `pk_test_...`)
3. Reveal and copy the **Secret key** (starts with `sk_test_...`)

### For Production (Live):
1. Toggle to **Live mode** in the top right
2. Go to **Developers → API Keys**
3. Copy the **Publishable key** (starts with `pk_live_...`)
4. Reveal and copy the **Secret key** (starts with `sk_live_...`)

## Step 5: Credentials to Provide

Please provide the following credentials:

```
# Stripe API Keys (Live Mode)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Webhook Signing Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs for each tier
STRIPE_PRICE_0_12=price_...    # Under 12 months - £99.99
STRIPE_PRICE_12_24=price_...   # 1-2 years - £199.99
STRIPE_PRICE_24_36=price_...   # 2-3 years - £289.00
STRIPE_PRICE_36_48=price_...   # 3-4 years - £499.99
```

## Step 6: Where These Will Be Added

These credentials will be added to:
1. **Supabase Edge Function Secrets** (for backend)
2. **Nuxt Runtime Config** (for frontend publishable key only)

## Security Notes

- ✅ Never commit API keys to Git
- ✅ Use test keys during development
- ✅ Only switch to live keys when ready for production
- ✅ Webhook secret validates that requests are from Stripe
- ✅ Secret key is only used server-side (Edge Functions)

## Testing the Integration

After setup:
1. Use Stripe test cards: `4242 4242 4242 4242` (any future date, any CVC)
2. Complete a test registration
3. Verify webhook receives the event
4. Check that registration is marked as paid in database

## Support

If you encounter issues:
- Check Stripe Dashboard → Developers → Logs for API errors
- Check Stripe Dashboard → Developers → Webhooks → [your endpoint] for webhook delivery logs
- Check Supabase Edge Function logs for processing errors
