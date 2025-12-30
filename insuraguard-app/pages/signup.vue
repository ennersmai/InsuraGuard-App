<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-semibold text-charcoal">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-amber hover:text-amber/90">
            Sign in
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {{ success }}
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="full-name" class="block text-sm font-medium text-charcoal mb-1">
              Full Name
            </label>
            <input
              id="full-name"
              v-model="fullName"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-charcoal rounded focus:outline-none focus:ring-amber focus:border-amber focus:z-10 sm:text-sm"
              placeholder="Full Name"
            />
          </div>
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
              minlength="6"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-charcoal rounded focus:outline-none focus:ring-amber focus:border-amber focus:z-10 sm:text-sm"
              placeholder="Password (min 6 characters)"
            />
          </div>
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-charcoal mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-charcoal rounded focus:outline-none focus:ring-amber focus:border-amber focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-amber hover:bg-amber/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create account</span>
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
  title: 'Sign Up - InsuraGuard',
  description: 'Create your InsuraGuard account to register and protect your clean energy system.',
  robots: 'noindex, nofollow'
});

const supabase = useSupabaseClient();
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const handleSignup = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  if (!fullName.value || !email.value || !password.value) {
    error.value = 'Please fill in all required fields';
    loading.value = false;
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    loading.value = false;
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    loading.value = false;
    return;
  }

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
        },
      },
    });

    if (signUpError) throw signUpError;

    if (data.user) {
      success.value = 'Account created! Please check your email to verify your account.';
      fullName.value = '';
      email.value = '';
      password.value = '';
      confirmPassword.value = '';
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to create account';
  } finally {
    loading.value = false;
  }
};
</script>
