<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Accessibility Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-12 h-12 bg-charcoal text-white rounded-full shadow-lg hover:bg-charcoal/90 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 transition-all"
      :aria-expanded="isOpen"
      aria-label="Accessibility Options"
      title="Accessibility Options"
    >
      <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    </button>

    <!-- Accessibility Panel -->
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="absolute bottom-16 right-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
        role="dialog"
        aria-label="Accessibility Settings"
      >
        <div class="bg-charcoal text-white px-4 py-3 flex justify-between items-center">
          <h3 class="font-semibold text-sm">Accessibility Options</h3>
          <button @click="isOpen = false" class="text-white/80 hover:text-white" aria-label="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-4 space-y-4">
          <!-- Font Size -->
          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Text Size</label>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseFontSize"
                class="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber text-lg font-bold"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <div class="flex-1 text-center text-sm text-gray-600">{{ fontSizeLabel }}</div>
              <button
                @click="increaseFontSize"
                class="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber text-lg font-bold"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>
          </div>

          <!-- High Contrast -->
          <div class="flex items-center justify-between">
            <label for="high-contrast" class="text-sm font-medium text-charcoal">High Contrast</label>
            <button
              id="high-contrast"
              @click="toggleHighContrast"
              :class="[
                'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber',
                highContrast ? 'bg-amber' : 'bg-gray-300'
              ]"
              role="switch"
              :aria-checked="highContrast"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                  highContrast ? 'translate-x-5' : ''
                ]"
              />
            </button>
          </div>

          <!-- Readable Font -->
          <div class="flex items-center justify-between">
            <label for="readable-font" class="text-sm font-medium text-charcoal">Readable Font</label>
            <button
              id="readable-font"
              @click="toggleReadableFont"
              :class="[
                'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber',
                readableFont ? 'bg-amber' : 'bg-gray-300'
              ]"
              role="switch"
              :aria-checked="readableFont"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                  readableFont ? 'translate-x-5' : ''
                ]"
              />
            </button>
          </div>

          <!-- Highlight Links -->
          <div class="flex items-center justify-between">
            <label for="highlight-links" class="text-sm font-medium text-charcoal">Highlight Links</label>
            <button
              id="highlight-links"
              @click="toggleHighlightLinks"
              :class="[
                'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber',
                highlightLinks ? 'bg-amber' : 'bg-gray-300'
              ]"
              role="switch"
              :aria-checked="highlightLinks"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                  highlightLinks ? 'translate-x-5' : ''
                ]"
              />
            </button>
          </div>

          <!-- Reset Button -->
          <button
            @click="resetAll"
            class="w-full py-2 text-sm text-gray-600 hover:text-charcoal border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Reset All Settings
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const fontSize = ref(100);
const highContrast = ref(false);
const readableFont = ref(false);
const highlightLinks = ref(false);

const fontSizeLabel = computed(() => {
  if (fontSize.value === 100) return 'Normal';
  if (fontSize.value < 100) return 'Smaller';
  return 'Larger';
});

const applyStyles = () => {
  const html = document.documentElement;
  
  // Font size
  html.style.fontSize = `${fontSize.value}%`;
  
  // High contrast
  if (highContrast.value) {
    html.classList.add('high-contrast');
  } else {
    html.classList.remove('high-contrast');
  }
  
  // Readable font
  if (readableFont.value) {
    html.classList.add('readable-font');
  } else {
    html.classList.remove('readable-font');
  }
  
  // Highlight links
  if (highlightLinks.value) {
    html.classList.add('highlight-links');
  } else {
    html.classList.remove('highlight-links');
  }
  
  // Save to localStorage
  localStorage.setItem('a11y-settings', JSON.stringify({
    fontSize: fontSize.value,
    highContrast: highContrast.value,
    readableFont: readableFont.value,
    highlightLinks: highlightLinks.value
  }));
};

const increaseFontSize = () => {
  if (fontSize.value < 150) {
    fontSize.value += 10;
    applyStyles();
  }
};

const decreaseFontSize = () => {
  if (fontSize.value > 80) {
    fontSize.value -= 10;
    applyStyles();
  }
};

const toggleHighContrast = () => {
  highContrast.value = !highContrast.value;
  applyStyles();
};

const toggleReadableFont = () => {
  readableFont.value = !readableFont.value;
  applyStyles();
};

const toggleHighlightLinks = () => {
  highlightLinks.value = !highlightLinks.value;
  applyStyles();
};

const resetAll = () => {
  fontSize.value = 100;
  highContrast.value = false;
  readableFont.value = false;
  highlightLinks.value = false;
  applyStyles();
};

onMounted(() => {
  // Load saved settings
  const saved = localStorage.getItem('a11y-settings');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      fontSize.value = settings.fontSize || 100;
      highContrast.value = settings.highContrast || false;
      readableFont.value = settings.readableFont || false;
      highlightLinks.value = settings.highlightLinks || false;
      applyStyles();
    } catch (e) {
      // Ignore parse errors
    }
  }
});
</script>

<style>
/* High Contrast Mode */
.high-contrast {
  filter: contrast(1.25);
}

.high-contrast body {
  background-color: #000 !important;
  color: #fff !important;
}

/* Readable Font */
.readable-font,
.readable-font * {
  font-family: Arial, Helvetica, sans-serif !important;
  letter-spacing: 0.02em;
}

/* Highlight Links */
.highlight-links a {
  background-color: #ff0 !important;
  color: #000 !important;
  text-decoration: underline !important;
  padding: 2px 4px;
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
