<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-semibold text-charcoal mb-4">Make a Claim</h1>
      <p class="text-xl text-gray-600">Download and submit your claim form</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading claim form...</p>
    </div>

    <div v-else class="space-y-8">
      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">Before You Start</h2>
        <p class="text-gray-600 mb-4">To make a claim under your InsuraGuard policy, you'll need:</p>
        <ul class="list-disc ml-6 space-y-2 text-gray-600">
          <li>Your Unique Reference Number (URN)</li>
          <li>Evidence that your installer has ceased trading (e.g., Companies House records)</li>
          <li>Description and photos of the defect or issue</li>
          <li>Your original insurance certificate</li>
        </ul>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">Claim Form</h2>
        <div v-if="claimTemplate" class="prose max-w-none mb-6">
          <div class="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-mono text-sm">{{ claimTemplate }}</div>
        </div>
        <button @click="downloadClaimForm" class="btn-primary" :disabled="!claimTemplate">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Claim Form
        </button>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">How to Submit</h2>
        <ol class="list-decimal ml-6 space-y-3 text-gray-600">
          <li>Download and complete the claim form above</li>
          <li>Gather all required supporting documentation</li>
          <li>Email everything to: <a href="mailto:claims@insuraguard.com" class="text-amber hover:text-amber/90">claims@insuraguard.com</a></li>
          <li>Include your URN in the email subject line</li>
        </ol>
        <div class="mt-6 p-4 bg-amber/10 border border-amber/20 rounded-lg">
          <p class="text-sm text-charcoal">
            <strong>Response Time:</strong> We aim to acknowledge all claims within 2 working days and provide an initial assessment within 10 working days.
          </p>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-4">What Happens Next?</h2>
        <div class="space-y-4 text-gray-600">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-amber rounded-full flex items-center justify-center text-white font-semibold">1</div>
            <div>
              <h3 class="font-medium text-charcoal">Acknowledgment</h3>
              <p class="text-sm">We'll confirm receipt of your claim within 2 working days</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-amber rounded-full flex items-center justify-center text-white font-semibold">2</div>
            <div>
              <h3 class="font-medium text-charcoal">Assessment</h3>
              <p class="text-sm">Our Insurance-backed guarantee protection will review your claim and may request additional information</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-amber rounded-full flex items-center justify-center text-white font-semibold">3</div>
            <div>
              <h3 class="font-medium text-charcoal">Inspection</h3>
              <p class="text-sm">We may arrange for an independent inspection of your system</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-amber rounded-full flex items-center justify-center text-white font-semibold">4</div>
            <div>
              <h3 class="font-medium text-charcoal">Decision</h3>
              <p class="text-sm">You'll receive our decision and next steps</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="font-medium text-charcoal mb-2">Need Help?</h3>
        <p class="text-gray-600 text-sm">
          If you have questions about the claims process, please contact us at 
          <a href="mailto:claims@insuraguard.com" class="text-amber hover:text-amber/90">claims@insuraguard.com</a> or 
          <NuxtLink to="/contact" class="text-amber hover:text-amber/90">visit our contact page</NuxtLink>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const loading = ref(true);
const claimTemplate = ref('');

const fetchClaimTemplate = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_templates')
      .select('content')
      .eq('template_type', 'claim_form')
      .single();

    if (error) throw error;
    claimTemplate.value = data?.content || 'Claim form template not available';
  } catch (e) {
    claimTemplate.value = 'Error loading claim form';
  } finally {
    loading.value = false;
  }
};

const downloadClaimForm = async () => {
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
  
  const lines = claimTemplate.value.split('\n');
  
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
      `InsuraGuard Claim Form - Downloaded: ${new Date().toLocaleDateString('en-GB')} - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  doc.save('InsuraGuard_Claim_Form.pdf');
};

onMounted(() => {
  fetchClaimTemplate();
});
</script>
