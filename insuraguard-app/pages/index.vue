<template>
  <div>
    <!-- Hero Section -->
    <section class="relative section-padding bg-white overflow-hidden">
      <!-- Hero Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/hero.png" 
          alt="" 
          class="w-full h-full object-cover opacity-85"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/80"></div>
        <!-- Animated sun effect -->
        <div class="absolute inset-0 sun-core"></div>
        <SunRaysWebGL />
      </div>
      
      <div class="container-wide relative z-10">
        <div class="max-w-4xl mx-auto text-center -mt-8 md:-mt-12">
          <div class="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 mb-8">
            <span class="w-2 h-2 bg-amber rounded-full"></span>
            <span class="text-sm text-charcoal font-medium">Trusted by homeowners across the UK</span>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-charcoal mb-6 leading-tight">
            Insurance Backed Protection<br class="hidden md:block" />
            <span class="text-charcoal/80 block md:inline">for Your Clean Energy System</span>
          </h1>
          <p class="text-lg md:text-xl text-charcoal font-medium mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            10 year guarantee protection if your installer ceases to trade. Register in minutes, protected for a decade.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <NuxtLink to="/register" class="btn-primary text-lg px-8 py-4">
              Register Your System
            </NuxtLink>
            <NuxtLink to="/about" class="btn-outline text-lg px-8 py-4">
              Learn More
            </NuxtLink>
          </div>
          <div class="flex flex-wrap justify-center gap-8 text-sm">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-charcoal font-medium">Insurance backed</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-charcoal font-medium">10 year coverage</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-charcoal font-medium">Instant cover</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section-padding bg-white">
      <div class="container-wide">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold text-charcoal mb-4">
            Simple Protection in 3 Steps
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting your clean energy system protected is quick and straightforward
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div class="text-center">
            <div class="w-20 h-20 bg-charcoal rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <IconsAnimatedFormIcon />
            </div>
            <h3 class="text-xl font-semibold text-charcoal mb-3">Register</h3>
            <p class="text-gray-600 leading-relaxed">Upload your system details<br>and proof of purchase documentation</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-charcoal rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <IconsAnimatedPaymentIcon />
            </div>
            <h3 class="text-xl font-semibold text-charcoal mb-3">Pay</h3>
            <p class="text-gray-600 leading-relaxed">Complete secure payment via Stripe<br>from just £99.99</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-charcoal rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <IconsAnimatedLockIcon />
            </div>
            <h3 class="text-xl font-semibold text-charcoal mb-3">Protected</h3>
            <p class="text-gray-600 leading-relaxed">Receive your insurance certificate<br>instantly via email</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="section-padding bg-gray-50">
      <div class="container-wide">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-semibold text-charcoal mb-4">
            Simple, Transparent Pricing
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            One payment, up to 10 years of protection. Price depends on your system age.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <NuxtLink 
            to="/register?age=0-12" 
            class="card text-center border-2 border-amber relative hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <h3 class="text-lg font-semibold text-charcoal mb-2 mt-2">Under 12 months</h3>
            <div class="text-3xl font-bold text-amber mb-2">£99.99</div>
            <p class="text-sm text-gray-600">10 years coverage</p>
          </NuxtLink>
          <NuxtLink 
            to="/register?age=12-24" 
            class="card text-center hover:shadow-xl transition-shadow cursor-pointer"
          >
            <h3 class="text-lg font-semibold text-charcoal mb-2">1-2 years old</h3>
            <div class="text-3xl font-bold text-charcoal mb-2">£199.99</div>
            <p class="text-sm text-gray-600">8-9 years coverage</p>
          </NuxtLink>
          <NuxtLink 
            to="/register?age=24-36" 
            class="card text-center hover:shadow-xl transition-shadow cursor-pointer"
          >
            <h3 class="text-lg font-semibold text-charcoal mb-2">2-3 years old</h3>
            <div class="text-3xl font-bold text-charcoal mb-2">£289.00</div>
            <p class="text-sm text-gray-600">7-8 years coverage</p>
          </NuxtLink>
          <NuxtLink 
            to="/register?age=36-48" 
            class="card text-center hover:shadow-xl transition-shadow cursor-pointer"
          >
            <h3 class="text-lg font-semibold text-charcoal mb-2">3-4 years old</h3>
            <div class="text-3xl font-bold text-charcoal mb-2">£499.99</div>
            <p class="text-sm text-gray-600">6-7 years coverage</p>
          </NuxtLink>
        </div>
        <div class="text-center mt-8 text-sm text-gray-500">
          <p>Systems older than 4 years cannot be insured. Coverage runs until 10 years from original commissioning date.</p>
          <p class="mt-2">* Excess applies £29.95 | ** Change of ownership admin fee £49.95</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section-padding bg-white">
      <div class="container-wide">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold text-charcoal mb-4">
            Why Choose InsuraGuard?
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Protection you can trust for your clean energy investment
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-14 h-14 bg-amber/10 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg class="w-7 h-7 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-charcoal mb-2">Insurance Backed</h3>
            <p class="text-gray-600 text-sm leading-relaxed">10 year guarantee backed by insurance protection.</p>
          </div>
          <div class="card text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-14 h-14 bg-amber/10 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg class="w-7 h-7 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-charcoal mb-2">10 Year Coverage</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Long-term peace of mind for solar and battery systems</p>
          </div>
          <div class="card text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-14 h-14 bg-amber/10 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg class="w-7 h-7 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-charcoal mb-2">Instant Cover</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Receive your insurance immediately after registration</p>
          </div>
          <div class="card text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-14 h-14 bg-amber/10 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg class="w-7 h-7 text-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-charcoal mb-2">GDPR Compliant</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Your data is secure and handled with the utmost care</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Check Claim Status Section -->
    <section class="py-12 bg-white">
      <div class="container-narrow">
        <div class="card-elevated text-center">
          <h2 class="text-2xl font-semibold text-charcoal mb-2">
            Check your Claim Status
          </h2>
          <p class="text-gray-600 mb-6">Enter your Unique Reference Number to check your policy status</p>
          <form @submit.prevent="verifyURN" class="max-w-lg mx-auto">
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                v-model="urnInput"
                type="text"
                placeholder="Enter URN (e.g., IG-2025-XXXXX)"
                class="input-field flex-1"
              />
              <button type="submit" class="btn-primary whitespace-nowrap">
                Verify
              </button>
            </div>
            <div v-if="verificationResult" class="mt-4 p-4 rounded-lg" :class="verificationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <div class="flex items-center justify-center gap-2" :class="verificationResult.valid ? 'text-green-800' : 'text-red-800'">
                <svg v-if="verificationResult.valid" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span class="font-medium">{{ verificationResult.message }}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Image Carousel Section -->
    <section class="py-12 bg-white">
      <div class="container-wide">
        <ImageCarousel />
      </div>
    </section>

    <!-- CTA Section with Logo -->
    <section class="py-8 lg:py-12 bg-charcoal">
      <div class="px-6 lg:relative">
        <!-- Logo - static on mobile, absolute on desktop -->
        <div class="lg:absolute lg:left-6 lg:top-0 text-left mb-6 lg:mb-0">
          <div class="inline-block bg-white rounded-lg px-4 py-2.5 mb-2">
            <img 
              src="/InsuraGuard-logo-transparent-1200.png" 
              alt="InsuraGuard" 
              class="h-12 w-auto max-w-[120px] object-contain"
            />
          </div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            Insurance-backed protection for your clean energy investment.
          </p>
        </div>

        <!-- CTA Content centered relative to full width -->
        <div class="text-center lg:relative">
          <h2 class="text-2xl md:text-3xl font-semibold text-white mb-3">
            Ready to Protect Your Investment?
          </h2>
          <p class="text-base text-gray-300 mb-6">
            Insure your system today and enjoy 10 years of peace of mind from just £99.99 for 10 years.
          </p>
          <NuxtLink to="/register" class="btn-primary text-base px-8 py-3 inline-block">
            Get Started  £99.99
          </NuxtLink>
          <div class="mt-4 text-xs text-gray-400 space-y-1">
            <p>* Excess applies £29.95</p>
            <p>** Change of ownership admin fee applies £49.95</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore - Nuxt auto-imports
