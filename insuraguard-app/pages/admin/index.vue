<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-charcoal">Admin Dashboard</h1>
      <p class="mt-2 text-gray-600">Manage all registrations and system templates</p>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-amber rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Registrations</dt>
                <dd class="text-lg font-medium text-charcoal">{{ metrics.totalRegistrations }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Policies</dt>
                <dd class="text-lg font-medium text-charcoal">{{ metrics.activeRegistrations }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd class="text-lg font-medium text-charcoal">£{{ metrics.totalRevenue.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">This Month</dt>
                <dd class="text-lg font-medium text-charcoal">{{ metrics.thisMonthRegistrations }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
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

// Metrics
const metrics = ref({
  totalRegistrations: 0,
  activeRegistrations: 0,
  totalRevenue: 0,
  thisMonthRegistrations: 0
});

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
    
    // Calculate metrics
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    metrics.value = {
      totalRegistrations: registrations.value.length,
      activeRegistrations: registrations.value.filter(r => r.status === 'active').length,
      totalRevenue: registrations.value.reduce((sum, r) => sum + (r.payment_amount || 0), 0),
      thisMonthRegistrations: registrations.value.filter(r => {
        const regDate = new Date(r.created_at);
        return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
      }).length
    };
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
