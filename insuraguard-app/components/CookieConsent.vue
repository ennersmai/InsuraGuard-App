<template>
  <div v-if="!cookiesAccepted" class="fixed bottom-0 left-0 right-0 bg-charcoal text-white shadow-lg z-50">
    <div class="max-w-7xl mx-auto p-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Cookie Preferences</h3>
        <p class="text-sm text-gray-300 mb-4">
          We use cookies to improve your experience. You can choose which cookies to accept.
          <NuxtLink to="/privacy" class="text-amber hover:text-amber/90 underline">Read our Privacy Policy</NuxtLink>
        </p>
      </div>

      <div v-if="!showDetails" class="flex flex-col sm:flex-row gap-3">
        <button
          @click="acceptAll"
          class="bg-amber text-white px-6 py-2 rounded hover:bg-amber/90 transition-colors font-medium"
        >
          Accept All
        </button>
        <button
          @click="acceptEssential"
          class="bg-white/10 text-white px-6 py-2 rounded hover:bg-white/20 transition-colors font-medium"
        >
          Essential Only
        </button>
        <button
          @click="showDetails = true"
          class="text-amber hover:text-amber/90 px-6 py-2 font-medium underline"
        >
          Customize
        </button>
      </div>

      <div v-else class="space-y-4">
        <!-- Essential Cookies -->
        <div class="bg-white/5 p-4 rounded">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium mb-1">Essential Cookies</h4>
              <p class="text-sm text-gray-300">Required for the website to function. Cannot be disabled.</p>
            </div>
            <div class="ml-4">
              <input type="checkbox" checked disabled class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Analytics Cookies -->
        <div class="bg-white/5 p-4 rounded">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium mb-1">Analytics Cookies</h4>
              <p class="text-sm text-gray-300">Help us understand how visitors use our website.</p>
            </div>
            <div class="ml-4">
              <input v-model="preferences.analytics" type="checkbox" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Marketing Cookies -->
        <div class="bg-white/5 p-4 rounded">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium mb-1">Marketing Cookies</h4>
              <p class="text-sm text-gray-300">Used to deliver relevant advertisements.</p>
            </div>
            <div class="ml-4">
              <input v-model="preferences.marketing" type="checkbox" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            @click="savePreferences"
            class="bg-amber text-white px-6 py-2 rounded hover:bg-amber/90 transition-colors font-medium"
          >
            Save Preferences
          </button>
          <button
            @click="showDetails = false"
            class="bg-white/10 text-white px-6 py-2 rounded hover:bg-white/20 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cookiesAccepted = useCookie('cookies-accepted', { 
  maxAge: 60 * 60 * 24 * 365
});

const cookiePreferences = useCookie('cookie-preferences', {
  maxAge: 60 * 60 * 24 * 365
});

const showDetails = ref(false);
const preferences = ref({
  analytics: false,
  marketing: false
});

const acceptAll = () => {
  preferences.value = {
    analytics: true,
    marketing: true
  };
  savePreferences();
};

const acceptEssential = () => {
  preferences.value = {
    analytics: false,
    marketing: false
  };
  savePreferences();
};

const savePreferences = () => {
  cookiePreferences.value = JSON.stringify(preferences.value);
  cookiesAccepted.value = 'true';
  showDetails.value = false;
};
</script>
