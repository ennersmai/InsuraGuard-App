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

          <div v-if="submitSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm" data-success-message>
            {{ submitSuccess }}
          </div>

          <button
            type="submit"
            :disabled="submitting || !formData.declaration_accepted"
            class="btn-primary w-full"
          >
            <span v-if="submitting">Processing...</span>
            <span v-else>Pay & Submit Claim</span>
          </button>
        </form>
      </div>

      <!-- Download PDF Option -->
      <div class="bg-gray-50 rounded-lg p-6 text-center">
        <h3 class="font-medium text-charcoal mb-2">Prefer a PDF Form?</h3>
        <p class="text-gray-600 text-sm mb-4">You can download a PDF version of the claim form if you prefer to submit via email.</p>
        
        <!-- URN Input for PDF Download -->
        <div class="mb-4">
          <label for="pdfUrn" class="block text-sm font-medium text-charcoal mb-2">Your URN *</label>
          <input
            id="pdfUrn"
            v-model="pdfUrn"
            type="text"
            required
            placeholder="e.g., URN-20251230-9CN4D"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber focus:border-amber"
          />
        </div>
        
        <button @click="downloadClaimForm" :disabled="!claimTemplate || !pdfUrn" class="btn-outline">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Pay & Download PDF Form
        </button>
        <p class="text-xs text-gray-500 mt-3">
          Email completed form to: <a href="mailto:support@insuraguard.co.uk" class="text-amber hover:text-amber/90">support@insuraguard.co.uk</a>
        </p>
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
          <a href="mailto:support@insuraguard.co.uk" class="text-amber hover:text-amber/90">support@insuraguard.co.uk</a>, 
          call <a href="tel:+441615201169" class="text-amber hover:text-amber/90">+44 (0)161 520 1169</a>, or 
          <NuxtLink to="/contact" class="text-amber hover:text-amber/90">visit our contact page</NuxtLink>.
        </p>
      </div>
    </div>

    <!-- CTA Section -->
    <section class="section-padding bg-charcoal">
      <div class="px-6 lg:relative">
        <!-- Logo - static on mobile, absolute on desktop -->
        <div class="lg:absolute lg:left-6 lg:top-0 text-left mb-6 lg:mb-0">
          <div class="inline-block mb-2">
            <img 
              src="/InsuraGuard-logo-transparent_white-1200.png" 
              alt="InsuraGuard" 
              class="h-14 md:h-16 w-auto max-w-[140px] md:max-w-[160px] object-contain"
            />
          </div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            Insurance-backed protection for your clean energy investment.
          </p>
        </div>

        <!-- CTA Content centered relative to full width -->
        <div class="text-center lg:relative">
          <h2 class="text-3xl font-semibold text-white mb-4">Still have questions?</h2>
          <p class="text-gray-300 mb-6">We're here to help with your claim</p>
          <NuxtLink to="/contact" class="btn-primary">
            Contact Us
          </NuxtLink>
        </div>
      </div>
    </section>
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

// Excess fee payment state
const showExcessFeePayment = ref(false);
const excessFeeLoading = ref(false);
const excessFeeError = ref('');
const excessFeePaid = ref(false);
const submittedClaimId = ref('');
const pdfUrn = ref('');

const { chargeExcessFee } = useStripeFees();

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
  try {
    // First, charge the excess fee using the PDF URN
    const feeResult = await chargeExcessFee(pdfUrn.value);
    
    if (!feeResult.success) {
      alert(`Payment failed: ${feeResult.error}`);
      return;
    }

    // Store that this is a PDF download flow AND store the URN
    sessionStorage.setItem('wasPdfDownload', 'true');
    sessionStorage.setItem('pdfUrn', pdfUrn.value);
    
    // Redirect to Stripe Checkout
    if (feeResult.url) {
      window.location.href = feeResult.url;
    } else {
      alert('Failed to create payment session');
    }
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    alert('Failed to process payment. Please try again.');
  }
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

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const base64ToFile = (base64Data: string, filename: string, type: string): File => {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type });
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
    // First, charge the excess fee
    const tempId = formData.value.urn || 'temp-claim-fee';
    const feeResult = await chargeExcessFee(tempId);
    
    if (!feeResult.success) {
      submitError.value = `Payment failed: ${feeResult.error}`;
      return;
    }

    // Redirect to Stripe Checkout for payment
    if (feeResult.url) {
      // Store claim data in sessionStorage for after payment
      sessionStorage.setItem('pendingClaim', JSON.stringify({
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
        document_urls: selectedFiles.value.map(file => file.name),
        status: 'pending'
      }));
      
      // Store files for upload after payment (convert to base64)
      const filesForStorage = await Promise.all(
        selectedFiles.value.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          data: await fileToBase64(file)
        }))
      );
      sessionStorage.setItem('pendingFiles', JSON.stringify(filesForStorage));
      
      // Redirect to Stripe
      window.location.href = feeResult.url;
      return;
    } else {
      submitError.value = 'Failed to create payment session';
      return;
    }

  } catch (e: any) {
    submitError.value = e.message || 'Failed to submit claim. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const handleExcessFeePayment = async () => {
  excessFeeLoading.value = true;
  excessFeeError.value = '';
  
  try {
    // For excess fee, we don't need a claim ID yet - just charge the user
    // We'll use a temporary registration ID based on the URN
    const tempId = formData.value.urn || 'temp-claim-fee';
    
    const result = await chargeExcessFee(tempId);
    
    if (!result.success) {
      excessFeeError.value = result.error || 'Failed to charge excess fee';
      return;
    }
    
    // Redirect to Stripe Checkout
    if (result.url) {
      window.location.href = result.url;
    } else {
      excessFeeError.value = 'Failed to create payment session';
    }
    
  } catch (error: any) {
    excessFeeError.value = error.message || 'Failed to process excess fee payment';
  } finally {
    excessFeeLoading.value = false;
  }
};