const supabase = useSupabaseClient();

useSeoMeta({
  title: 'InsuraGuard - Insurance-Backed Guarantee for Clean Energy Systems',
  description: '10-year insurance-backed protection for your solar PV and battery storage installation. Protect your clean energy investment with InsuraGuard.',
  ogTitle: 'InsuraGuard - Clean Energy Protection',
  ogDescription: 'Insurance-backed guarantee for solar and battery storage systems',
  ogType: 'website'
});

const urnInput = ref('');
const verificationResult = ref<{ valid: boolean; message: string } | null>(null);

const verifyURN = async () => {
  if (!urnInput.value.trim()) {
    verificationResult.value = {
      valid: false,
      message: 'Please enter a URN'
    };
    return;
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('id, status')
    .eq('urn', urnInput.value.trim())
    .single();

  if (error || !data) {
    verificationResult.value = {
      valid: false,
      message: 'Invalid Reference - URN not found'
    };
  } else {
    verificationResult.value = {
      valid: true,
      message: `Valid Policy - Status: ${(data as any).status}`
    };
  }
};
</script>

<style scoped>
.sun-core {
  background: radial-gradient(
    circle at 100% 0%,
    rgba(255, 200, 50, 0.5) 0%,
    rgba(255, 180, 30, 0.35) 5%,
    rgba(230, 126, 34, 0.2) 12%,
    transparent 20%
  );
  pointer-events: none;
}
</style>
