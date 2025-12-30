<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-semibold text-charcoal mb-4">Make a Claim</h1>
      <p class="text-xl text-gray-600">Submit your claim online</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading claim form...</p>
    </div>

    <div v-else class="space-y-8">
      <!-- Claim Form Content from Template -->
      <div class="bg-white shadow rounded-lg p-8">
        <div v-if="claimTemplate" class="prose max-w-none mb-8">
          <div class="whitespace-pre-wrap text-gray-700" v-html="claimTemplate"></div>
        </div>
      </div>

      <!-- Online Claim Form -->
      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-semibold text-charcoal mb-6">Submit Your Claim</h2>
        
        <form @submit.prevent="submitClaim" class="space-y-6">
          <div>
            <label for="urn" class="block text-sm font-medium text-charcoal mb-2">Unique Reference Number (URN) *</label>
            <input
              id="urn"
              v-model="formData.urn"
              type="text"
              required
              placeholder="e.g., IG-2025-XXXXX"
              class="input-field"
            />
          </div>

          <div>
            <label for="full_name" class="block text-sm font-medium text-charcoal mb-2">Full Name *</label>
            <input
              id="full_name"
              v-model="formData.full_name"
              type="text"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-charcoal mb-2">Email Address *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-charcoal mb-2">Phone Number *</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="claim_description" class="block text-sm font-medium text-charcoal mb-2">Claim Description *</label>
            <textarea
              id="claim_description"
              v-model="formData.claim_description"
              required
              rows="6"
              placeholder="Please provide a detailed description of your claim, including dates, issues encountered, and any relevant information..."
              class="input-field"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Supporting Documents</label>
            <p class="text-sm text-gray-600 mb-3">Upload evidence such as photos, Companies House records, correspondence, etc. (Max 10 files, 5MB each)</p>
            <input
              type="file"
              @change="handleFileChange"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber/10 file:text-amber hover:file:bg-amber/20"
            />
            <div v-if="selectedFiles.length > 0" class="mt-3 space-y-2">
              <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <span class="truncate">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                <button type="button" @click="removeFile(index)" class="text-red-600 hover:text-red-700 ml-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {{ submitError }}
          </div>

          <div v-if="submitSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {{ submitSuccess }}
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="btn-primary w-full"
          >
            <span v-if="submitting">Submitting...</span>
            <span v-else>Submit Claim</span>
          </button>
        </form>
      </div>

      <!-- Download PDF Option -->
      <div class="bg-gray-50 rounded-lg p-6 text-center">
        <h3 class="font-medium text-charcoal mb-2">Prefer a PDF Form?</h3>
        <p class="text-gray-600 text-sm mb-4">You can download a PDF version of the claim form if you prefer to submit via email.</p>
        <button @click="downloadClaimForm" class="btn-outline" :disabled="!claimTemplate">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Claim Form
        </button>
        <p class="text-xs text-gray-500 mt-3">Email completed form to: <a href="mailto:claims@insuraguard.com" class="text-amber hover:text-amber/90">claims@insuraguard.com</a></p>
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
          <a href="mailto:claims@insuraguard.com" class="text-amber hover:text-amber/90">claims@insuraguard.com</a>, 
          call <a href="tel:+441615201169" class="text-amber hover:text-amber/90">+44 (0)161 520 1169</a>, or 
          <NuxtLink to="/contact" class="text-amber hover:text-amber/90">visit our contact page</NuxtLink>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref(true);
const claimTemplate = ref('');
const submitting = ref(false);
const submitError = ref('');
const submitSuccess = ref('');
const selectedFiles = ref<File[]>([]);

const formData = ref({
  urn: '',
  full_name: '',
  email: '',
  phone: '',
  claim_description: ''
});

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

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      submitError.value = 'Some files were too large (max 5MB each)';
    }
    selectedFiles.value = [...selectedFiles.value, ...validFiles].slice(0, 10);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const submitClaim = async () => {
  if (!user.value) {
    submitError.value = 'You must be logged in to submit a claim';
    return;
  }

  submitting.value = true;
  submitError.value = '';
  submitSuccess.value = '';

  try {
    const documentUrls: string[] = [];

    // Upload files to storage
    for (const file of selectedFiles.value) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.value.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('claim-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      documentUrls.push(filePath);
    }

    // Insert claim into database
    const { error: insertError } = await supabase
      .from('claims')
      .insert({
        user_id: user.value.id,
        urn: formData.value.urn,
        full_name: formData.value.full_name,
        email: formData.value.email,
        phone: formData.value.phone,
        claim_description: formData.value.claim_description,
        document_urls: documentUrls,
        status: 'pending'
      });

    if (insertError) throw insertError;

    submitSuccess.value = 'Your claim has been submitted successfully! We will review it and contact you within 2 working days.';
    
    // Reset form
    formData.value = {
      urn: '',
      full_name: '',
      email: '',
      phone: '',
      claim_description: ''
    };
    selectedFiles.value = [];
  } catch (e: any) {
    submitError.value = e.message || 'Failed to submit claim. Please try again.';
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchClaimTemplate();
});
</script>
