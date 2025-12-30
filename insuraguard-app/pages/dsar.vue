<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-semibold text-charcoal mb-4">Data Subject Access Request</h1>
      <p class="text-xl text-gray-600">Request access to your personal data</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading DSAR form...</p>
    </div>

    <div v-else class="space-y-8">
      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">Your Rights Under GDPR</h2>
        <p class="text-gray-600 mb-4">Under the General Data Protection Regulation (GDPR), you have the right to:</p>
        <ul class="list-disc ml-6 space-y-2 text-gray-600">
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
          <li><strong>Erasure:</strong> Request deletion of your data (subject to legal obligations)</li>
          <li><strong>Restriction:</strong> Request limitation of processing</li>
          <li><strong>Portability:</strong> Receive your data in a structured format</li>
          <li><strong>Object:</strong> Object to certain types of processing</li>
        </ul>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">DSAR Form</h2>
        <div v-if="dsarTemplate" class="prose max-w-none mb-6">
          <div class="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-mono text-sm">{{ dsarTemplate }}</div>
        </div>
        <button @click="downloadDSARForm" class="btn-primary">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download DSAR Form
        </button>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">How to Submit</h2>
        <ol class="list-decimal ml-6 space-y-3 text-gray-600">
          <li>Download and complete the DSAR form above</li>
          <li>Provide proof of identity (e.g., copy of passport or driving license)</li>
          <li>Email everything to: <a href="mailto:privacy@insuraguard.com" class="text-amber hover:text-amber/90">privacy@insuraguard.com</a></li>
          <li>Include "DSAR Request" in the email subject line</li>
        </ol>
        <div class="mt-6 p-4 bg-amber/10 border border-amber/20 rounded-lg">
          <p class="text-sm text-charcoal">
            <strong>Response Time:</strong> We will respond to your request within 30 days of receipt. If your request is complex, we may extend this by a further 60 days and will notify you.
          </p>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">What Information We Hold</h2>
        <p class="text-gray-600 mb-4">When you submit a DSAR, we will provide you with:</p>
        <ul class="list-disc ml-6 space-y-2 text-gray-600">
          <li>Your registration details (name, email, address, phone)</li>
          <li>System information and documents</li>
          <li>Payment records</li>
          <li>Communication history</li>
          <li>Any other personal data we hold about you</li>
        </ul>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">Verification</h2>
        <p class="text-gray-600 mb-4">
          To protect your privacy, we need to verify your identity before processing your request. Please include one of the following with your DSAR:
        </p>
        <ul class="list-disc ml-6 space-y-2 text-gray-600">
          <li>Copy of passport</li>
          <li>Copy of driving license</li>
          <li>Copy of national ID card</li>
        </ul>
        <p class="text-sm text-gray-500 mt-4">
          We will only use this document to verify your identity and will delete it after processing your request.
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="font-medium text-charcoal mb-2">Questions?</h3>
        <p class="text-gray-600 text-sm">
          If you have questions about your data rights or the DSAR process, please contact our Data Protection Officer at 
          <a href="mailto:privacy@insuraguard.com" class="text-amber hover:text-amber/90">privacy@insuraguard.com</a>.
        </p>
        <p class="text-gray-600 text-sm mt-2">
          For more information about how we handle your data, see our <NuxtLink to="/privacy" class="text-amber hover:text-amber/90">Privacy Policy</NuxtLink>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true);
const dsarTemplate = ref('');

const fetchDSARTemplate = async () => {
  try {
    const response = await fetch('/templates/dsar-form-template.txt');
    if (response.ok) {
      dsarTemplate.value = await response.text();
    } else {
      dsarTemplate.value = 'DSAR form template not available';
    }
  } catch (e) {
    dsarTemplate.value = 'Error loading DSAR form';
  } finally {
    loading.value = false;
  }
};

const downloadDSARForm = () => {
  const blob = new Blob([dsarTemplate.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'InsuraGuard_DSAR_Form.txt';
  link.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  fetchDSARTemplate();
});
</script>
