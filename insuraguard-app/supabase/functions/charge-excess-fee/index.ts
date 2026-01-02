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
    const { registrationId, claimId } = await req.json()

    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get registration by URN first, then by ID
    let registration
    let error
    
    // Try to find by URN first
    const { data: regByUrn, error: urnError } = await supabase
      .from('registrations')
      .select('id, stripe_customer_id, email, full_name, urn')
      .eq('urn', registrationId)
      .single()
    
    if (!urnError && regByUrn) {
      // Found by URN, use this registration
      registration = regByUrn
      error = null
    } else {
      // Try to find by ID (UUID)
      const { data: regById, error: idError } = await supabase
        .from('registrations')
        .select('stripe_customer_id, email, full_name, urn')
        .eq('id', registrationId)
        .single()
      
      registration = regById
      error = idError
    }

    if (error || !registration) {
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!registration.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: 'No payment method on file for this registration' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const excessPriceId = Deno.env.get('STRIPE_PRICE_EXCESS')
    if (!excessPriceId) {
      return new Response(
        JSON.stringify({ error: 'Excess fee price not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Stripe Checkout session for the excess fee
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      customer: registration.stripe_customer_id,
      payment_method_types: ['card'],
      line_items: [{
        price: excessPriceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/claim?payment=success`,
      cancel_url: `${baseUrl}/claim?payment=cancelled`,
      metadata: {
        registrationId,
        claimId: claimId || '',
        feeType: 'excess',
      },
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionId: session.id,
        url: session.url,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error in charge-excess-fee:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment failed',
        details: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
