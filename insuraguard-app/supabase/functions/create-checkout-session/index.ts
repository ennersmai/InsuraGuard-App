import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.11.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { registrationId, priceId, customerEmail } = await req.json()

    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Price ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get registration to check for existing customer
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('stripe_customer_id, email')
      .eq('id', registrationId)
      .single()

    if (regError || !registration) {
      return new Response(
        JSON.stringify({ error: 'Registration not found', details: regError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let customerId = registration?.stripe_customer_id

    // Create or retrieve Stripe customer for future off-session payments
    if (!customerId && (customerEmail || registration?.email)) {
      const email = customerEmail || registration?.email
      
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: email,
          metadata: {
            registrationId,
          },
        })
        customerId = customer.id
      }

      // Save customer ID to registration
      await supabase
        .from('registrations')
        .update({ stripe_customer_id: customerId })
        .eq('id', registrationId)
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${Deno.env.get('SITE_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('SITE_URL')}/checkout/${registrationId}`,
      metadata: {
        registrationId,
      },
      // Enable saving payment method for future off-session charges
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
    }

    // Attach customer if we have one
    if (customerId) {
      sessionConfig.customer = customerId
    } else if (customerEmail || registration?.email) {
      sessionConfig.customer_email = customerEmail || registration?.email
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
