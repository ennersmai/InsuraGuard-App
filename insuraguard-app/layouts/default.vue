<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
    <CookieConsent />
    <AccessibilityWidget />
  </div>
</template>

<script setup lang="ts">
</script>
