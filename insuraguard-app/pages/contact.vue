<template>
  <div>
    <!-- Hero Section -->
    <section class="section-padding bg-white relative">
      <div class="container-narrow text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-semibold text-charcoal mb-6">Contact Us</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Have a question or need assistance? Our team is here to help.
        </p>
      </div>
      <div class="absolute bottom-0 right-0 hidden md:block">
        <img 
          src="/woman_shield.webp" 
          alt="InsuraGuard Support" 
          class="w-full h-auto object-contain pt-4"
          style="max-height: 300px; max-width: 400px;"
        />
      </div>
      <!-- Mobile image below text -->
      <div class="flex justify-center md:hidden mt-8">
        <img 
          src="/woman_shield.webp" 
          alt="InsuraGuard Support" 
          class="w-full h-auto object-contain"
          style="max-height: 300px; max-width: 400px;"
        />
      </div>
    </section>

    <!-- Contact Content -->
    <section class="py-12 bg-gray-50">
      <div class="container-wide">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="card">
            <h2 class="text-2xl font-semibold text-charcoal mb-8">Get in Touch</h2>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-charcoal mb-1">Email</h3>
                  <p class="text-gray-600">support@insuraguard.co.uk</p>
                  <p class="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-charcoal mb-1">Phone</h3>
                  <p class="text-gray-600"><a href="tel:+441615201169" class="hover:text-amber">+44 (0)161 520 1169</a></p>
                  <p class="text-sm text-gray-500 mt-1">Mon-Fri, 9am-5pm GMT</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-charcoal mb-1">Address</h3>
                  <p class="text-gray-600">
                    InsuraGuard<br>
                    Floor 10, City Tower<br>
                    Piccadilly Plaza<br>
                    New York Street<br>
                    Manchester, M1 4BT
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-100">
              <h3 class="font-semibold text-charcoal mb-4">Specific Enquiries</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <p><span class="font-medium text-charcoal">Claims:</span> <a href="mailto:claims@insuraguard.com" class="hover:text-amber">claims@insuraguard.com</a> | <a href="tel:+441615201169" class="hover:text-amber">+44 (0)161 520 1169</a></p>
                <p><span class="font-medium text-charcoal">Privacy/GDPR:</span> <a href="mailto:privacy@insuraguard.com" class="hover:text-amber">privacy@insuraguard.com</a> | <a href="tel:+441615201169" class="hover:text-amber">+44 (0)161 520 1169</a></p>
                <p><span class="font-medium text-charcoal">Technical Support:</span> <a href="mailto:support@insuraguard.com" class="hover:text-amber">support@insuraguard.com</a></p>
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="text-2xl font-semibold text-charcoal mb-8">Quick Links</h2>
            
            <div class="space-y-4">
              <NuxtLink to="/faq" class="block p-4 border border-gray-200 rounded-xl hover:border-amber hover:bg-amber/5 transition-all duration-200">
                <h3 class="font-semibold text-charcoal mb-1">Frequently Asked Questions</h3>
                <p class="text-sm text-gray-600">Find answers to common questions</p>
              </NuxtLink>

              <NuxtLink to="/claim" class="block p-4 border border-gray-200 rounded-xl hover:border-amber hover:bg-amber/5 transition-all duration-200">
                <h3 class="font-semibold text-charcoal mb-1">Make a Claim</h3>
                <p class="text-sm text-gray-600">Submit your claim online</p>
              </NuxtLink>

              <NuxtLink to="/dsar" class="block p-4 border border-gray-200 rounded-xl hover:border-amber hover:bg-amber/5 transition-all duration-200">
                <h3 class="font-semibold text-charcoal mb-1">Data Subject Access Request</h3>
                <p class="text-sm text-gray-600">Request your personal data</p>
              </NuxtLink>

              <NuxtLink to="/verify" class="block p-4 border border-gray-200 rounded-xl hover:border-amber hover:bg-amber/5 transition-all duration-200">
                <h3 class="font-semibold text-charcoal mb-1">Verify URN</h3>
                <p class="text-sm text-gray-600">Check your policy status</p>
              </NuxtLink>
            </div>

            <div class="mt-8 p-5 bg-gray-50 rounded-xl">
              <h3 class="font-semibold text-charcoal mb-3">Business Hours</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-medium">Monday - Friday:</span> 9:00 AM - 5:00 PM</p>
                <p><span class="font-medium">Saturday - Sunday:</span> Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section-padding bg-charcoal">
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
          <h2 class="text-3xl font-semibold text-white mb-4">Still have questions?</h2>
          <p class="text-gray-300 mb-8 max-w-xl mx-auto">
            Need help with your policy or have questions about our service? Our team is here to help.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/faq" class="btn-primary px-8 py-4">
              View FAQ
            </NuxtLink>
            <NuxtLink to="/register" class="bg-white/10 text-white px-8 py-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200">
              Register Your System
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Contact Us - InsuraGuard',
  description: 'Get in touch with InsuraGuard. Contact our team for support, claims, or general enquiries.',
  ogTitle: 'Contact InsuraGuard',
  ogDescription: 'Reach out to our support team'
});
</script>
