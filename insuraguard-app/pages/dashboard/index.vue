<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-charcoal">My Registrations</h1>
      <p class="mt-2 text-gray-600">View and manage your insurance registrations</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading your registrations...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="registrations.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No registrations</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by registering your clean energy system.</p>
      <div class="mt-6">
        <NuxtLink to="/register" class="btn-primary inline-block">
          Register System
        </NuxtLink>
      </div>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="registration in registrations" :key="registration.id">
          <NuxtLink :to="`/dashboard/${registration.id}`" class="block hover:bg-gray-50 transition-colors">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-amber truncate">
                    {{ registration.urn }}
                  </p>
                  <p class="mt-1 text-sm text-charcoal">
                    {{ registration.system_description }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Registered: {{ formatDate(registration.created_at) }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0">
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
                </div>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Registration } from '~/types';
import { format } from 'date-fns';

definePageMeta({
  middleware: 'auth'
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const registrations = ref<Registration[]>([]);
const loading = ref(true);
const error = ref('');

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const fetchRegistrations = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', user.value?.id)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    registrations.value = data || [];
  } catch (e: any) {
    error.value = e.message || 'Failed to load registrations';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRegistrations();
});
</script>
