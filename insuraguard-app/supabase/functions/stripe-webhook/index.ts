import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.11.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const registrationId = session.metadata?.registrationId

      if (!registrationId) {
        throw new Error('No registration ID in metadata')
      }

      // Generate unique URN
      const urn = await getUniqueURN()

      // Update registration with payment info and URN
      const { error: updateError } = await supabase
        .from('registrations')
        .update({
          urn,
          stripe_payment_id: session.payment_intent as string,
          payment_status: 'completed',
          payment_amount: (session.amount_total || 0) / 100,
        })
        .eq('id', registrationId)

      if (updateError) throw updateError

      // Trigger PDF generation
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({ registrationId }),
      })

      // Trigger email sending
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({ registrationId }),
      })
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function getUniqueURN(): Promise<string> {
  const year = new Date().getFullYear()
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let urn: string
  let exists = true

  while (exists) {
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    urn = `IG-${year}-${code}`

    const { data } = await supabase
      .from('registrations')
      .select('id')
      .eq('urn', urn)
      .single()

    exists = !!data
  }

  return urn!
}
