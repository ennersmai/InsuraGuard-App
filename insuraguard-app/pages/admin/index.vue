<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-charcoal">Admin Dashboard</h1>
      <p class="mt-2 text-gray-600">Manage all registrations and system templates</p>
    </div>

    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by URN, name, or email..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber focus:border-amber"
      />
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber focus:border-amber"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="cancelled">Cancelled</option>
        <option value="expired">Expired</option>
      </select>
      <button @click="exportToCSV" class="btn-primary whitespace-nowrap">
        Export to CSV
      </button>
      <NuxtLink to="/admin/templates" class="btn-secondary whitespace-nowrap">
        Manage Templates
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading registrations...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th @click="sortBy('urn')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                URN
                <span v-if="sortField === 'urn'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('full_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Name
                <span v-if="sortField === 'full_name'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                System
              </th>
              <th @click="sortBy('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Date
                <span v-if="sortField === 'created_at'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="registration in filteredRegistrations" :key="registration.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber">
                {{ registration.urn }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                {{ registration.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ registration.email }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ registration.system_description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(registration.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
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
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <NuxtLink :to="`/admin/registration/${registration.id}`" class="text-amber hover:text-amber/90">
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredRegistrations.length === 0" class="text-center py-12">
        <p class="text-gray-500">No registrations found</p>
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

const supabase = useSupabaseClient();
const registrations = ref<Registration[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const statusFilter = ref('');
const sortField = ref<'urn' | 'full_name' | 'created_at'>('created_at');
const sortDirection = ref<'asc' | 'desc'>('desc');

const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

const fetchRegistrations = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    registrations.value = data || [];
  } catch (e: any) {
    error.value = e.message || 'Failed to load registrations';
  } finally {
    loading.value = false;
  }
};

const filteredRegistrations = computed(() => {
  let filtered = registrations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(reg => 
      reg.urn.toLowerCase().includes(query) ||
      reg.full_name.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter(reg => reg.status === statusFilter.value);
  }

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField.value];
    const bVal = b[sortField.value];
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return sorted;
});

const sortBy = (field: 'urn' | 'full_name' | 'created_at') => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const exportToCSV = () => {
  const headers = [
    'URN', 'Full Name', 'Email', 'Phone', 'Address',
    'System Description', 'System Cost', 'Commissioning Date',
    'Installer', 'Payment Status', 'Registration Date', 'Status'
  ];

  const rows = filteredRegistrations.value.map(reg => [
    reg.urn,
    reg.full_name,
    reg.email,
    reg.phone,
    reg.installation_address,
    reg.system_description,
    reg.system_cost,
    reg.commissioning_date,
    reg.installer_company,
    reg.payment_status,
    formatDate(reg.created_at),
    reg.status
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `insuraguard-registrations-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  fetchRegistrations();
});
</script>
