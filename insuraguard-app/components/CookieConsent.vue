<template>
  <div v-if="!cookiesAccepted" class="fixed bottom-0 left-0 right-0 bg-charcoal text-white p-4 shadow-lg z-50">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex-1">
        <p class="text-sm">
          We use essential cookies to ensure our website functions properly. 
          <NuxtLink to="/privacy" class="text-amber hover:text-amber/90 underline">Learn more</NuxtLink>
        </p>
      </div>
      <button
        @click="acceptCookies"
        class="bg-amber text-white px-6 py-2 rounded hover:bg-amber/90 transition-colors whitespace-nowrap"
      >
        Accept
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const cookiesAccepted = useCookie('cookies-accepted', { 
  maxAge: 60 * 60 * 24 * 365
});

const acceptCookies = () => {
  cookiesAccepted.value = 'true';
};
</script>
