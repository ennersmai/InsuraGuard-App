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
        <button @click="downloadDSARForm" class="btn-primary" :disabled="!dsarTemplate">
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
          <li>Email everything to: <a href="mailto:support@insuraguard.co.uk" class="text-amber hover:text-amber/90">support@insuraguard.co.uk</a> or call <a href="tel:+441615201169" class="text-amber hover:text-amber/90">+44 (0)161 520 1169</a></li>
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
          <a href="mailto:support@insuraguard.co.uk" class="text-amber hover:text-amber/90">support@insuraguard.co.uk</a> or 
          call <a href="tel:+441615201169" class="text-amber hover:text-amber/90">+44 (0)161 520 1169</a>.
        </p>
        <p class="text-gray-600 text-sm mt-2">
          For more information about how we handle your data, see our <NuxtLink to="/privacy" class="text-amber hover:text-amber/90">Privacy Policy</NuxtLink>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const loading = ref(true);
const dsarTemplate = ref('');

const fetchDSARTemplate = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_templates')
      .select('content')
      .eq('template_type', 'dsar_form')
      .single();

    if (error) throw error;
    dsarTemplate.value = data?.content || 'DSAR form template not available';
  } catch (e) {
    dsarTemplate.value = 'Error loading DSAR form';
  } finally {
    loading.value = false;
  }
};

const downloadDSARForm = async () => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  // Add logo
  const logoImg = new Image();
  logoImg.src = '/InsuraGuard-logo-transparent-1200.png';
  await new Promise((resolve) => {
    logoImg.onload = resolve;
  });
  
  // Add logo centered at top of first page
  const logoWidth = 40;
  const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
  const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
  doc.addImage(logoImg, 'PNG', logoX, 10, logoWidth, logoHeight);
  
  // Page settings
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = logoHeight + 25;
  
  // Helper to draw a form field line
  const drawFieldLine = (x: number, y: number, width: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(x, y, x + width, y);
  };
  
  const lines = dsarTemplate.value.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Detect line types
    const isMainTitle = i < 3 && trimmedLine.length > 0;
    const isSection = trimmedLine.startsWith('SECTION');
    const isEmpty = trimmedLine.length === 0;
    const hasUnderscore = trimmedLine.includes('_');
    
    // Prevent section headers from being orphaned
    if (isSection && yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Check if we need a new page
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Render based on line type
    if (isEmpty) {
      yPosition += 4;
    } else if (isMainTitle) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(trimmedLine, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    } else if (isSection) {
      yPosition += 3;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(trimmedLine, margin, yPosition);
      yPosition += 8;
    } else if (hasUnderscore) {
      // This is a form field - replace underscores with a line
      const parts = trimmedLine.split(':');
      if (parts.length > 1) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const label = parts[0].trim() + ':';
        doc.text(label, margin, yPosition);
        const labelWidth = doc.getTextWidth(label);
        drawFieldLine(margin + labelWidth + 2, yPosition + 0.5, maxWidth - labelWidth - 2);
        yPosition += 7;
      } else {
        // Multi-line field
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(trimmedLine.replace(/_+/g, ''), margin, yPosition);
        yPosition += 2;
        drawFieldLine(margin, yPosition, maxWidth);
        yPosition += 6;
      }
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const wrappedLines = doc.splitTextToSize(trimmedLine, maxWidth);
      doc.text(wrappedLines, margin, yPosition);
      yPosition += wrappedLines.length * 5.5;
    }
  }
  
  // Add footer with date and page numbers
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `InsuraGuard DSAR Form - Downloaded: ${new Date().toLocaleDateString('en-GB')} - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  doc.save('InsuraGuard_DSAR_Form.pdf');
};

onMounted(() => {
  fetchDSARTemplate();
});
</script>
