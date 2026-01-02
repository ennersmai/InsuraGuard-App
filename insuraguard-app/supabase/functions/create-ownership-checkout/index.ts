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
    const { 
      registrationId, 
      newOwnerEmail, 
      newOwnerName, 
      newOwnerPhone,
      newOwnerAddress 
    } = await req.json()

    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!newOwnerEmail || !newOwnerName) {
      return new Response(
        JSON.stringify({ error: 'New owner email and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify registration exists
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('id, urn, full_name, email')
      .eq('id', registrationId)
      .single()

    if (regError || !registration) {
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminPriceId = Deno.env.get('STRIPE_PRICE_ADMIN')
    if (!adminPriceId) {
      return new Response(
        JSON.stringify({ error: 'Admin fee price not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a pending ownership transfer record
    const { data: transfer, error: transferError } = await supabase
      .from('ownership_transfers')
      .insert({
        registration_id: registrationId,
        previous_owner_name: registration.full_name,
        previous_owner_email: registration.email,
        new_owner_name: newOwnerName,
        new_owner_email: newOwnerEmail,
        new_owner_phone: newOwnerPhone || null,
        new_owner_address: newOwnerAddress || null,
        status: 'pending_payment',
      })
      .select()
      .single()

    if (transferError) {
      console.error('Transfer record error:', transferError)
      return new Response(
        JSON.stringify({ error: 'Failed to create transfer record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Stripe Checkout Session for the admin fee
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: adminPriceId,
          quantity: 1,
        },
      ],
      customer_email: newOwnerEmail,
      success_url: `${Deno.env.get('SITE_URL')}/transfer/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('SITE_URL')}/transfer/cancel?transfer_id=${transfer.id}`,
      metadata: {
        registrationId,
        transferId: transfer.id,
        feeType: 'ownership_transfer',
        newOwnerEmail,
        newOwnerName,
        newOwnerPhone: newOwnerPhone || '',
        newOwnerAddress: newOwnerAddress || '',
      },
    })

    // Update transfer record with session ID
    await supabase
      .from('ownership_transfers')
      .update({ stripe_session_id: session.id })
      .eq('id', transfer.id)

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        sessionUrl: session.url,
        transferId: transfer.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Create ownership checkout error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
