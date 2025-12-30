<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
    <CookieConsent />
  </div>
</template>

<script setup lang="ts">
</script>
