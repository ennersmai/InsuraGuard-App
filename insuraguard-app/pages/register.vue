<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-charcoal">Register Your System</h1>
      <p class="mt-2 text-gray-600">Complete the form below to register your clean energy system</p>
    </div>

    <!-- Pricing Tier Selection -->
    <div class="mb-6">
      <div v-if="selectedTierKey" class="bg-amber/10 border-2 border-amber rounded-lg px-6 py-4 mb-4">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-charcoal">{{ pricingTiers[selectedTierKey].name }} Selected</h3>
            <p class="text-sm text-gray-700 mt-1">
              <span class="font-semibold text-amber">{{ pricingTiers[selectedTierKey].price }}</span> for {{ pricingTiers[selectedTierKey].coverage }}
            </p>
          </div>
          <button
            type="button"
            @click="selectedTierKey = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div v-else class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-charcoal mb-4">Select Your Pricing Tier</h3>
        <p class="text-sm text-gray-600 mb-4">Choose the pricing tier based on your system's age at registration</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            v-for="(tier, key) in pricingTiers"
            :key="key"
            type="button"
            @click="selectTier(key)"
            class="p-4 border-2 rounded-lg text-left hover:border-amber hover:bg-amber/5 transition-all"
            :class="key === '0-12' ? 'border-amber bg-amber/5' : 'border-gray-200'"
          >
            <div v-if="key === '0-12'" class="text-xs font-bold text-amber mb-2">BEST VALUE</div>
            <div class="text-sm font-semibold text-charcoal mb-1">{{ tier.name }}</div>
            <div class="text-2xl font-bold text-amber mb-1">{{ tier.price }}</div>
            <div class="text-xs text-gray-600">{{ tier.coverage }}</div>
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-charcoal mb-4">Customer Information</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="full_name" class="block text-sm font-medium text-charcoal">
                Full Name *
              </label>
              <input
                id="full_name"
                v-model="formData.full_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-charcoal">
                Email Address *
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-charcoal">
                Phone Number *
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>

            <div class="sm:col-span-2">
              <label for="installation_address" class="block text-sm font-medium text-charcoal">
                Installation Address *
              </label>
              <textarea
                id="installation_address"
                v-model="formData.installation_address"
                rows="3"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-charcoal mb-4">System Information</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="system_description" class="block text-sm font-medium text-charcoal">
                System Description *
              </label>
              <input
                id="system_description"
                v-model="formData.system_description"
                type="text"
                required
                placeholder="e.g., 5kW Solar PV + 10kWh Battery Storage"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>

            <div>
              <label for="system_cost" class="block text-sm font-medium text-charcoal">
                System Cost (£) *
              </label>
              <input
                id="system_cost"
                v-model.number="formData.system_cost"
                type="number"
                required
                min="1"
                step="0.01"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>

            <div>
              <label for="commissioning_date" class="block text-sm font-medium text-charcoal">
                Commissioning Date *
              </label>
              <input
                id="commissioning_date"
                v-model="formData.commissioning_date"
                type="date"
                required
                :max="today"
                @change="clearError"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-charcoal mb-4">Installer Information</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="installer_company" class="block text-sm font-medium text-charcoal">
                Installer Company Name *
              </label>
              <input
                id="installer_company"
                v-model="formData.installer_company"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>

            <div>
              <label for="inverter_serial" class="block text-sm font-medium text-charcoal">
                Inverter Serial Number
              </label>
              <input
                id="inverter_serial"
                v-model="formData.inverter_serial"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>

            <div>
              <label for="battery_serial" class="block text-sm font-medium text-charcoal">
                Battery Serial Number
              </label>
              <input
                id="battery_serial"
                v-model="formData.battery_serial"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-charcoal mb-4">Proof of Purchase</h3>
          <div>
            <label class="block text-sm font-medium text-charcoal mb-2">
              Upload Documents * (PDF, JPG, PNG - Max 10MB per file, up to 5 files)
            </label>
            <input
              type="file"
              @change="handleFileChange"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-amber file:text-white hover:file:bg-amber/90"
            />
            <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
              <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <span class="text-sm text-charcoal">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                <button type="button" @click="removeFile(index)" class="text-red-600 hover:text-red-800">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <NuxtLink to="/dashboard" class="px-6 py-3 border border-gray-300 rounded-md text-charcoal hover:bg-gray-50">
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading || selectedFiles.length === 0"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Proceed to Payment</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

