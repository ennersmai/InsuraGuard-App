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
          <h4 class="text-sm font-medium text-gray-900 mb-4">Documents</h4>
          <div v-if="registration.pdf_url" class="mb-4">
            <a 
              :href="registration.pdf_url" 
              target="_blank"
              class="inline-flex items-center gap-2 text-amber hover:text-amber/90"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Insurance Certificate
            </a>
          </div>
          <div v-else class="text-sm text-gray-500">
            Certificate will be available after payment confirmation
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

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const registration = ref<Registration | null>(null);
const loading = ref(true);
const error = ref('');

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const fetchRegistration = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', route.params.id)
      .eq('user_id', user.value?.id)
      .single();

    if (fetchError) throw fetchError;

    registration.value = data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load registration';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRegistration();
});
</script>
