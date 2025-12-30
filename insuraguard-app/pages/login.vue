<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-semibold text-charcoal">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/signup" class="font-medium text-amber hover:text-amber/90">
            create a new account
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div class="rounded-md shadow-sm space-y-4">
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
          <div>
            <label for="password" class="block text-sm font-medium text-charcoal mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-charcoal rounded focus:outline-none focus:ring-amber focus:border-amber focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <NuxtLink to="/forgot-password" class="font-medium text-amber hover:text-amber/90">
              Forgot your password?
            </NuxtLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-amber hover:bg-amber/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
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

useSeoMeta({
  title: 'Login - InsuraGuard',
  description: 'Sign in to your InsuraGuard account to manage your registrations.',
  robots: 'noindex, nofollow'
});

const supabase = useSupabaseClient();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    loading.value = false;
    return;
  }

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (signInError) throw signInError;

    const isAdmin = data.user?.user_metadata?.role === 'admin';
    navigateTo(isAdmin ? '/admin' : '/dashboard');
  } catch (e: any) {
    error.value = e.message || 'Failed to sign in';
  } finally {
    loading.value = false;
  }
};
</script>
