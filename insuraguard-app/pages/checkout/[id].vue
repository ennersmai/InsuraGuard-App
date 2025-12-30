<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading checkout...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="registration">
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-charcoal">Complete Your Registration</h1>
        <p class="mt-2 text-gray-600">Review your details and proceed to payment</p>
      </div>

      <div class="bg-white shadow sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-charcoal mb-4">Registration Summary</h3>
          <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Name</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.full_name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.email }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">System</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.system_description }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">System Cost</dt>
              <dd class="mt-1 text-sm text-charcoal">£{{ registration.system_cost.toLocaleString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Installer</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.installer_company }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="bg-white shadow sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-charcoal mb-4">Payment Details</h3>
          <div class="space-y-3 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">System Age</span>
              <span class="text-sm font-medium text-charcoal">{{ systemAgeText }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Coverage Period</span>
              <span class="text-sm font-medium text-charcoal">{{ coverageYears }} years</span>
            </div>
            <div class="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span class="text-gray-600">Registration Fee</span>
              <span class="text-2xl font-semibold text-charcoal">£{{ calculatedPrice.toFixed(2) }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-2">
            One-time payment for {{ coverageYears }}-year insurance-backed guarantee coverage
          </p>
          <p class="text-xs text-gray-400">
            * Excess applies £29.95 | ** Change of ownership admin fee £49.95
          </p>

          <button
            @click="handleCheckout"
            :disabled="checkoutLoading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="checkoutLoading">Processing payment...</span>
            <span v-else-if="!config.public.stripePublishableKey || config.public.stripePublishableKey === 'pk_test_xxxxx'">
              Complete Registration (Test Mode)
            </span>
            <span v-else>Proceed to Secure Payment</span>
          </button>

          <div class="mt-4 flex items-center justify-center gap-2 text-sm" 
               :class="!config.public.stripePublishableKey || config.public.stripePublishableKey === 'pk_test_xxxxx' ? 'text-amber' : 'text-gray-500'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span v-if="!config.public.stripePublishableKey || config.public.stripePublishableKey === 'pk_test_xxxxx'">
              Test mode - No actual payment required
            </span>
            <span v-else>Secure payment powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Registration } from '~/types';
import { loadStripe } from '@stripe/stripe-js';

definePageMeta({
  middleware: 'auth'
});

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const config = useRuntimeConfig();

const registration = ref<Registration | null>(null);
const loading = ref(true);
const error = ref('');
const checkoutLoading = ref(false);

const systemAgeMonths = computed(() => {
  if (!registration.value?.commissioning_date) return 0;
  const commissioningDate = new Date(registration.value.commissioning_date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - commissioningDate.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  return diffMonths;
});

const systemAgeText = computed(() => {
  const months = systemAgeMonths.value;
  if (months < 12) return 'Under 12 months';
  if (months < 24) return '1-2 years old';
  if (months < 36) return '2-3 years old';
  if (months < 48) return '3-4 years old';
  return 'Over 4 years (not eligible)';
});

const calculatedPrice = computed(() => {
  const months = systemAgeMonths.value;
  if (months < 12) return 99.99;
  if (months < 24) return 199.99;
  if (months < 36) return 289.00;
  if (months < 48) return 499.99;
  return 0; // Not eligible
});

const coverageYears = computed(() => {
  const months = systemAgeMonths.value;
  const yearsFromCommissioning = Math.floor(months / 12);
  return Math.max(10 - yearsFromCommissioning, 0);
});

const fetchRegistration = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', route.params.id)
      .eq('user_id', user.value?.id)
      .single();

    if (fetchError) throw fetchError;

    if (data.payment_status === 'completed') {
      navigateTo(`/dashboard/${data.id}`);
      return;
    }

    registration.value = data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load registration';
  } finally {
    loading.value = false;
  }
};

const handleCheckout = async () => {
  checkoutLoading.value = true;
  error.value = '';

  try {
    // Check if Stripe is configured
    if (!config.public.stripePublishableKey || config.public.stripePublishableKey === 'pk_test_xxxxx') {
      // Mock payment flow
      await mockPayment();
      return;
    }

    // Real Stripe payment flow
    const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        registrationId: route.params.id,
        amount: calculatedPrice.value,
      },
    });

    if (functionError) throw functionError;

    const stripe = await loadStripe(config.public.stripePublishableKey);
    if (!stripe) throw new Error('Failed to load Stripe');

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (stripeError) throw stripeError;
  } catch (e: any) {
    error.value = e.message || 'Failed to initiate checkout';
    checkoutLoading.value = false;
  }
};

const mockPayment = async () => {
  try {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update registration with mock payment data
    const { data: templates } = await supabase
      .from('admin_templates')
      .select('*');

    const pdfLegalText = templates?.find(t => t.template_type === 'pdf_legal_text')?.content || 'Standard terms apply.';
    const underwriterInfo = templates?.find(t => t.template_type === 'underwriter_info')?.content || 'Underwriter information';

    // Generate mock URN
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const urn = `IG-${year}-${code}`;

    // Update registration
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        urn,
        stripe_payment_id: `mock_payment_${Date.now()}`,
        payment_status: 'completed',
        payment_amount: calculatedPrice.value,
      })
      .eq('id', route.params.id);

    if (updateError) throw updateError;

    // Generate certificate
    const { error: certError } = await supabase.functions.invoke('generate-certificate', {
      body: { registrationId: route.params.id }
    });

    if (certError) {
      console.error('Certificate generation error:', certError);
      // Don't block success page if certificate fails
    }

    // Redirect to success page
    navigateTo(`/success?session_id=mock_${route.params.id}`);
  } catch (e: any) {
    error.value = e.message || 'Mock payment failed';
    checkoutLoading.value = false;
  }
};

onMounted(() => {
  fetchRegistration();
});
</script>
