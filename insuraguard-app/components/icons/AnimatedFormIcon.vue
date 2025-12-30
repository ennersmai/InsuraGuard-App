<template>
  <div class="w-16 h-16 flex items-center justify-center">
    <svg viewBox="0 0 64 64" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <!-- Document background -->
      <rect x="16" y="8" width="32" height="48" rx="2" fill="#FFFFFF" class="document-bg" />
      
      <!-- Lines typewriting in - full width -->
      <line x1="22" y1="18" x2="42" y2="18" stroke="#E67E22" stroke-width="2" stroke-linecap="round" class="line line-1" />
      <line x1="22" y1="24" x2="42" y2="24" stroke="#E67E22" stroke-width="2" stroke-linecap="round" class="line line-2" />
      <line x1="22" y1="30" x2="42" y2="30" stroke="#E67E22" stroke-width="2" stroke-linecap="round" class="line line-3" />
      <line x1="22" y1="36" x2="38" y2="36" stroke="#E67E22" stroke-width="2" stroke-linecap="round" class="line line-4" />
      <line x1="22" y1="42" x2="42" y2="42" stroke="#E67E22" stroke-width="2" stroke-linecap="round" class="line line-5" />
      <line x1="22" y1="48" x2="35" y2="48" stroke="#E67E22" stroke-width="2" stroke-linecap="round" class="line line-6" />
    </svg>
  </div>
</template>

<style scoped>
.document-bg {
  animation: fadeIn 0.5s ease-out 0s;
}

.line {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: typewriteLine 12s ease-out infinite;
}

.line-1 {
  animation-delay: 0s;
}

.line-2 {
  animation-delay: 0.15s;
}

.line-3 {
  animation-delay: 0.3s;
}

.line-4 {
  animation-delay: 0.45s;
}

.line-5 {
  animation-delay: 0.6s;
}

.line-6 {
  animation-delay: 0.75s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes typewriteLine {
  0%, 25% {
    stroke-dashoffset: 20;
  }
  42% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
