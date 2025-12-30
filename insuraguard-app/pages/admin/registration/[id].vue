<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading registration...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="registration">
      <div class="mb-6 flex justify-between items-center">
        <NuxtLink to="/admin" class="text-amber hover:text-amber/90 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </NuxtLink>

        <button
          @click="showDeleteModal = true"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Registration
        </button>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
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
          </dl>
        </div>

        <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h4 class="text-sm font-medium text-gray-900 mb-4">Payment Information</h4>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Payment Status</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.payment_status }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Payment Amount</dt>
              <dd class="mt-1 text-sm text-charcoal">£{{ registration.payment_amount?.toFixed(2) || 'N/A' }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Stripe Payment ID</dt>
              <dd class="mt-1 text-sm text-charcoal">{{ registration.stripe_payment_id || 'N/A' }}</dd>
            </div>
          </dl>
        </div>

        <div class="px-4 py-5 sm:px-6">
          <h4 class="text-sm font-medium text-gray-900 mb-4">Documents</h4>
          <div v-if="registration.pdf_url" class="mb-4">
            <div class="flex gap-3">
              <button 
                @click="downloadCertificate"
                :disabled="downloadingCert"
                class="inline-flex items-center gap-2 text-amber hover:text-amber/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span v-if="downloadingCert">Downloading...</span>
                <span v-else>Download Certificate</span>
              </button>
              
              <button 
                @click="regenerateCertificate"
                :disabled="regenerating"
                class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span v-if="regenerating">Regenerating...</span>
                <span v-else>Regenerate Certificate</span>
              </button>
            </div>
            <p v-if="certDownloadError" class="text-red-600 text-xs mt-2">{{ certDownloadError }}</p>
          </div>
          
          <div v-if="registration.document_urls && registration.document_urls.length > 0">
            <p class="text-sm font-medium text-gray-500 mb-2">Proof of Purchase Documents:</p>
            <ul class="space-y-2">
              <li v-for="(url, index) in registration.document_urls" :key="index">
                <button 
                  @click="downloadDocument(url, index)"
                  :disabled="downloadingDoc === index"
                  class="text-sm text-amber hover:text-amber/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="downloadingDoc === index">Downloading...</span>
                  <span v-else>Document {{ index + 1 }}</span>
                </button>
              </li>
            </ul>
            <p v-if="downloadError" class="text-red-600 text-xs mt-2">{{ downloadError }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showDeleteModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">Delete Registration</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this registration? This action cannot be undone and will permanently remove all associated data including documents and certificates.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              <span v-if="deleting">Deleting...</span>
              <span v-else>Delete</span>
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
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
  middleware: 'admin'
});

const route = useRoute();
const supabase = useSupabaseClient();
const registration = ref<Registration | null>(null);
const loading = ref(true);
const error = ref('');
const showDeleteModal = ref(false);
const deleting = ref(false);
const downloadingDoc = ref<number | null>(null);
const downloadError = ref('');
const downloadingCert = ref(false);
const certDownloadError = ref('');
const regenerating = ref(false);

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const fetchRegistration = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', route.params.id)
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
  downloadingCert.value = true;
  certDownloadError.value = '';

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
    certDownloadError.value = e.message || 'Failed to download certificate';
  } finally {
    downloadingCert.value = false;
  }
};

const downloadDocument = async (publicUrl: string, index: number) => {
  downloadingDoc.value = index;
  downloadError.value = '';

  try {
    // Extract the file path from the public URL
    // URL format: https://.../storage/v1/object/public/bucket/path
    const urlParts = publicUrl.split('/storage/v1/object/public/');
    if (urlParts.length < 2) throw new Error('Invalid document URL');
    
    const [bucket, ...pathParts] = urlParts[1].split('/');
    const filePath = pathParts.join('/');

    // Get signed URL for private bucket (expires in 1 hour)
    const { data, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600);

    if (signError) throw signError;
    if (!data?.signedUrl) throw new Error('Failed to generate download link');

    // Open PDF in new tab
    window.open(data.signedUrl, '_blank');
  } catch (e: any) {
    downloadError.value = e.message || 'Failed to download document';
  } finally {
    downloadingDoc.value = null;
  }
};

const regenerateCertificate = async () => {
  regenerating.value = true;
  certDownloadError.value = '';

  try {
    if (!registration.value?.id) throw new Error('Registration not found');

    // Call the Edge Function to regenerate certificate
    const { error: certError } = await supabase.functions.invoke('generate-certificate', {
      body: { registrationId: registration.value.id }
    });

    if (certError) throw certError;

    // Refresh registration data to get updated certificate info
    await fetchRegistration();
    
    certDownloadError.value = '';
    alert('Certificate regenerated successfully!');
  } catch (e: any) {
    certDownloadError.value = e.message || 'Failed to regenerate certificate';
  } finally {
    regenerating.value = false;
  }
};

const handleDelete = async () => {
  deleting.value = true;
  
  try {
    const { error: deleteError } = await supabase
      .from('registrations')
      .delete()
      .eq('id', route.params.id);

    if (deleteError) throw deleteError;

    navigateTo('/admin');
  } catch (e: any) {
    error.value = e.message || 'Failed to delete registration';
    showDeleteModal.value = false;
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchRegistration();
});
</script>
