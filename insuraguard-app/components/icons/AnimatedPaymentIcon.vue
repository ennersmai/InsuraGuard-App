<template>
  <div class="w-16 h-16 flex items-center justify-center">
    <svg viewBox="0 0 64 64" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <!-- Card -->
      <rect x="12" y="22" width="40" height="26" rx="3" fill="#FFFFFF" class="card" />
      <rect x="12" y="28" width="40" height="4" fill="#E67E22" class="card-stripe" />
      
      <!-- Chip -->
      <rect x="18" y="34" width="8" height="6" rx="1" fill="#E67E22" opacity="0.5" class="chip" />
      
      <!-- Swipe motion line -->
      <line x1="8" y1="35" x2="56" y2="35" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" class="swipe-line" opacity="0.8" />
      
      <!-- Checkmark (appears after swipe) - bigger and more centered -->
      <g class="checkmark">
        <circle cx="32" cy="32" r="16" fill="#10B981" />
        <path d="M24 32 L29 38 L40 26" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" class="check-path" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.card {
  animation: cardSlide 12s ease-in-out infinite;
}

.card-stripe {
  animation: cardSlide 12s ease-in-out infinite;
}

.chip {
  animation: cardSlide 12s ease-in-out infinite;
}

.swipe-line {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: swipe 12s ease-in-out infinite;
}

.checkmark {
  opacity: 0;
  animation: showCheck 12s ease-in-out infinite;
}

.check-path {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawCheck 12s ease-in-out infinite;
}

@keyframes cardSlide {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  42% {
    transform: translateX(0);
    opacity: 1;
  }
  46% {
    transform: translateX(8px);
    opacity: 1;
  }
  48% {
    transform: translateX(8px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes swipe {
  0%, 42% {
    stroke-dashoffset: 48;
    opacity: 0;
  }
  44% {
    opacity: 0.8;
  }
  48% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes showCheck {
  0%, 48% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
  52% {
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes drawCheck {
  0%, 49% {
    stroke-dashoffset: 30;
  }
  52% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
