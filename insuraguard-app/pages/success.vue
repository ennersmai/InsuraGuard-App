<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white shadow sm:rounded-lg p-8 text-center">
        <!-- InsuraGuard Logo -->
        <div class="mb-6">
          <img 
            src="/InsuraGuard-logo-transparent-1200.png" 
            alt="InsuraGuard" 
            class="h-16 mx-auto"
          />
        </div>
        
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-semibold text-charcoal mb-6">Cover Generated!</h1>
        
        <p class="text-gray-600 mb-6">
          Your registration has been completed successfully. Your insurance cover is ready.
        </p>
        
        <!-- Mock payment indicator -->
        <div v-if="$route.query.session_id && $route.query.session_id.toString().startsWith('mock_')" 
             class="mb-6 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <span>Test mode completed - No actual payment processed</span>
          </div>
        </div>

        <!-- Certificate download section -->
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">Your insurance cover has been generated and sent to your email.</p>
          <button 
            @click="downloadCertificate" 
            :disabled="downloadLoading"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <span v-if="downloadLoading">Downloading...</span>
            <span v-else>📥 Download Cover</span>
          </button>
          <p v-if="downloadError" class="text-red-600 text-xs mt-2">{{ downloadError }}</p>
        </div>

        <div class="space-y-3">
          <NuxtLink to="/dashboard" class="block w-full btn-primary">
            View My Registrations
          </NuxtLink>
          <NuxtLink to="/" class="block w-full px-4 py-2 border border-gray-300 rounded text-charcoal hover:bg-gray-50">
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const downloadLoading = ref(false);
const downloadError = ref('');

const downloadCertificate = async () => {
  downloadLoading.value = true;
  downloadError.value = '';

  try {
    if (!user.value?.id) throw new Error('User not authenticated');

    // Extract registration ID from session_id query parameter
    const sessionId = route.query.session_id as string;
    let registrationId = '';
    
    if (sessionId && sessionId.startsWith('mock_')) {
      // Extract ID from mock_<uuid> format
      registrationId = sessionId.replace('mock_', '');
    } else {
      // For real Stripe sessions, get the most recent registration
      const { data: registrations, error: fetchError } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;
      if (!registrations || registrations.length === 0) throw new Error('No registration found');
      
      registrationId = (registrations[0] as any).id;
    }

    if (!registrationId) throw new Error('Registration ID not found');
    
    // Get signed URL for private bucket (expires in 1 hour)
    const pdfPath = `certificates/${registrationId}/certificate.pdf`;
    const { data, error: signError } = await supabase.storage
      .from('insuraguard-documents')
      .createSignedUrl(pdfPath, 3600);

    if (signError) throw signError;
    if (!data?.signedUrl) throw new Error('Failed to generate download link');

    // Open PDF in new tab
    window.open(data.signedUrl, '_blank');
  } catch (e: any) {
    downloadError.value = e.message || 'Failed to download cover';
  } finally {
    downloadLoading.value = false;
  }
};
</script>
