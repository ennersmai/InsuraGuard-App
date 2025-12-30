<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-semibold text-charcoal">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Remember your password?
          <NuxtLink to="/login" class="font-medium text-amber hover:text-amber/90">
            Sign in
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {{ success }}
        </div>

        <div class="rounded-md shadow-sm">
          <div>
            <label for="email" class="block text-sm font-medium text-charcoal mb-1">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-charcoal rounded focus:outline-none focus:ring-amber focus:border-amber focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-amber hover:bg-amber/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Sending reset link...</span>
            <span v-else>Send reset link</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

const supabase = useSupabaseClient();
const config = useRuntimeConfig();
const email = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const handleResetPassword = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${config.public.siteUrl}/reset-password`,
    });

    if (resetError) throw resetError;

    success.value = 'Password reset link sent! Please check your email.';
    email.value = '';
  } catch (e: any) {
    error.value = e.message || 'Failed to send reset link';
  } finally {
    loading.value = false;
  }
};
</script>
