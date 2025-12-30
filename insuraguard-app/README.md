# InsuraGuard - Insurance-Backed Protection for Clean Energy

Insurance platform for clean energy installations (solar panels, battery storage systems). Built with Nuxt 3, Supabase, Stripe, and SendGrid.

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments**: Stripe
- **Email**: SendGrid
- **Deployment**: Vercel

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `SENDGRID_API_KEY` - SendGrid API key
- `SITE_URL` - Your site URL (http://localhost:3000 for dev)

### 3. Database Setup

Run the migrations in your Supabase project:

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/20250101000000_initial_schema.sql`
3. Run `supabase/migrations/20250101000001_storage_setup.sql`

### 4. Set Admin Role

To set a user as admin, run this in Supabase SQL Editor:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

### 5. Deploy Edge Functions

Deploy the Supabase Edge Functions from the `supabase/functions` directory using the Supabase CLI.

## Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
insuraguard-app/
├── assets/css/          # Global styles
├── components/          # Vue components
├── layouts/             # Layout components
├── pages/               # Route pages
├── middleware/          # Route middleware
├── utils/               # Utility functions
├── types/               # TypeScript types
├── supabase/
│   ├── migrations/      # Database migrations
│   └── functions/       # Edge Functions
└── public/              # Static assets
```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Supabase Edge Functions

```bash
supabase functions deploy
```

## Features

- ✅ User authentication (Supabase Auth)
- ✅ Registration form with file uploads
- ✅ Stripe payment integration
- ✅ PDF certificate generation
- ✅ Email delivery (SendGrid)
- ✅ Admin panel
- ✅ URN verification
- ✅ GDPR compliance

## Brand Guidelines

- **Primary Color**: Charcoal Grey (#3A3A3A)
- **Accent Color**: Warm Amber Orange (#E67E22)
- **Font**: Inter
- **Logo**: "Insura" (Charcoal) + "Guard" (Amber)

## License

Proprietary - All rights reserved
