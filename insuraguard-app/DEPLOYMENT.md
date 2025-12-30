# InsuraGuard Deployment Guide

## Supabase Edge Functions Deployment

### Prerequisites
1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`

### Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy generate-certificate
supabase functions deploy send-confirmation-email
```

### Set Edge Function Secrets

```bash
# Stripe
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# SendGrid
supabase secrets set SENDGRID_API_KEY=SG.xxxxx

# Site URL
supabase secrets set SITE_URL=https://your-domain.com

# Supabase (already available in edge functions)
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected
```

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
3. Select events to listen to:
   - `checkout.session.completed`
4. Copy the webhook signing secret
5. Set it as `STRIPE_WEBHOOK_SECRET` in Supabase secrets

## Vercel Deployment

### 1. Connect Repository
1. Go to Vercel dashboard
2. Import your Git repository
3. Select the `insuraguard-app` directory as root

### 2. Configure Build Settings
- **Framework Preset**: Nuxt.js
- **Build Command**: `npm run build`
- **Output Directory**: `.output`
- **Install Command**: `npm install`

### 3. Environment Variables

Add these in Vercel dashboard:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
SITE_URL=https://your-domain.com
```

**Note**: Do NOT add secret keys (STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, etc.) to Vercel. These should only be in Supabase Edge Function secrets.

### 4. Deploy
```bash
vercel --prod
```

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Storage buckets created with correct policies
- [ ] Edge functions deployed and accessible
- [ ] Stripe webhook configured and receiving events
- [ ] Test user registration flow end-to-end
- [ ] Test payment flow with Stripe test cards
- [ ] Verify PDF generation works
- [ ] Verify email delivery works
- [ ] Test admin panel access
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)

## Testing Payment Flow

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Monitoring

- **Vercel**: Check deployment logs and analytics
- **Supabase**: Monitor Edge Function logs
- **Stripe**: Check webhook delivery logs

## Troubleshooting

### Edge Function Errors
Check logs: `supabase functions logs FUNCTION_NAME`

### Webhook Not Receiving Events
1. Verify webhook URL is correct
2. Check Stripe webhook signing secret matches
3. Review Stripe webhook delivery attempts

### Email Not Sending
1. Verify SendGrid API key is correct
2. Check sender email is verified in SendGrid
3. Review SendGrid activity logs
