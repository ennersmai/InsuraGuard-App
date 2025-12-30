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
            <label for="installation_address" class="block text-sm font-medium text-charcoal mb-2">Installation Address (if different)</label>
            <textarea
              id="installation_address"
              v-model="formData.installation_address"
              rows="2"
              class="input-field"
            ></textarea>
          </div>

          <div>
            <label for="postcode" class="block text-sm font-medium text-charcoal mb-2">Postcode</label>
            <input
              id="postcode"
              v-model="formData.postcode"
              type="text"
              class="input-field"
            />
          </div>

          <!-- SECTION 2: INSTALLATION DETAILS -->
          <div class="pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-charcoal mb-4">Section 2: Installation Details</h3>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-3">System Type (select all that apply) *</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" v-model="formData.system_type_solar_pv" class="mr-2">
                <span class="text-gray-700">Solar PV System</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="formData.system_type_battery" class="mr-2">
                <span class="text-gray-700">Battery Storage System</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="formData.system_type_solar_thermal" class="mr-2">
                <span class="text-gray-700">Solar Thermal</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="formData.system_type_other" class="mr-2">
                <span class="text-gray-700">Other</span>
              </label>
              <input
                v-if="formData.system_type_other"
                v-model="formData.system_type_other"
                type="text"
                placeholder="Please specify"
                class="input-field ml-6 mt-2"
              />
            </div>
          </div>

          <div>
            <label for="installer_company" class="block text-sm font-medium text-charcoal mb-2">Original Installer Company Name *</label>
            <input
              id="installer_company"
              v-model="formData.installer_company"
              type="text"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="installer_contact" class="block text-sm font-medium text-charcoal mb-2">Installer Contact Details (if known)</label>
            <input
              id="installer_contact"
              v-model="formData.installer_contact"
              type="text"
              class="input-field"
            />
          </div>

          <div>
            <label for="installation_date" class="block text-sm font-medium text-charcoal mb-2">Installation/Commissioning Date *</label>
            <input
              id="installation_date"
              v-model="formData.installation_date"
              type="date"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="system_size" class="block text-sm font-medium text-charcoal mb-2">System Size/Capacity</label>
            <input
              id="system_size"
              v-model="formData.system_size"
              type="text"
              placeholder="e.g., 4kW"
              class="input-field"
            />
          </div>

          <div>
            <label for="inverter_serial" class="block text-sm font-medium text-charcoal mb-2">Inverter Serial Number</label>
            <input
              id="inverter_serial"
              v-model="formData.inverter_serial"
              type="text"
              class="input-field"
            />
          </div>

          <div>
            <label for="battery_serial" class="block text-sm font-medium text-charcoal mb-2">Battery Serial Number (if applicable)</label>
            <input
              id="battery_serial"
              v-model="formData.battery_serial"
              type="text"
              class="input-field"
            />
          </div>

          <!-- SECTION 3: CLAIM DETAILS -->
          <div class="pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-charcoal mb-4">Section 3: Claim Details</h3>
          </div>

          <div>
            <label for="issue_first_noticed" class="block text-sm font-medium text-charcoal mb-2">Date Issue First Noticed *</label>
            <input
              id="issue_first_noticed"
              v-model="formData.issue_first_noticed"
              type="date"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="installer_contacted_date" class="block text-sm font-medium text-charcoal mb-2">Date Installer Contacted (if applicable)</label>
            <input
              id="installer_contacted_date"
              v-model="formData.installer_contacted_date"
              type="date"
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Has the installer ceased trading? *</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="formData.installer_ceased_trading" value="yes" required class="mr-2">
                <span class="text-gray-700">Yes</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.installer_ceased_trading" value="no" required class="mr-2">
                <span class="text-gray-700">No</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.installer_ceased_trading" value="unknown" required class="mr-2">
                <span class="text-gray-700">Unknown</span>
              </label>
            </div>
          </div>

          <div v-if="formData.installer_ceased_trading === 'yes'">
            <label for="cessation_evidence" class="block text-sm font-medium text-charcoal mb-2">Evidence of Cessation (Companies House, etc.)</label>
            <textarea
              id="cessation_evidence"
              v-model="formData.cessation_evidence"
              rows="3"
              placeholder="Please describe evidence (e.g., Companies House dissolution notice, administrator appointment, website closure)"
              class="input-field"
            ></textarea>
          </div>

          <div>
            <label for="nature_of_issue" class="block text-sm font-medium text-charcoal mb-2">Nature of Defect/Issue (please describe in detail) *</label>
            <textarea
              id="nature_of_issue"
              v-model="formData.nature_of_issue"
              required
              rows="6"
              placeholder="Please provide a detailed description of the defect or issue..."
              class="input-field"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Has the issue affected system performance?</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="formData.issue_affected_performance" :value="true" class="mr-2">
                <span class="text-gray-700">Yes</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.issue_affected_performance" :value="false" class="mr-2">
                <span class="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div v-if="formData.issue_affected_performance">
            <label for="performance_impact" class="block text-sm font-medium text-charcoal mb-2">Please describe impact</label>
            <textarea
              id="performance_impact"
              v-model="formData.performance_impact"
              rows="3"
              class="input-field"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Current System Status *</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" v-model="formData.system_status" value="not_operational" required class="mr-2">
                <span class="text-gray-700">Not operational</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.system_status" value="partially_operational" required class="mr-2">
                <span class="text-gray-700">Partially operational</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.system_status" value="fully_operational" required class="mr-2">
                <span class="text-gray-700">Fully operational</span>
              </label>
            </div>
          </div>

          <!-- SECTION 4: PREVIOUS ACTIONS -->
          <div class="pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-charcoal mb-4">Section 4: Previous Actions Taken</h3>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Have you contacted the original installer about this issue?</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="formData.contacted_installer" :value="true" class="mr-2">
                <span class="text-gray-700">Yes</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.contacted_installer" :value="false" class="mr-2">
                <span class="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div v-if="formData.contacted_installer">
            <label for="installer_contact_details" class="block text-sm font-medium text-charcoal mb-2">Please provide details and dates</label>
            <textarea
              id="installer_contact_details"
              v-model="formData.installer_contact_details"
              rows="3"
              class="input-field"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Have you obtained any quotes for repair work?</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="formData.obtained_quotes" :value="true" class="mr-2">
                <span class="text-gray-700">Yes</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.obtained_quotes" :value="false" class="mr-2">
                <span class="text-gray-700">No</span>
              </label>
            </div>
            <p v-if="formData.obtained_quotes" class="text-sm text-gray-600 mt-2">Please attach copies of all quotes in the supporting documents section below.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Have you made any temporary repairs?</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="formData.temporary_repairs" :value="true" class="mr-2">
                <span class="text-gray-700">Yes</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="formData.temporary_repairs" :value="false" class="mr-2">
                <span class="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div v-if="formData.temporary_repairs">
            <label for="temporary_repairs_details" class="block text-sm font-medium text-charcoal mb-2">Please provide details and retain all receipts</label>
            <textarea
              id="temporary_repairs_details"
              v-model="formData.temporary_repairs_details"
              rows="3"
              class="input-field"
            ></textarea>
          </div>

          <!-- SECTION 5: SUPPORTING DOCUMENTATION -->
          <div class="pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-charcoal mb-4">Section 5: Supporting Documentation</h3>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">Supporting Documents *</label>
            <p class="text-sm text-gray-600 mb-3">Please attach: InsuraGuard certificate, photos of defect (min 3), evidence of installer cessation, installation docs, correspondence, repair quotes, performance data. (Max 10 files, 5MB each)</p>
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

          <!-- SECTION 6: DECLARATION -->
          <div class="pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-charcoal mb-4">Section 6: Declaration</h3>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="flex items-start">
              <input type="checkbox" v-model="formData.declaration_accepted" required class="mr-3 mt-1">
              <span class="text-sm text-gray-700">
                I declare that:
                <ul class="list-disc ml-5 mt-2 space-y-1">
                  <li>The information provided in this claim form is true and accurate</li>
                  <li>I have not made any fraudulent statements</li>
                  <li>I understand that providing false information may invalidate my claim</li>
                  <li>I authorize InsuraGuard to contact relevant parties to verify this claim</li>
                  <li>I have read and understood the terms and conditions of my policy</li>
                </ul>
              </span>
            </label>
          </div>

          <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {{ submitError }}
          </div>

          <div v-if="submitSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {{ submitSuccess }}
          </div>

          <button
            type="submit"
            :disabled="submitting || !formData.declaration_accepted"
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
  installation_address: '',
  postcode: '',
  system_type_solar_pv: false,
  system_type_battery: false,
  system_type_solar_thermal: false,
  system_type_other: '',
  installer_company: '',
  installer_contact: '',
  installation_date: '',
  system_size: '',
  inverter_serial: '',
  battery_serial: '',
  issue_first_noticed: '',
  installer_contacted_date: '',
  installer_ceased_trading: '',
  cessation_evidence: '',
  nature_of_issue: '',
  issue_affected_performance: false,
  performance_impact: '',
  system_status: '',
  contacted_installer: false,
  installer_contact_details: '',
  obtained_quotes: false,
  temporary_repairs: false,
  temporary_repairs_details: '',
  declaration_accepted: false
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
        installation_address: formData.value.installation_address,
        postcode: formData.value.postcode,
        system_type_solar_pv: formData.value.system_type_solar_pv,
        system_type_battery: formData.value.system_type_battery,
        system_type_solar_thermal: formData.value.system_type_solar_thermal,
        system_type_other: formData.value.system_type_other,
        installer_company: formData.value.installer_company,
        installer_contact: formData.value.installer_contact,
        installation_date: formData.value.installation_date,
        system_size: formData.value.system_size,
        inverter_serial: formData.value.inverter_serial,
        battery_serial: formData.value.battery_serial,
        issue_first_noticed: formData.value.issue_first_noticed,
        installer_contacted_date: formData.value.installer_contacted_date,
        installer_ceased_trading: formData.value.installer_ceased_trading,
        cessation_evidence: formData.value.cessation_evidence,
        nature_of_issue: formData.value.nature_of_issue,
        issue_affected_performance: formData.value.issue_affected_performance,
        performance_impact: formData.value.performance_impact,
        system_status: formData.value.system_status,
        contacted_installer: formData.value.contacted_installer,
        installer_contact_details: formData.value.installer_contact_details,
        obtained_quotes: formData.value.obtained_quotes,
        temporary_repairs: formData.value.temporary_repairs,
        temporary_repairs_details: formData.value.temporary_repairs_details,
        declaration_accepted: formData.value.declaration_accepted,
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
      installation_address: '',
      postcode: '',
      system_type_solar_pv: false,
      system_type_battery: false,
      system_type_solar_thermal: false,
      system_type_other: '',
      installer_company: '',
      installer_contact: '',
      installation_date: '',
      system_size: '',
      inverter_serial: '',
      battery_serial: '',
      issue_first_noticed: '',
      installer_contacted_date: '',
      installer_ceased_trading: '',
      cessation_evidence: '',
      nature_of_issue: '',
      issue_affected_performance: false,
      performance_impact: '',
      system_status: '',
      contacted_installer: false,
      installer_contact_details: '',
      obtained_quotes: false,
      temporary_repairs: false,
      temporary_repairs_details: '',
      declaration_accepted: false
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
