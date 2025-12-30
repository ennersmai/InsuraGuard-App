<template>
  <div class="w-16 h-16 flex items-center justify-center">
    <svg viewBox="0 0 64 64" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <!-- Lock body - wider and more centered -->
      <rect x="18" y="30" width="28" height="24" rx="3" fill="#FFFFFF" class="lock-body" />
      
      <!-- Keyhole -->
      <circle cx="32" cy="40" r="3" fill="#E67E22" class="keyhole" />
      <rect x="30.5" y="40" width="3" height="7" fill="#E67E22" class="keyhole-slot" />
      
      <!-- Lock shackle (top part) - wider -->
      <path d="M23 30 L23 22 Q23 14 32 14 Q41 14 41 22 L41 30" 
            stroke="#FFFFFF" 
            stroke-width="5" 
            fill="none" 
            stroke-linecap="round"
            class="shackle" />
      
      <!-- Shield with checkmark (appears for protection) -->
      <g class="shield">
        <path d="M32 12 L44 17 L44 30 Q44 40 32 48 Q20 40 20 30 L20 17 Z" 
              fill="#10B981" 
              opacity="0.95" />
        <path d="M26 30 L30 35 L38 25" 
              stroke="white" 
              stroke-width="3" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              fill="none"
              class="shield-check" />
      </g>
      
      <!-- Sparkle effects -->
      <g class="sparkles">
        <circle cx="16" cy="28" r="2" fill="#E67E22" class="sparkle sparkle-1" />
        <circle cx="48" cy="32" r="2" fill="#E67E22" class="sparkle sparkle-2" />
        <circle cx="20" cy="50" r="2" fill="#E67E22" class="sparkle sparkle-3" />
        <circle cx="44" cy="52" r="2" fill="#E67E22" class="sparkle sparkle-4" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.lock-body {
  animation: lockCycle 12s ease-in-out infinite;
}

.shackle {
  stroke-dasharray: 60;
  stroke-dashoffset: 0;
  animation: shackleCycle 12s ease-in-out infinite;
}

.keyhole, .keyhole-slot {
  animation: lockCycle 12s ease-in-out infinite;
}

.shield {
  opacity: 0;
  transform-origin: 32px 30px;
  animation: shieldCycle 12s ease-in-out infinite;
}

.shield-check {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: checkCycle 12s ease-in-out infinite;
}

.sparkle {
  opacity: 0;
  transform-origin: center;
}

.sparkle-1 {
  animation: sparkle 12s ease-in-out infinite;
}

.sparkle-2 {
  animation: sparkle 12s ease-in-out 0.1s infinite;
}

.sparkle-3 {
  animation: sparkle 12s ease-in-out 0.2s infinite;
}

.sparkle-4 {
  animation: sparkle 12s ease-in-out 0.3s infinite;
}

@keyframes lockCycle {
  0% {
    opacity: 1;
  }
  58% {
    opacity: 1;
  }
  62% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes shackleCycle {
  0% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  58% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  62% {
    opacity: 0;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

@keyframes shieldCycle {
  0%, 62% {
    opacity: 0;
    transform: scale(0);
  }
  67% {
    opacity: 1;
    transform: scale(1.1);
  }
  70% {
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes checkCycle {
  0%, 65% {
    stroke-dashoffset: 24;
  }
  72% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes sparkle {
  0%, 65% {
    opacity: 0;
    transform: scale(0);
  }
  70% {
    opacity: 1;
    transform: scale(1.3);
  }
  75% {
    opacity: 0.8;
    transform: scale(1);
  }
  82% {
    opacity: 1;
    transform: scale(1.2);
  }
  90% {
    opacity: 0.7;
    transform: scale(1);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}
</style>
