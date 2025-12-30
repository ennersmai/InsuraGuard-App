<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white shadow sm:rounded-lg p-8 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 class="text-2xl font-semibold text-charcoal mb-2">
          Payment Successful!
        </h2>
        
        <p class="text-gray-600 mb-6">
          Your registration has been completed successfully. You will receive your insurance certificate via email shortly.
        </p>

        <div class="space-y-3">
          <NuxtLink to="/dashboard" class="block w-full btn-primary">
            View My Registrations
          </NuxtLink>
          <NuxtLink to="/" class="block w-full px-4 py-2 border border-gray-300 rounded text-charcoal hover:bg-gray-50">
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});
</script>
