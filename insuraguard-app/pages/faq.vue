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
      <div class="container-narrow text-center">
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
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'FAQ - InsuraGuard Clean Energy Protection',
  description: 'Frequently asked questions about InsuraGuard insurance-backed guarantees for solar and battery storage systems.',
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
    question: "What does InsuraGuard cover?",
    category: 'coverage',
    answer: `<p>InsuraGuard provides insurance-backed protection for your clean energy installation guarantee. If your original installer ceases to trade within 10 years of your system's commissioning date, your guarantee remains valid and protected.</p>
    <p class="mt-2">This covers defects in workmanship and materials for solar PV systems, battery storage systems, and related clean energy installations.</p>`
  },
  {
    question: "How do I register my system?",
    category: 'registration',
    answer: `<p>Registration is simple and takes just a few minutes:</p>
    <ol class="list-decimal ml-5 mt-2 space-y-1">
      <li>Create an account or log in</li>
      <li>Complete the registration form with your system details</li>
      <li>Upload proof of purchase documents</li>
      <li>Make a one-time payment of £99</li>
      <li>Receive your insurance certificate instantly via email</li>
    </ol>
    <p class="mt-2"><a href="/register" class="text-amber hover:text-amber/90 underline font-medium">Start your registration now →</a></p>`
  },
  {
    question: "What if my installer goes out of business?",
    category: 'coverage',
    answer: `<p>If your installer ceases to trade during the 10-year coverage period, your guarantee remains fully protected under our insurance-backed scheme.</p>
    <p class="mt-2">You can submit a claim through our claims process, and we'll ensure your guarantee is honored according to the policy terms.</p>`
  },
  {
    question: "How long does registration take?",
    category: 'registration',
    answer: `<p>The entire registration process typically takes 5-10 minutes. Once you complete payment, you'll receive your insurance certificate immediately via email.</p>
    <p class="mt-2">Your unique reference number (URN) is generated instantly and can be used to verify your coverage at any time.</p>`
  },
  {
    question: "Can I register an existing installation?",
    category: 'registration',
    answer: `<p>Yes, you can register existing installations as long as your system was commissioned within the last 12 months.</p>
    <p class="mt-2">You'll need to provide proof of purchase and the original commissioning date. The 10-year coverage period starts from your system's commissioning date.</p>`
  },
  {
    question: "How do I make a claim?",
    category: 'claims',
    answer: `<p>To make a claim:</p>
    <ol class="list-decimal ml-5 mt-2 space-y-1">
      <li>Visit our <a href="/claim" class="text-amber hover:text-amber/90 underline">claims page</a> and download the claim form</li>
      <li>Complete all required information</li>
      <li>Provide evidence that your installer has ceased trading</li>
      <li>Submit the form to claims@insuraguard.com</li>
    </ol>
    <p class="mt-2">Our team will review your claim and respond within 10 working days.</p>`
  },
  {
    question: "What documents do I need to register?",
    category: 'registration',
    answer: `<p>You'll need to upload proof of purchase for your clean energy system. Acceptable documents include:</p>
    <ul class="list-disc ml-5 mt-2 space-y-1">
      <li>Invoice from your installer</li>
      <li>Purchase agreement or contract</li>
      <li>Receipt showing payment</li>
      <li>MCS certificate (if applicable)</li>
    </ul>
    <p class="mt-2">Documents can be uploaded as PDF, JPG, or PNG files (max 10MB each, up to 5 files).</p>`
  },
  {
    question: "Is my data secure?",
    category: 'account',
    answer: `<p>Yes, we take data security seriously. InsuraGuard is fully GDPR compliant and uses industry-standard encryption to protect your personal information.</p>
    <p class="mt-2">Your data is stored securely and only used for the purposes of providing your insurance-backed guarantee. We never share your information with third parties without your consent.</p>
    <p class="mt-2">For more information, see our <a href="/privacy" class="text-amber hover:text-amber/90 underline">Privacy Policy</a>.</p>`
  },
  {
    question: "What is a URN and why do I need it?",
    category: 'account',
    answer: `<p>Your URN (Unique Reference Number) is a unique identifier for your insurance policy, formatted as IG-YYYY-XXXXX.</p>
    <p class="mt-2">You'll need your URN to:</p>
    <ul class="list-disc ml-5 mt-2 space-y-1">
      <li>Verify your coverage status</li>
      <li>Make a claim</li>
      <li>Access your policy documents</li>
      <li>Contact our support team about your policy</li>
    </ul>
    <p class="mt-2">Keep your URN safe and include it in all correspondence with us.</p>`
  },
  {
    question: "Can I cancel my registration?",
    category: 'account',
    answer: `<p>You have a 14-day cooling-off period from the date of registration during which you can cancel for a full refund.</p>
    <p class="mt-2">After the cooling-off period, the registration fee is non-refundable as your coverage is active and your certificate has been issued.</p>
    <p class="mt-2">To request a cancellation, please contact us at support@insuraguard.co.uk with your URN.</p>`
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
      <li>Email to privacy@insuraguard.com</li>
    </ol>
    <p class="mt-2">We will respond to your request within 30 days.</p>`
  }
];

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') return faqs;
  return faqs.filter((faq: any) => faq.category === activeCategory.value);
});
</script>
