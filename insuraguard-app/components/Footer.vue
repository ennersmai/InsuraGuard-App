<template>
  <footer class="bg-charcoal text-white">
    <div class="px-6 py-8">
      <!-- Links Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
        <div>
          <h3 class="font-semibold mb-4 text-base">Quick Links</h3>
          <ul class="space-y-3 sm:space-y-2 text-sm">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-amber transition-colors block py-1">Home</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-400 hover:text-amber transition-colors block py-1">FAQ</NuxtLink></li>
            <li><NuxtLink to="/register" class="text-gray-400 hover:text-amber transition-colors block py-1">Register</NuxtLink></li>
            <li><NuxtLink to="/verify" class="text-gray-400 hover:text-amber transition-colors block py-1">Verify URN</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4 text-base">Legal & Support</h3>
          <ul class="space-y-3 sm:space-y-2 text-sm">
            <li><NuxtLink to="/claim" class="text-gray-400 hover:text-amber transition-colors block py-1">Claim Form</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-amber transition-colors block py-1">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="text-gray-400 hover:text-amber transition-colors block py-1">Terms & Conditions</NuxtLink></li>
            <li><NuxtLink to="/dsar" class="text-gray-400 hover:text-amber transition-colors block py-1">GDPR/DSAR</NuxtLink></li>
          </ul>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <h3 class="font-semibold mb-4 text-base">Contact</h3>
          <ul class="space-y-3 sm:space-y-2 text-sm text-gray-400">
            <li class="py-1">Email: support@insuraguard.co.uk</li>
            <li class="py-1">Phone: +44 (0) 20 XXXX XXXX</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-6 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center text-xs text-gray-400 gap-2">
        <p class="text-left">&copy; {{ currentYear }} InsuraGuard. All rights reserved.</p>
        <p class="sm:text-right text-left">Company Registration Number: XXXXXXXX</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
