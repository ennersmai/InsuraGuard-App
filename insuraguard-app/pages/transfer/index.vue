<template>
  <div>
    <!-- Hero Section -->
    <section class="section-padding bg-white">
      <div class="container-narrow text-center">
        <h1 class="text-4xl md:text-5xl font-semibold text-charcoal mb-6">Transfer Ownership</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Transfer your InsuraGuard protection to the new owner of your system.
        </p>
      </div>
    </section>

    <!-- Transfer Form Section -->
    <section class="py-12 bg-gray-50">
      <div class="container-narrow">
        <!-- Step 1: Verify Registration -->
        <div v-if="step === 1" class="card">
          <h2 class="text-2xl font-semibold text-charcoal mb-6">Step 1: Verify Your Registration</h2>
          <p class="text-gray-600 mb-6">Enter your URN (Unique Reference Number) to start the transfer process.</p>
          
          <form @submit.prevent="verifyRegistration" class="space-y-6">
            <div>
              <label for="urn" class="block text-sm font-medium text-gray-700 mb-2">URN (Unique Reference Number)</label>
              <input
                id="urn"
                v-model="urn"
                type="text"
                placeholder="e.g., IG-2025-ABC12"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber focus:border-amber"
                required
              />
            </div>
            <div>
              <label for="ownerEmail" class="block text-sm font-medium text-gray-700 mb-2">Current Owner Email</label>
              <input
                id="ownerEmail"
                v-model="ownerEmail"
                type="email"
                placeholder="your@email.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber focus:border-amber"
                required
              />
            </div>
            <div v-if="verifyError" class="text-red-600 text-sm">{{ verifyError }}</div>
            <button
              type="submit"
              :disabled="verifying"
              class="btn-primary w-full py-3"
            >
              {{ verifying ? 'Verifying...' : 'Verify Registration' }}
            </button>
          </form>
        </div>

        <!-- Step 2: New Owner Details -->
        <div v-if="step === 2" class="card">
          <h2 class="text-2xl font-semibold text-charcoal mb-6">Step 2: New Owner Details</h2>
          <p class="text-gray-600 mb-6">
            Enter the details of the new owner. They will receive an email to complete the transfer by paying the admin fee of <strong>£49.95</strong>.
          </p>

          <!-- Current Registration Info -->
          <div class="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 class="font-semibold text-charcoal mb-2">Current Registration</h3>
            <p class="text-sm text-gray-600">URN: <span class="font-medium">{{ registration?.urn }}</span></p>
            <p class="text-sm text-gray-600">Owner: <span class="font-medium">{{ registration?.owner_name }}</span></p>
          </div>

          <form @submit.prevent="initiateTransfer" class="space-y-6">
            <div>
              <label for="newOwnerName" class="block text-sm font-medium text-gray-700 mb-2">New Owner Full Name *</label>
              <input
                id="newOwnerName"
                v-model="newOwner.name"
                type="text"
                placeholder="John Smith"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber focus:border-amber"
                required
              />
            </div>
            <div>
              <label for="newOwnerEmail" class="block text-sm font-medium text-gray-700 mb-2">New Owner Email *</label>
              <input
                id="newOwnerEmail"
                v-model="newOwner.email"
                type="email"
                placeholder="newowner@email.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber focus:border-amber"
                required
              />
            </div>
            <div>
              <label for="newOwnerPhone" class="block text-sm font-medium text-gray-700 mb-2">New Owner Phone</label>
              <input
                id="newOwnerPhone"
                v-model="newOwner.phone"
                type="tel"
                placeholder="+44 7123 456789"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
            <div>
              <label for="newOwnerAddress" class="block text-sm font-medium text-gray-700 mb-2">New Owner Address</label>
              <textarea
                id="newOwnerAddress"
                v-model="newOwner.address"
                rows="3"
                placeholder="Full address including postcode"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber focus:border-amber"
              ></textarea>
            </div>

            <div class="bg-amber/10 border border-amber rounded-lg p-4">
              <p class="text-sm text-charcoal">
                <strong>Admin Fee:</strong> £49.95 (payable by new owner)
              </p>
              <p class="text-xs text-gray-600 mt-1">
                The new owner will be redirected to a secure payment page to complete the transfer.
              </p>
            </div>

            <div v-if="transferError" class="text-red-600 text-sm">{{ transferError }}</div>

            <div class="flex gap-4">
              <button
                type="button"
                @click="step = 1"
                class="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 btn-primary py-3"
              >
                {{ submitting ? 'Processing...' : 'Continue to Payment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="py-12 bg-white">
      <div class="container-narrow">
        <h2 class="text-2xl font-semibold text-charcoal mb-6 text-center">How It Works</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold text-amber">1</span>
            </div>
            <h3 class="font-semibold text-charcoal mb-2">Verify</h3>
            <p class="text-sm text-gray-600">Enter your URN and email to verify your registration</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold text-amber">2</span>
            </div>
            <h3 class="font-semibold text-charcoal mb-2">New Owner Details</h3>
            <p class="text-sm text-gray-600">Provide the new owner's information</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold text-amber">3</span>
            </div>
            <h3 class="font-semibold text-charcoal mb-2">Payment</h3>
            <p class="text-sm text-gray-600">New owner pays admin fee to complete transfer</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'

useSeoMeta({
  title: 'Transfer Ownership - InsuraGuard',
  description: 'Transfer your InsuraGuard protection to the new owner of your solar or battery storage system.',
  ogTitle: 'Transfer InsuraGuard Ownership',
  ogDescription: 'Transfer your clean energy protection to a new owner'
})

const config = useRuntimeConfig()
const supabase = useSupabaseClient()

const step = ref(1)
const urn = ref('')
const ownerEmail = ref('')
const verifying = ref(false)
const verifyError = ref('')
const registration = ref<any>(null)

const newOwner = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})
const submitting = ref(false)
const transferError = ref('')

const verifyRegistration = async () => {
  verifying.value = true
  verifyError.value = ''

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, urn, owner_name, owner_email, payment_status')
      .eq('urn', urn.value.toUpperCase().trim())
      .eq('owner_email', ownerEmail.value.toLowerCase().trim())
      .single()

    if (error || !data) {
      verifyError.value = 'Registration not found. Please check your URN and email address.'
      return
    }

    if (data.payment_status !== 'completed') {
      verifyError.value = 'This registration has not been fully paid. Please complete payment first.'
      return
    }

    registration.value = data
    step.value = 2
  } catch (err: any) {
    verifyError.value = err.message || 'An error occurred. Please try again.'
  } finally {
    verifying.value = false
  }
}

const initiateTransfer = async () => {
  submitting.value = true
  transferError.value = ''

  try {
    const response = await fetch(`${config.public.supabaseUrl}/functions/v1/create-ownership-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.supabaseAnonKey}`,
      },
      body: JSON.stringify({
        registrationId: registration.value.id,
        newOwnerEmail: newOwner.value.email.toLowerCase().trim(),
        newOwnerName: newOwner.value.name.trim(),
        newOwnerPhone: newOwner.value.phone.trim() || null,
        newOwnerAddress: newOwner.value.address.trim() || null,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session')
    }

    // Redirect to Stripe Checkout
    if (data.sessionUrl) {
      window.location.href = data.sessionUrl
    } else {
      const stripe = await loadStripe(config.public.stripePublicKey)
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    }
  } catch (err: any) {
    transferError.value = err.message || 'An error occurred. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
