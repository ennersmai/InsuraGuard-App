<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading registration details...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="registration">
      <div class="mb-6">
        <NuxtLink to="/dashboard" class="text-amber hover:text-amber/90 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </NuxtLink>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-charcoal">
            Registration Details
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            URN: <span class="font-medium text-amber">{{ registration.urn }}</span>
          </p>
        </div>
        
        <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Full Name</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.full_name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Phone</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.phone }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': registration.status === 'active',
                    'bg-gray-100 text-gray-800': registration.status === 'cancelled',
                    'bg-red-100 text-red-800': registration.status === 'expired'
                  }"
                >
                  {{ registration.status }}
                </span>
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Installation Address</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.installation_address }}</dd>
            </div>
          </dl>
        </div>

        <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h4 class="text-sm font-medium text-gray-900 mb-4">System Information</h4>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">System Description</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.system_description }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">System Cost</dt>
              <dd class="mt-1 text-sm text-charcoal">£{{ registration.system_cost.toLocaleString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Commissioning Date</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ formatDate(registration.commissioning_date) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Installer Company</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.installer_company }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Inverter Serial</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.inverter_serial || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Battery Serial</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.battery_serial || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Registration Date</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ formatDate(registration.created_at) }}</dd>
            </div>
          </dl>
        </div>

        <div class="px-4 py-5 sm:px-6">
          <h4 class="text-sm font-medium text-gray-900 mb-4">Actions</h4>
          
          <!-- Ownership Transfer Button -->
          <div class="mb-4">
            <button
              @click="showTransferModal = true"
              :disabled="transferLoading"
              class="inline-flex items-center gap-2 bg-amber hover:bg-amber/90 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l-4-4" />
              </svg>
              <span v-if="transferLoading">Processing...</span>
              <span v-else>Transfer Ownership</span>
            </button>
            <p class="text-xs text-gray-500 mt-2">Transfer this system to a new owner (£49.95 admin fee)</p>
          </div>
        </div>

        <div class="px-4 py-5 sm:px-6">
          <h4 class="text-sm font-medium text-gray-900 mb-4">Documents</h4>
          <div v-if="registration.pdf_url" class="mb-4">
            <button
              @click="downloadCertificate"
              :disabled="downloadLoading"
              class="inline-flex items-center gap-2 text-amber hover:text-amber/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span v-if="downloadLoading">Downloading...</span>
              <span v-else>Download Insurance Certificate</span>
            </button>
            <p v-if="downloadError" class="text-red-600 text-xs mt-2">{{ downloadError }}</p>
          </div>
          <div v-else class="text-sm text-gray-500">
            Certificate will be available after payment confirmation
          </div>
        </div>
      </div>
    </div>

    <!-- Ownership Transfer Modal -->
    <div v-if="showTransferModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-4 max-w-md">
        <div class="bg-white rounded-lg shadow-xl">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Transfer Ownership</h3>
            <p class="text-sm text-gray-500 mt-1">Transfer this system to a new owner</p>
          </div>
          
          <form @submit.prevent="handleOwnershipTransfer" class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Owner Name *</label>
              <input
                v-model="transferForm.newOwnerName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber focus:border-amber"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Owner Email *</label>
              <input
                v-model="transferForm.newOwnerEmail"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber focus:border-amber"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Owner Phone</label>
              <input
                v-model="transferForm.newOwnerPhone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber focus:border-amber"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Installation Address</label>
              <textarea
                v-model="transferForm.newOwnerAddress"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber focus:border-amber"
              ></textarea>
            </div>
            
            <div class="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p class="text-sm text-amber-800">
                <strong>Admin Fee:</strong> £49.95<br>
                This fee covers the ownership transfer administration costs.
              </p>
            </div>
          </form>
          
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              @click="showTransferModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              @click="handleOwnershipTransfer"
              :disabled="transferLoading"
              class="px-4 py-2 bg-amber hover:bg-amber/90 text-white rounded-md disabled:opacity-50"
            >
              <span v-if="transferLoading">Processing...</span>
              <span v-else>Pay & Transfer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Registration } from '~/types';
import { format } from 'date-fns';

definePageMeta({
  middleware: 'auth'
});

const user = useSupabaseUser();
const route = useRoute();
const supabase = useSupabaseClient();

const loading = ref(false);
const error = ref('');
const registration = ref<Registration | null>(null);
const downloadLoading = ref(false);
const downloadError = ref('');

// Ownership transfer state
const showTransferModal = ref(false);
const transferLoading = ref(false);
const transferForm = ref({
  newOwnerName: '',
  newOwnerEmail: '',
  newOwnerPhone: '',
  newOwnerAddress: ''
});

const { createOwnershipCheckout } = useStripeFees();

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const handleOwnershipTransfer = async () => {
  if (!registration.value?.id) return;
  
  transferLoading.value = true;
  
  try {
    const result = await createOwnershipCheckout({
      registrationId: registration.value.id,
      newOwnerEmail: transferForm.value.newOwnerEmail,
      newOwnerName: transferForm.value.newOwnerName,
      newOwnerPhone: transferForm.value.newOwnerPhone,
      newOwnerAddress: transferForm.value.newOwnerAddress
    });
    
    if (result.error) {
      alert(`Transfer failed: ${result.error}`);
      return;
    }
    
    if (result.sessionUrl) {
      window.location.href = result.sessionUrl;
    }
  } catch (error: any) {
    alert(`Transfer failed: ${error.message}`);
  } finally {
    transferLoading.value = false;
  }
};

const fetchRegistration = async () => {
  try {
    if (!user.value?.id) throw new Error('User not authenticated');

    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', route.params.id)
      .eq('user_id', user.value.id)
      .single();

    if (fetchError) throw fetchError;

    registration.value = data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load registration';
  } finally {
    loading.value = false;
  }
};

const downloadCertificate = async () => {
  downloadLoading.value = true;
  downloadError.value = '';

  try {
    if (!registration.value?.pdf_url) throw new Error('Certificate not available');

    // Get signed URL for private bucket (expires in 1 hour)
    const { data, error: signError } = await supabase.storage
      .from('insuraguard-documents')
      .createSignedUrl(registration.value.pdf_url, 3600);

    if (signError) throw signError;
    if (!data?.signedUrl) throw new Error('Failed to generate download link');

    // Open PDF in new tab
    window.open(data.signedUrl, '_blank');
  } catch (e: any) {
    downloadError.value = e.message || 'Failed to download certificate';
  } finally {
    downloadLoading.value = false;
  }
};

onMounted(() => {
  fetchRegistration();
});
</script>