onMounted(() => {
  fetchClaimTemplate();
  
  // Check if returning from successful payment
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('payment') === 'success') {
    // Check if this was a PDF download or claim submission
    const wasPdfDownload = sessionStorage.getItem('wasPdfDownload');
    
    if (wasPdfDownload === 'true') {
      // This was a PDF download, generate the PDF
      setTimeout(() => {
        downloadPdfAfterPayment();
      }, 1000);
      sessionStorage.removeItem('wasPdfDownload');
    } else {
      // This was a claim submission, submit the pending claim
      submitPendingClaim();
    }
  }
});

const submitPendingClaim = async () => {
  try {
    const pendingClaim = sessionStorage.getItem('pendingClaim');
    const pendingFiles = sessionStorage.getItem('pendingFiles');
    
    if (!pendingClaim) {
      console.error('No pending claim data found');
      return;
    }
    
    const claimData = JSON.parse(pendingClaim);
    const filesData = pendingFiles ? JSON.parse(pendingFiles) : [];
    
    // Reconstruct File objects from base64 data
    const files: File[] = filesData.map((fileData: any) => 
      base64ToFile(fileData.data, fileData.name, fileData.type)
    );
    
    // Upload files to storage
    const documentUrls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${claimData.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('claim-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      documentUrls.push(filePath);
    }
    
    // Update claim data with actual file URLs
    claimData.document_urls = documentUrls;
    
    // Insert claim into database and get the generated ID
    const { data: insertedClaim, error: insertError } = await supabase
      .from('claims')
      .insert(claimData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Send confirmation email to user
    const { error: userEmailError } = await supabase.functions.invoke('send-claim-confirmation', {
      body: {
        claimId: insertedClaim.claim_reference || insertedClaim.id,
        customerName: claimData.full_name,
        customerEmail: claimData.email,
        urn: claimData.urn,
        claimDescription: claimData.nature_of_issue,
        paymentAmount: 2995 // £29.95 in pence
      }
    });

    if (userEmailError) {
      console.error('Failed to send user confirmation email:', userEmailError);
    }

    // Send detailed claim email to support with ALL form fields
    const { error: supportEmailError } = await supabase.functions.invoke('send-excess-fee-email', {
      body: {
        claimId: insertedClaim.claim_reference || insertedClaim.id,
        urn: claimData.urn,
        customerName: claimData.full_name,
        customerEmail: claimData.email,
        customerPhone: claimData.phone,
        installationAddress: claimData.installation_address,
        postcode: claimData.postcode,
        claimDescription: claimData.nature_of_issue,
        systemType: [
          claimData.system_type_solar_pv && 'Solar PV',
          claimData.system_type_battery && 'Battery',
          claimData.system_type_solar_thermal && 'Solar Thermal',
          claimData.system_type_other
        ].filter(Boolean).join(', '),
        installerCompany: claimData.installer_company,
        installerContact: claimData.installer_contact,
        installationDate: claimData.installation_date,
        systemSize: claimData.system_size,
        inverterSerial: claimData.inverter_serial,
        batterySerial: claimData.battery_serial,
        issueFirstNoticed: claimData.issue_first_noticed,
        installerContactedDate: claimData.installer_contacted_date,
        installerCeasedTrading: claimData.installer_ceased_trading,
        cessationEvidence: claimData.cessation_evidence,
        issueAffectedPerformance: claimData.issue_affected_performance,
        performanceImpact: claimData.performance_impact,
        systemStatus: claimData.system_status,
        contactedInstaller: claimData.contacted_installer,
        installerContactDetails: claimData.installer_contact_details,
        obtainedQuotes: claimData.obtained_quotes,
        temporaryRepairs: claimData.temporary_repairs,
        temporaryRepairsDetails: claimData.temporary_repairs_details,
        declarationAccepted: claimData.declaration_accepted,
        documentUrls: documentUrls,
        userId: claimData.user_id,
        paymentAmount: 2995, // £29.95 in pence
        paymentId: 'Stripe payment completed',
        paymentDate: Date.now()
      }
    });

    if (supportEmailError) {
      console.error('Failed to send support email:', supportEmailError);
    }

    submitSuccess.value = 'Your claim has been submitted successfully! We will review it and contact you within 2 working days.';
    
    // Clear sessionStorage
    sessionStorage.removeItem('pendingClaim');
    sessionStorage.removeItem('pendingFiles');
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Auto-scroll to success message
    setTimeout(() => {
      const successElement = document.querySelector('[data-success-message]');
      if (successElement) {
        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    
  } catch (error: any) {
    console.error('Error submitting pending claim:', error);
    submitError.value = 'Failed to submit claim after payment. Please try again.';
  }
};

const downloadPdfAfterPayment = async () => {
  try {
    // Retrieve URN from sessionStorage
    const storedUrn = sessionStorage.getItem('pdfUrn');
    if (storedUrn) {
      pdfUrn.value = storedUrn;
    }

    // Check if user is logged in
    if (!user.value?.id) {
      throw new Error('User not logged in')
    }

    if (!pdfUrn.value) {
      throw new Error('URN is missing')
    }

    // First, generate a claim ID by inserting a minimal claim record
    const claimRecord: any = {
      user_id: user.value.id,
      urn: pdfUrn.value,
      full_name: user.value?.user_metadata?.full_name || '',
      email: user.value?.email || '',
      phone: '',
      nature_of_issue: 'Pending PDF submission',
      status: 'pending_pdf',
      excess_payment_status: 'paid',
      excess_payment_date: new Date().toISOString()
    }

    const { data: insertedClaim, error: claimError } = await supabase
      .from('claims')
      .insert(claimRecord)
      .select()
      .single()

    if (claimError) {
      console.error('Database error:', claimError)
      throw new Error(`Failed to generate claim ID: ${claimError.message}`)
    }

    if (!insertedClaim) {
      throw new Error('Failed to generate claim ID: No data returned')
    }

    const generatedClaimId = (insertedClaim as any).claim_reference || (insertedClaim as any).id

    // Send email with instructions
    await supabase.functions.invoke('send-claim-pdf-instructions', {
      body: {
        claimId: generatedClaimId,
        customerName: user.value?.user_metadata?.full_name || 'Customer',
        customerEmail: user.value?.email,
        urn: pdfUrn.value,
        claimDescription: 'Claim form downloaded - awaiting submission'
      }
    })

    // Generate PDF after successful payment
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
    
    // Add claim ID prominently at the top
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = logoHeight + 25;

    // Add Claim Reference prominently
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CLAIM REFERENCE:', margin, yPosition);
    doc.setFontSize(14);
    doc.setTextColor(230, 126, 34); // Orange color
    doc.text(generatedClaimId, margin + 55, yPosition);
    doc.setTextColor(0, 0, 0); // Reset to black
    yPosition += 10;
    
    // Helper to draw a form field line
    const drawFieldLine = (x: number, y: number, width: number) => {
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.line(x, y, x + width, y);
    };
    
    // Add pre-filled URN
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('URN:', margin, yPosition);
    const urnLabelWidth = doc.getTextWidth('URN:');
    drawFieldLine(margin + urnLabelWidth + 2, yPosition + 0.5, maxWidth - urnLabelWidth - 2);
    doc.setFont('helvetica', 'bold');
    doc.text(pdfUrn.value, margin + urnLabelWidth + 5, yPosition);
    yPosition += 15;
    
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
      
      // Skip the URN line since we already added it
      if (trimmedLine.toLowerCase().includes('unique reference number') || trimmedLine.toLowerCase().includes('urn')) {
        continue;
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
        yPosition += wrappedLines.length * 5 + 2;
      }
    }
    
    // Save the PDF
    doc.save('InsuraGuard-Claim-Form.pdf');
    
    // Clear sessionStorage and URL parameters
    sessionStorage.removeItem('pdfUrn');
    window.history.replaceState({}, document.title, window.location.pathname);
    
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    console.error('Error details:', error.message, error.stack);
    alert(`Failed to generate PDF: ${error.message}. Please try again.`);
  }
};
</script>
