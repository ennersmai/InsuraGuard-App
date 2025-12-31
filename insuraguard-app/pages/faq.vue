<template>
  <div>
    <!-- Hero Section -->
    <section class="section-padding bg-white">
      <div class="container-narrow text-center">
        <h1 class="text-4xl md:text-5xl font-semibold text-charcoal mb-6">Frequently Asked Questions</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about InsuraGuard and how we protect your clean energy investment.
        </p>
      </div>
    </section>

    <!-- FAQ Categories -->
    <section class="py-12 bg-gray-50">
      <div class="container-narrow">
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="activeCategory = category.id"
            class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
            :class="activeCategory === category.id ? 'bg-charcoal text-white' : 'bg-white text-charcoal hover:bg-gray-100 border border-gray-200'"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index" 
            class="card overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <h3 class="text-lg font-medium text-charcoal">{{ faq.question }}</h3>
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-charcoal transition-transform duration-200"
                  :class="{ 'rotate-180': openFaq === index }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div 
              v-show="openFaq === index" 
              class="px-6 pb-6 border-t border-gray-100"
            >
              <div class="pt-4 text-gray-600 leading-relaxed faq-content" v-html="faq.answer"></div>
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
              src="/InsuraGuard-logo-primary.svg" 
              alt="InsuraGuard" 
              class="h-12 w-auto min-w-[120px]"
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
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/contact" class="btn-primary px-8 py-4">
              Contact Us
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
  title: 'FAQ - InsuraGuard Clean Energy Protection',
  description: 'Frequently asked questions about InsuraGuard insurance backed guarantees for solar and battery storage systems.',
  ogTitle: 'InsuraGuard FAQ',
  ogDescription: 'Common questions about clean energy insurance protection'
});

const openFaq = ref<number | null>(null);
const activeCategory = ref('all');

const categories = [
  { id: 'all', name: 'All Questions' },
  { id: 'coverage', name: 'Coverage' },
  { id: 'registration', name: 'Registration' },
  { id: 'claims', name: 'Claims' },
  { id: 'account', name: 'Account & Data' }
];

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index;
};

const faqs = [
  {
    question: "What does the Insura Guard guarantee cover?",
    category: 'coverage',
    answer: `<p>The guarantee covers labour and workmanship only, relating to the installation of your battery system. It does not cover faults with the battery itself or other equipment - these are covered separately by the manufacturer's warranty, not by Insura Guard.</p>`
  },
  {
    question: "How long does the guarantee last?",
    category: 'coverage',
    answer: `<p>Up to 10 years from the system's original commissioning date. The remaining period depends on the age of your battery when you register.</p>`
  },
  {
    question: "Who is eligible?",
    category: 'registration',
    answer: `<p>Your battery system must be less than 4 years old at the time of registration. Systems that are 4 years or older are not eligible for the guarantee.</p>`
  },
  {
    question: "How much does it cost?",
    category: 'registration',
    answer: `<p>Pricing depends on your battery's age at registration:</p>
    <ul class="list-disc ml-5 mt-2 space-y-1">
      <li><strong>Under 12 months old:</strong> £99.99 (10 years of cover)</li>
      <li><strong>12-24 months old:</strong> £199.99 (up to 9 years left)</li>
      <li><strong>2-3 years old:</strong> £289.00 (up to 8 years left)</li>
      <li><strong>3 years old:</strong> £499.99 (up to 7 years left)</li>
    </ul>`
  },
  {
    question: "What fees apply?",
    category: 'coverage',
    answer: `<p>There is an excess of £29.95 for each claim. If system ownership changes, a £49.95 admin fee applies.</p>`
  },
  {
    question: "How do I register?",
    category: 'registration',
    answer: `<p>Register any time within 3 years of the original commissioning date. Registration is not possible after your system turns 4 years old.</p>
    <p class="mt-2">To register, upload your proof of purchase (such as invoice or contract) and commissioning date through our online form.</p>
    <p class="mt-2"><a href="/register" class="text-amber hover:text-amber/90 underline font-medium">Start your registration now →</a></p>`
  },
  {
    question: "What happens if my installer goes out of business?",
    category: 'coverage',
    answer: `<p>Your guarantee remains valid for the rest of the cover period, even if your original installer ceases trading.</p>`
  },
  {
    question: "How do I make a claim?",
    category: 'claims',
    answer: `<p>To make a claim:</p>
    <ol class="list-decimal ml-5 mt-2 space-y-1">
      <li>Visit our <a href="/claim" class="text-amber hover:text-amber/90 underline">online claim form</a></li>
      <li>Complete all required information in the web form</li>
      <li>Upload supporting documents (evidence that your installer has ceased trading)</li>
      <li>Submit the form online</li>
    </ol>
    <p class="mt-2">Alternatively, you can download the PDF claim form and submit it via email to claims@insuraguard.com.</p>
    <p class="mt-2">Our team will review your claim and respond within 10 working days.</p>`
  },
  {
    question: "What documents are required?",
    category: 'registration',
    answer: `<p>You must provide proof of purchase and confirmation of the original commissioning date.</p>`
  },
  {
    question: "How is my data used?",
    category: 'account',
    answer: `<p>We handle all personal information in line with UK GDPR and our Privacy Policy. Data is securely stored and used only for processing your registration and managing your guarantee.</p>
    <p class="mt-2">For more information, see our <a href="/privacy" class="text-amber hover:text-amber/90 underline">Privacy Policy</a>.</p>`
  },
  {
    question: "Are there any important exclusions?",
    category: 'coverage',
    answer: `<p>Yes. This guarantee excludes:</p>
    <ul class="list-disc ml-5 mt-2 space-y-1">
      <li>Hardware or equipment faults (manufacturer's warranty only)</li>
      <li>Any indirect or consequential losses or damages</li>
      <li>Pre-existing faults or defects</li>
      <li>Issues resulting from improper use, lack of maintenance, unauthorised modifications, or deliberate damage</li>
      <li>Claims made where false or misleading information is provided</li>
    </ul>`
  },
  {
    question: "What else should I know?",
    category: 'coverage',
    answer: `<p>All claims and cover are subject to our full Terms & Conditions, available on request.</p>
    <p class="mt-2">Ongoing maintenance as recommended by your installer/manufacturer may be required to keep your cover valid. The guarantee may be voided in cases of fraud or misrepresentation.</p>`
  },
  {
    question: "Can I cancel?",
    category: 'account',
    answer: `<p>You have a 14-day cooling-off period after registering to cancel and receive a full refund. After this period, all fees are non-refundable.</p>`
  },
  {
    question: "How can I access my personal data?",
    category: 'account',
    answer: `<p>Under GDPR, you have the right to access, correct, or delete your personal data. To exercise these rights, you can submit a Data Subject Access Request (DSAR).</p>
    <p class="mt-2">To make a DSAR:</p>
    <ol class="list-decimal ml-5 mt-2 space-y-1">
      <li>Visit our <a href="/dsar" class="text-amber hover:text-amber/90 underline">DSAR page</a> and download the form</li>
      <li>Complete the form with your request details</li>
      <li>Provide proof of identity</li>
      <li>Email to privacy@insuraguard.com or call +44 (0)161 520 1169</li>
    </ol>
    <p class="mt-2">We will respond to your request within 30 days.</p>`
  }
];

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') return faqs;
  return faqs.filter((faq: any) => faq.category === activeCategory.value);
});
</script>
