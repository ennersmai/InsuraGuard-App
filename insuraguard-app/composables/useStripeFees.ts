/**
 * Composable for handling Stripe fee operations
 * 
 * Usage:
 * 
 * 1. Claim Excess Fee (£29.95) - Off-session charge:
 *    const { chargeExcessFee } = useStripeFees()
 *    const result = await chargeExcessFee(registrationId, claimId)
 * 
 * 2. Ownership Transfer Admin Fee (£49.95) - Checkout redirect:
 *    const { createOwnershipCheckout } = useStripeFees()
 *    const result = await createOwnershipCheckout({
 *      registrationId,
 *      newOwnerEmail,
 *      newOwnerName,
 *      newOwnerPhone,
 *      newOwnerAddress
 *    })
 */

interface ExcessFeeResult {
  success: boolean
  sessionId?: string
  url?: string
  error?: string
  details?: string
}

interface OwnershipCheckoutResult {
  sessionId?: string
  sessionUrl?: string
  transferId?: string
  error?: string
}

interface OwnershipCheckoutParams {
  registrationId: string
  newOwnerEmail: string
  newOwnerName: string
  newOwnerPhone?: string
  newOwnerAddress?: string
}

export const useStripeFees = () => {
  const config = useRuntimeConfig()

  /**
   * Charge the claim excess fee (£29.95) to the customer's saved payment method
   * This is an off-session charge using Stripe Invoices
   * 
   * @param registrationId - The registration ID to charge
   * @param claimId - Optional claim ID to associate with the charge
   * @returns Promise with charge result
   */
  const chargeExcessFee = async (
    registrationId: string,
    claimId?: string
  ): Promise<ExcessFeeResult> => {
    try {
      const response = await fetch(
        `${config.public.supabaseUrl}/functions/v1/charge-excess-fee`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.public.supabaseAnonKey}`,
          },
          body: JSON.stringify({
            registrationId,
            claimId,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to charge excess fee',
          details: data.details,
        }
      }

      return {
        success: true,
        sessionId: data.sessionId,
        url: data.url,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred while charging the excess fee',
      }
    }
  }

  /**
   * Create a Stripe Checkout session for ownership transfer admin fee (£49.95)
   * The new owner will be redirected to pay before transfer is completed
   * 
   * @param params - Ownership transfer parameters
   * @returns Promise with checkout session details
   */
  const createOwnershipCheckout = async (
    params: OwnershipCheckoutParams
  ): Promise<OwnershipCheckoutResult> => {
    try {
      const response = await fetch(
        `${config.public.supabaseUrl}/functions/v1/create-ownership-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.public.supabaseAnonKey}`,
          },
          body: JSON.stringify({
            registrationId: params.registrationId,
            newOwnerEmail: params.newOwnerEmail,
            newOwnerName: params.newOwnerName,
            newOwnerPhone: params.newOwnerPhone || null,
            newOwnerAddress: params.newOwnerAddress || null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || 'Failed to create checkout session',
        }
      }

      return {
        sessionId: data.sessionId,
        sessionUrl: data.sessionUrl,
        transferId: data.transferId,
      }
    } catch (error: any) {
      return {
        error: error.message || 'An error occurred while creating checkout session',
      }
    }
  }

  /**
   * Redirect to Stripe Checkout for ownership transfer
   * This combines createOwnershipCheckout with automatic redirect
   * 
   * @param params - Ownership transfer parameters
   */
  const redirectToOwnershipCheckout = async (
    params: OwnershipCheckoutParams
  ): Promise<{ error?: string }> => {
    const result = await createOwnershipCheckout(params)

    if (result.error) {
      return { error: result.error }
    }

    if (result.sessionUrl) {
      window.location.href = result.sessionUrl
      return {}
    }

    // Fallback to Stripe.js redirect
    if (result.sessionId) {
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripe = await loadStripe(config.public.stripePublicKey)
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        })
        if (error) {
          return { error: error.message }
        }
      }
    }

    return {}
  }

  return {
    chargeExcessFee,
    createOwnershipCheckout,
    redirectToOwnershipCheckout,
  }
}
