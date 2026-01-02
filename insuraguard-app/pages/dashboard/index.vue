<template>
  <div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-semibold text-charcoal">Dashboard</h1>
          <p class="mt-2 text-gray-600">Manage your insurance registrations and account</p>
        </div>
        <button
          @click="showAccountSettings = !showAccountSettings"
          class="px-4 py-2 text-sm font-medium text-charcoal hover:text-amber border border-gray-300 rounded hover:border-amber transition-colors"
        >
          {{ showAccountSettings ? 'View Registrations' : 'Account Settings' }}
        </button>
      </div>
    </div>

    <!-- Account Settings Section -->
    <div v-if="showAccountSettings" class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-charcoal mb-6">Account Settings</h2>
      
      <!-- Current Email -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
        <p class="text-charcoal font-medium">{{ user?.email }}</p>
      </div>

      <!-- Change Email Form -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-charcoal mb-4">Change Email Address</h3>
        
        <div v-if="emailSuccess" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
          {{ emailSuccess }}
        </div>
        
        <div v-if="emailError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {{ emailError }}
        </div>

        <form @submit.prevent="handleEmailChange" class="space-y-4">
          <div>
            <label for="new-email" class="block text-sm font-medium text-gray-700 mb-1">
              New Email Address
            </label>
            <input
              id="new-email"
              v-model="newEmail"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-amber focus:border-amber"
              placeholder="Enter new email address"
            />
          </div>
          <button
            type="submit"
            :disabled="emailLoading"
            class="px-4 py-2 bg-amber text-white rounded hover:bg-amber/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="emailLoading">Sending confirmation...</span>
            <span v-else>Change Email</span>
          </button>
        </form>
      </div>

      <!-- Change Password Link -->
      <div class="border-t pt-6 mt-6">
        <h3 class="text-lg font-medium text-charcoal mb-2">Password</h3>
        <p class="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>
        <NuxtLink
          to="/forgot-password"
          class="text-amber hover:text-amber/90 font-medium text-sm"
        >
          Reset Password →
        </NuxtLink>
      </div>
    </div>

    <!-- Registrations Section -->
    <div v-if="!showAccountSettings">

      <div class="mb-4">
        <h2 class="text-xl font-semibold text-charcoal">My Registrations</h2>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading your registrations...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-else-if="registrations.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No registrations</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by registering your clean energy system.</p>
      <div class="mt-6">
        <NuxtLink to="/register" class="btn-primary inline-block">
          Register System
        </NuxtLink>
        </div>
      </div>

      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="registration in registrations" :key="registration.id">
          <NuxtLink :to="`/dashboard/${registration.id}`" class="block hover:bg-gray-50 transition-colors">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-amber truncate">
                    {{ registration.urn }}
                  </p>
                  <p class="mt-1 text-sm text-charcoal">
                    {{ registration.system_description }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Registered: {{ formatDate(registration.created_at) }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': registration.status === 'active',
                      'bg-gray-100 text-gray-800': registration.status === 'cancelled',
                      'bg-red-100 text-red-800': registration.status === 'expired'
                    }"
                  >
                    {{ registration.status }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <section class="section-padding bg-charcoal">
    <div class="px-6 lg:relative">
      <!-- Logo - static on mobile, absolute on desktop -->
      <div class="lg:absolute lg:left-6 lg:top-0 text-left mb-6 lg:mb-0">
        <div class="inline-block mb-2">
          <img 
            src="/InsuraGuard-logo-transparent_white-1200.png" 
            alt="InsuraGuard" 
            class="h-14 md:h-16 w-auto max-w-[140px] md:max-w-[160px] object-contain"
          />
        </div>
        <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
          Insurance-backed protection for your clean energy investment.
        </p>
      </div>

      <!-- CTA Content centered relative to full width -->
      <div class="text-center lg:relative">
        <h2 class="text-3xl font-semibold text-white mb-4">Need to register another system?</h2>
        <p class="text-gray-300 mb-6">Protect your clean energy investment today</p>
        <NuxtLink to="/register" class="btn-primary">
          Register System
        </NuxtLink>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup lang="ts">
import type { Registration } from '~/types';
import { format } from 'date-fns';

definePageMeta({
  middleware: 'auth'
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const registrations = ref<Registration[]>([]);
const loading = ref(true);
const error = ref('');

// Account settings state
const showAccountSettings = ref(false);
const newEmail = ref('');
const emailLoading = ref(false);
const emailError = ref('');
const emailSuccess = ref('');

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const fetchRegistrations = async () => {
  try {
    if (!user.value?.id) {
      throw new Error('User not authenticated');
    }

    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    registrations.value = data || [];
  } catch (e: any) {
    error.value = e.message || 'Failed to load registrations';
  } finally {
    loading.value = false;
  }
};

const handleEmailChange = async () => {
  emailError.value = '';
  emailSuccess.value = '';
  emailLoading.value = true;

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail.value,
    });

    if (updateError) throw updateError;

    emailSuccess.value = 'Confirmation email sent! Please check your inbox to verify your new email address.';
    newEmail.value = '';
  } catch (e: any) {
    emailError.value = e.message || 'Failed to update email';
  } finally {
    emailLoading.value = false;
  }
};

onMounted(() => {
  fetchRegistrations();
});
</script>
