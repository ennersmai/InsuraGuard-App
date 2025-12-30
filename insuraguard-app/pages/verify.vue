<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-semibold text-charcoal mb-4">Verify Your Insurance Certificate</h1>
      <p class="text-xl text-gray-600">Check the status of your InsuraGuard policy</p>
    </div>

    <div class="bg-white shadow rounded-lg p-8">
      <form @submit.prevent="verifyURN" class="space-y-6">
        <div>
          <label for="urn" class="block text-sm font-medium text-charcoal mb-2">
            Enter Your Unique Reference Number (URN)
          </label>
          <input
            id="urn"
            v-model="urnInput"
            type="text"
            placeholder="e.g., IG-2025-XXXXX"
            class="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
            required
          />
          <p class="mt-2 text-sm text-gray-500">
            Your URN can be found on your insurance certificate
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Verifying...</span>
          <span v-else>Verify URN</span>
        </button>
      </form>

      <div v-if="verificationResult" class="mt-8 p-6 rounded-lg" :class="verificationResult.valid ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <svg v-if="verificationResult.valid" class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2" :class="verificationResult.valid ? 'text-green-900' : 'text-red-900'">
              {{ verificationResult.message }}
            </h3>
            <div v-if="verificationResult.valid && verificationResult.data" class="space-y-2 text-sm" :class="verificationResult.valid ? 'text-green-800' : 'text-red-800'">
              <p><strong>Status:</strong> {{ verificationResult.data.status }}</p>
              <p><strong>System:</strong> {{ verificationResult.data.system_description }}</p>
              <p><strong>Registered:</strong> {{ formatDate(verificationResult.data.created_at) }}</p>
              <p v-if="verificationResult.data.commissioning_date">
                <strong>Coverage Period:</strong> {{ formatDate(verificationResult.data.commissioning_date) }} - {{ formatCoverageEnd(verificationResult.data.commissioning_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-charcoal mb-4">What is a URN?</h2>
      <p class="text-gray-600 mb-4">
        Your Unique Reference Number (URN) is a unique identifier for your InsuraGuard policy. It's formatted as <code class="bg-gray-200 px-2 py-1 rounded">IG-YYYY-XXXXX</code> where YYYY is the year and XXXXX is a unique code.
      </p>
      <p class="text-gray-600">
        You can find your URN on your insurance certificate, which was emailed to you after registration.
      </p>
    </div>

    <div class="mt-6 text-center">
      <p class="text-gray-600 text-sm">
        Lost your certificate? 
        <NuxtLink to="/contact" class="text-amber hover:text-amber/90">Contact us</NuxtLink> for assistance.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

useSeoMeta({
  title: 'Verify Your Insurance Certificate - InsuraGuard',
  description: 'Verify your InsuraGuard policy status using your Unique Reference Number (URN).',
  ogTitle: 'Verify InsuraGuard Certificate',
  ogDescription: 'Check your policy status online'
});

const supabase = useSupabaseClient();
const urnInput = ref('');
const loading = ref(false);
const verificationResult = ref<{ valid: boolean; message: string; data?: any } | null>(null);

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy');
};

const formatCoverageEnd = (commissioningDate: string) => {
  const endDate = new Date(commissioningDate);
  endDate.setFullYear(endDate.getFullYear() + 10);
  return format(endDate, 'dd MMM yyyy');
};

const verifyURN = async () => {
  if (!urnInput.value.trim()) {
    verificationResult.value = {
      valid: false,
      message: 'Please enter a URN'
    };
    return;
  }

  loading.value = true;
  verificationResult.value = null;

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, urn, status, system_description, created_at, commissioning_date')
      .eq('urn', urnInput.value.trim().toUpperCase())
      .single();

    if (error || !data) {
      verificationResult.value = {
        valid: false,
        message: 'Invalid URN - No policy found with this reference number'
      };
    } else {
      verificationResult.value = {
        valid: true,
        message: 'Valid Policy ✓',
        data
      };
    }
  } catch (e: any) {
    verificationResult.value = {
      valid: false,
      message: 'Error verifying URN. Please try again.'
    };
  } finally {
    loading.value = false;
  }
};
</script>
