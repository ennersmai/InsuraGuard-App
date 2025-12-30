import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.11.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { registrationId } = await req.json()

    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'InsuraGuard Registration',
              description: '10-year insurance-backed guarantee for clean energy system',
            },
            unit_amount: 9900, // £99.00
          },
          quantity: 1,
        },
      ],
      success_url: `${Deno.env.get('SITE_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('SITE_URL')}/checkout/${registrationId}`,
      metadata: {
        registrationId,
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
