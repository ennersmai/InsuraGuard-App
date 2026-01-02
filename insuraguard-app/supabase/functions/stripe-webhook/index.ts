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

console.log('Supabase URL:', Deno.env.get('SUPABASE_URL'))
console.log('Service Role Key exists:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))

serve(async (req) => {
  console.log('Webhook received:', req.method, req.url)
  
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  console.log('Webhook body length:', body.length)
  console.log('Signature:', signature?.substring(0, 50) + '...')
  
  // Implement Deno-compatible signature verification
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
  
  if (!signature) {
    console.error('No signature provided')
    return new Response('No signature', { status: 400, headers: corsHeaders })
  }
  
  console.log('Attempting signature verification...')
  
  let event
  try {
    // Use Stripe's async constructEvent method for Deno compatibility
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    console.log('Signature verified successfully')
  } catch (sigError) {
    console.error('Signature verification failed:', sigError.message)
    console.error('Webhook secret length:', webhookSecret.length)
    console.error('Signature format:', signature.substring(0, 50) + '...')
    return new Response('Invalid signature', { status: 400, headers: corsHeaders })
  }
  console.log('Event type:', event.type)
  console.log('Event ID:', event.id)
  console.log('Event metadata:', JSON.stringify(event.data.object.metadata || {}, null, 2))

  // Check for idempotency - prevent processing the same event multiple times
  const eventId = event.id
  const idempotencyKey = `webhook_${eventId}`
  
  try {
    // Try to insert the event ID to track processed events
    const { error: insertError } = await supabase
      .from('webhook_events')
      .insert({
        event_id: eventId,
        event_type: event.type,
        processed_at: new Date().toISOString()
      })
    
    // If we get an error, it might be a duplicate
    if (insertError) {
      console.log('Event already processed or failed to track, skipping:', eventId)
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('Failed to track webhook event:', error)
    // Continue processing even if tracking fails
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const feeType = session.metadata?.feeType

      // Handle excess fee payment
      if (feeType === 'excess') {
        await handleExcessFeePayment(session)
      } else if (feeType === 'ownership_transfer') {
        await handleOwnershipTransfer(session)
      } else {
        // Handle regular registration payment
        console.log('Handling regular registration payment')
        await handleRegistrationPayment(session)
      }
    } else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const feeType = paymentIntent.metadata?.feeType

      // Handle excess fee payment (for direct payment intents)
      if (feeType === 'excess') {
        await handleExcessFeePayment(paymentIntent)
      } else {
        console.log('Ignoring payment_intent.succeeded for unknown fee type:', feeType)
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      await handleSessionExpired(session)
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentFailed(paymentIntent)
    } else {
      console.log('Ignoring event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getUniqueURN(): Promise<string> {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const day = String(new Date().getDate()).padStart(2, '0')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let urn: string
  let exists = true

  while (exists) {
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    urn = `URN-${year}${month}${day}-${code}`

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('urn', urn)
        .single()
      
      if (error) {
        // If error is "No rows found", that's expected - URN is unique
        if (error.code === 'PGRST116') {
          exists = false
        } else {
          console.error('Database query error in getUniqueURN:', error)
          // For database connection errors, just use the URN anyway
          if (error.code === '3F000') {
            console.log('Database connection issue, using generated URN anyway')
            exists = false
          } else {
            throw error
          }
        }
      } else {
        exists = !!data
      }
    } catch (error) {
      console.error('Unexpected error in getUniqueURN:', error)
      // For unexpected errors, just generate a new URN
      exists = false
    }
  }

  return urn!
}

async function handleRegistrationPayment(session: Stripe.Checkout.Session) {
  console.log('handleRegistrationPayment called with session:', session.id)
  const registrationId = session.metadata?.registrationId
  console.log('Registration ID from metadata:', registrationId)

  if (!registrationId) {
    console.error('No registration ID in metadata')
    throw new Error('No registration ID in metadata')
  }

  // Generate unique URN
  const urn = await getUniqueURN()

  // Update registration with payment info and URN
  try {
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        urn,
        stripe_payment_id: session.payment_intent as string,
        stripe_customer_id: session.customer as string,
        payment_status: 'completed',
        payment_amount: (session.amount_total || 0) / 100,
      })
      .eq('id', registrationId)

    if (updateError) {
      console.error('Database update error:', updateError)
      // For database connection errors, continue with certificate generation anyway
      if (updateError.code === '3F000') {
        console.log('Database connection issue during update, continuing with certificate generation')
      } else {
        throw updateError
      }
    } else {
      console.log('Registration updated successfully with URN:', urn)
    }
  } catch (error) {
    console.error('Failed to update registration:', error)
    throw error
  }

  // Trigger PDF generation
  try {
    const certResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-certificate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({ registrationId }),
    })
    
    if (!certResponse.ok) {
      const errorText = await certResponse.text()
      console.error('Certificate generation failed:', errorText)
    } else {
      console.log('Certificate generation triggered successfully')
    }
  } catch (error) {
    console.error('Failed to trigger certificate generation:', error)
  }

  // Trigger email sending
  try {
    const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-confirmation-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({ registrationId }),
    })
    
    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Email sending failed:', errorText)
    } else {
      console.log('Email sending triggered successfully')
    }
  } catch (error) {
    console.error('Failed to trigger email sending:', error)
  }
}

