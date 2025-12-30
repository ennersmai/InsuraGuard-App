<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-semibold text-charcoal">
          Set new password
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleUpdatePassword">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {{ success }}
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-charcoal mb-1">
              New Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-charcoal rounded focus:outline-none focus:ring-amber focus:border-amber focus:z-10 sm:text-sm"
              placeholder="New Password (min 6 characters)"
            />
          </div>
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-charcoal mb-1">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-charcoal rounded focus:outline-none focus:ring-amber focus:border-amber focus:z-10 sm:text-sm"
              placeholder="Confirm New Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-amber hover:bg-amber/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Updating password...</span>
            <span v-else>Update password</span>
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
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const handleUpdatePassword = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    loading.value = false;
    return;
  }

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value,
    });

    if (updateError) throw updateError;

    success.value = 'Password updated successfully! Redirecting to login...';
    setTimeout(() => {
      navigateTo('/login');
    }, 2000);
  } catch (e: any) {
    error.value = e.message || 'Failed to update password';
  } finally {
    loading.value = false;
  }
};
</script>