useSeoMeta({
  title: 'Register Your System - InsuraGuard',
  description: 'Register your clean energy system for insurance-backed protection. Quick and easy registration process.',
  robots: 'noindex, nofollow'
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const config = useRuntimeConfig();
const route = useRoute();

const pricingTiers: Record<string, { name: string; price: string; coverage: string }> = {
  '0-12': { name: 'Under 12 Months', price: '£99.99', coverage: '10 years coverage' },
  '12-24': { name: '1-2 Years Old', price: '£199.99', coverage: '8-9 years coverage' },
  '24-36': { name: '2-3 Years Old', price: '£289.00', coverage: '7-8 years coverage' },
  '36-48': { name: '3-4 Years Old', price: '£499.99', coverage: '6-7 years coverage' }
};

const selectedTierKey = ref<string | null>((route.query.age as string) || null);

const selectTier = (key: string) => {
  // Validate tier selection against commissioning date if date is provided
  if (formData.value.commissioning_date) {
    const commissioningDate = new Date(formData.value.commissioning_date);
    const now = new Date();
    
    // Calculate months difference properly
    let yearsDiff = now.getFullYear() - commissioningDate.getFullYear();
    let monthsDiff = now.getMonth() - commissioningDate.getMonth();
    let diffMonths = yearsDiff * 12 + monthsDiff;
    
    // Adjust for day of month - only if we're in a partial month
    if (now.getDate() < commissioningDate.getDate() && monthsDiff >= 0) {
      diffMonths--;
    }
    
    // Check if date is in the future
    if (diffMonths < 0) {
      error.value = 'Commissioning date cannot be in the future.';
      return;
    }
    
    // Check if selected tier matches system age
    if (key === '0-12' && diffMonths > 12) {
      error.value = 'Your system is older than 12 months. Please select the appropriate tier for your system age.';
      return;
    }
    if (key === '12-24' && (diffMonths < 12 || diffMonths > 24)) {
      error.value = 'This tier is only for systems aged 12-24 months. Please select the appropriate tier.';
      return;
    }
    if (key === '24-36' && (diffMonths < 24 || diffMonths > 36)) {
      error.value = 'This tier is only for systems aged 24-36 months. Please select the appropriate tier.';
      return;
    }
    if (key === '36-48' && (diffMonths < 36 || diffMonths > 48)) {
      error.value = 'This tier is only for systems aged 36-48 months. Please select the appropriate tier.';
      return;
    }
    if (diffMonths > 48) {
      error.value = 'Systems older than 48 months (4 years) are not eligible for registration.';
      return;
    }
  }
  
  selectedTierKey.value = key;
  error.value = '';
};

const formData = ref({
  full_name: '',
  email: user.value?.email || '',
  phone: '',
  installation_address: '',
  system_description: '',
  system_cost: 0,
  commissioning_date: '',
  installer_company: '',
  inverter_serial: '',
  battery_serial: '',
});

const selectedFiles = ref<File[]>([]);
const loading = ref(false);
const error = ref('');

const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    
    if (files.length + selectedFiles.value.length > 5) {
      error.value = 'Maximum 5 files allowed';
      return;
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        error.value = `File ${file.name} is too large. Maximum 10MB per file.`;
        return;
      }
    }

    selectedFiles.value = [...selectedFiles.value, ...files];
    error.value = '';
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const clearError = () => {
  error.value = '';
};

const scrollToError = () => {
  setTimeout(() => {
    const errorElement = document.querySelector('[role="alert"]') || document.querySelector('.bg-red-50');
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    if (!selectedTierKey.value) {
      error.value = 'Please select a pricing tier before proceeding';
      loading.value = false;
      scrollToError();
      return;
    }
    
    // Final validation: Check tier matches commissioning date
    if (formData.value.commissioning_date) {
      const commissioningDate = new Date(formData.value.commissioning_date);
      const now = new Date();
      
      // Calculate months difference properly
      let yearsDiff = now.getFullYear() - commissioningDate.getFullYear();
      let monthsDiff = now.getMonth() - commissioningDate.getMonth();
      let diffMonths = yearsDiff * 12 + monthsDiff;
      
      // Adjust for day of month - only if we're in a partial month
      if (now.getDate() < commissioningDate.getDate() && monthsDiff >= 0) {
        diffMonths--;
      }
      
      // Check if date is in the future
      if (diffMonths < 0) {
        error.value = 'Commissioning date cannot be in the future.';
        loading.value = false;
        scrollToError();
        return;
      }
      
      const tierRanges: Record<string, { min: number; max: number }> = {
        '0-12': { min: 0, max: 12 },
        '12-24': { min: 12, max: 24 },
        '24-36': { min: 24, max: 36 },
        '36-48': { min: 36, max: 48 }
      };
      
      const range = tierRanges[selectedTierKey.value];
      const years = Math.floor(diffMonths / 12);
      const months = diffMonths % 12;
      
      if (diffMonths < range.min || diffMonths > range.max) {
        error.value = `Your system age (${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}) does not match the selected pricing tier. Please select the correct tier for your system age.`;
        loading.value = false;
        scrollToError();
        return;
      }
      
      if (diffMonths > 48) {
        error.value = 'Systems older than 48 months (4 years) are not eligible for registration.';
        loading.value = false;
        scrollToError();
        return;
      }
    }
    
    error.value = '';
    
    if (selectedFiles.value.length === 0) {
      error.value = 'Please upload at least one proof of purchase document';
      loading.value = false;
      scrollToError();
      return;
    }

    if (!formData.value.full_name || !formData.value.email || !formData.value.phone) {
      error.value = 'Please fill in all required fields';
      loading.value = false;
      scrollToError();
      return;
    }

    const registrationId = crypto.randomUUID();
    
    // Generate unique URN (format: URN-YYYYMMDD-XXXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const urn = `URN-${dateStr}-${randomPart}`;
    
    const documentUrls: string[] = [];

    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${registrationId}_${i}.${fileExt}`;
      const filePath = `proof-of-purchase/${user.value?.id}/${registrationId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('insuraguard-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('insuraguard-documents')
        .getPublicUrl(filePath);

      documentUrls.push(publicUrl);
    }

    const { error: insertError } = await supabase
      .from('registrations')
      .insert({
        id: registrationId,
        user_id: user.value?.id,
        urn: urn,
        full_name: formData.value.full_name,
        email: formData.value.email,
        phone: formData.value.phone,
        installation_address: formData.value.installation_address,
        system_description: formData.value.system_description,
        system_cost: formData.value.system_cost,
        commissioning_date: formData.value.commissioning_date,
        installer_company: formData.value.installer_company,
        inverter_serial: formData.value.inverter_serial || null,
        battery_serial: formData.value.battery_serial || null,
        document_urls: documentUrls,
        payment_status: 'pending',
        pricing_tier: selectedTierKey.value,
      });

    if (insertError) throw insertError;

    navigateTo(`/checkout/${registrationId}`);
  } catch (e: any) {
    error.value = e.message || 'Failed to submit registration';
  } finally {
    loading.value = false;
  }
};
</script>