async function handleOwnershipTransfer(session: Stripe.Checkout.Session) {
  const registrationId = session.metadata?.registrationId
  const transferId = session.metadata?.transferId
  const newOwnerEmail = session.metadata?.newOwnerEmail
  const newOwnerName = session.metadata?.newOwnerName
  const newOwnerPhone = session.metadata?.newOwnerPhone
  const newOwnerAddress = session.metadata?.newOwnerAddress

  if (!registrationId || !transferId) {
    throw new Error('Missing registration or transfer ID in metadata')
  }

  // Update ownership transfer record
  const { error: transferError } = await supabase
    .from('ownership_transfers')
    .update({
      status: 'completed',
      stripe_payment_id: session.payment_intent as string,
      payment_amount: (session.amount_total || 0) / 100,
      completed_at: new Date().toISOString(),
    })
    .eq('id', transferId)

  if (transferError) throw transferError

  // Get current registration to preserve history
  const { data: currentReg } = await supabase
    .from('registrations')
    .select('full_name, email, phone, installation_address')
    .eq('id', registrationId)
    .single()

  // Update registration with new owner details
  const { error: regError } = await supabase
    .from('registrations')
    .update({
      full_name: newOwnerName,
      email: newOwnerEmail,
      phone: newOwnerPhone || null,
      installation_address: newOwnerAddress || null,
      previous_owner_name: currentReg?.full_name,
      previous_owner_email: currentReg?.email,
      ownership_transferred_at: new Date().toISOString(),
    })
    .eq('id', registrationId)

  if (regError) throw regError

  // Send confirmation email to new owner
  await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-ownership-transfer-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
    },
    body: JSON.stringify({ 
      registrationId, 
      transferId,
      newOwnerEmail,
      previousOwnerEmail: currentReg?.email,
    }),
  })
}

async function handleExcessFeePayment(paymentObject: Stripe.Checkout.Session | Stripe.PaymentIntent) {
  console.log('Handling excess fee payment:', paymentObject.id)
  console.log('Payment object type:', paymentObject.object_type)
  console.log('Payment metadata:', JSON.stringify(paymentObject.metadata || {}, null, 2))
  
  // Handle different types of payment objects
  const registrationId = paymentObject.metadata?.registrationId
  const claimId = paymentObject.metadata?.claimId
  const paymentAmount = 'amount_total' in paymentObject ? paymentObject.amount_total : paymentObject.amount
  const paymentDate = 'created' in paymentObject ? paymentObject.created * 1000 : paymentObject.created
  
  console.log('Extracted registrationId:', registrationId)
  console.log('Extracted claimId:', claimId)
  
  if (!registrationId) {
    console.error('No registration ID in payment metadata')
    return
  }

  try {
    // Get registration details - registrationId could be URN or UUID
    let registration
    let regError
    
    // Try to find by URN first (if it starts with URN-)
    if (registrationId.startsWith('URN-')) {
      const result = await supabase
        .from('registrations')
        .select('urn, full_name, email, phone, installation_address')
        .eq('urn', registrationId)
        .single()
      registration = result.data
      regError = result.error
    } else {
      // Otherwise try by ID
      const result = await supabase
        .from('registrations')
        .select('urn, full_name, email, phone, installation_address')
        .eq('id', registrationId)
        .single()
      registration = result.data
      regError = result.error
    }

    if (regError || !registration) {
      console.error('Registration not found for excess fee:', registrationId)
      return
    }

    // Note: Email will be sent by frontend after claim is submitted with full details
    console.log('Excess fee payment processed for URN:', registration.urn)
    console.log('Claim will be submitted by frontend with full details')
  } catch (error) {
    console.error('Error handling excess fee payment:', error)
  }
}

async function handleSessionExpired(session: Stripe.Checkout.Session) {
  console.log('Handling expired checkout session:', session.id)
  const registrationId = session.metadata?.registrationId
  const feeType = session.metadata?.feeType

  if (!registrationId) {
    console.log('No registration ID in expired session metadata')
    return
  }

  try {
    // Update registration status based on payment type
    if (feeType === 'excess' || feeType === 'ownership_transfer') {
      // For fee payments, just log - user can retry
      console.log(`${feeType} payment session expired for registration:`, registrationId)
    } else {
      // For initial registration payment, mark as payment_failed
      const { error } = await supabase
        .from('registrations')
        .update({
          payment_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId)

      if (error) {
        console.error('Failed to update registration status on session expiry:', error)
      } else {
        console.log('Registration marked as payment failed due to session expiry:', registrationId)
      }
    }
  } catch (error) {
    console.error('Error handling session expiry:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Handling failed payment intent:', paymentIntent.id)
  const registrationId = paymentIntent.metadata?.registrationId
  const feeType = paymentIntent.metadata?.feeType

  if (!registrationId) {
    console.log('No registration ID in failed payment metadata')
    return
  }

  try {
    // Log failure details
    const failureMessage = paymentIntent.last_payment_error?.message || 'Unknown error'
    console.log('Payment failure reason:', failureMessage)
    console.log('Payment failed for registration:', registrationId, 'Fee type:', feeType)

    // For initial registration payments, update status
    if (!feeType || feeType === 'registration') {
      const { error } = await supabase
        .from('registrations')
        .update({
          payment_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId)

      if (error) {
        console.error('Failed to update registration status on payment failure:', error)
      } else {
        console.log('Registration marked as payment failed:', registrationId)
      }
    }

    // For fee payments (excess, ownership transfer), just log - user can retry
    // No database update needed as these are optional retryable actions
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}
