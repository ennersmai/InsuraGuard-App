<template>
  <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <nav class="px-6 lg:px-8">
      <div class="flex justify-between items-center h-18 py-4">
        <NuxtLink to="/" class="flex items-center">
          <img 
            src="/InsuraGuard-logo-primary.svg" 
            alt="InsuraGuard" 
            class="h-10 w-auto min-w-[120px] max-w-[200px]"
          />
        </NuxtLink>

        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" class="text-charcoal hover:text-amber transition-colors">Home</NuxtLink>
          <NuxtLink to="/faq" class="text-charcoal hover:text-amber transition-colors">FAQ</NuxtLink>
          <NuxtLink to="/contact" class="text-charcoal hover:text-amber transition-colors">Contact</NuxtLink>
          
          <template v-if="user">
            <NuxtLink 
              :to="isAdmin ? '/admin' : '/dashboard'" 
              class="text-charcoal hover:text-amber transition-colors"
            >
              {{ isAdmin ? 'Admin' : 'Dashboard' }}
            </NuxtLink>
            <button @click="handleSignOut" class="text-charcoal hover:text-amber transition-colors">
              Sign Out
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn-primary">Login</NuxtLink>
          </template>
        </div>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div v-if="mobileMenuOpen" class="md:hidden py-4 space-y-2">
        <NuxtLink to="/" class="block py-2 text-charcoal hover:text-amber transition-colors">Home</NuxtLink>
        <NuxtLink to="/faq" class="block py-2 text-charcoal hover:text-amber transition-colors">FAQ</NuxtLink>
        <NuxtLink to="/contact" class="block py-2 text-charcoal hover:text-amber transition-colors">Contact</NuxtLink>
        
        <template v-if="user">
          <NuxtLink 
            :to="isAdmin ? '/admin' : '/dashboard'" 
            class="block py-2 text-charcoal hover:text-amber transition-colors"
          >
            {{ isAdmin ? 'Admin' : 'Dashboard' }}
          </NuxtLink>
          <button @click="handleSignOut" class="block py-2 text-charcoal hover:text-amber transition-colors text-left w-full">
            Sign Out
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="block py-2 text-amber font-medium">Login</NuxtLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const mobileMenuOpen = ref(false);

const isAdmin = computed(() => {
  return user.value?.user_metadata?.role === 'admin';
});

const handleSignOut = async () => {
  await supabase.auth.signOut();
  navigateTo('/');
};
</script>
