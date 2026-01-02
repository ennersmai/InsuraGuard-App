<template>
  <div>
    <section class="section-padding bg-white">
      <div class="container-narrow text-center">
        <div class="mb-8">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-semibold text-charcoal mb-6">Transfer Complete!</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The ownership transfer has been successfully completed. The new owner will receive a confirmation email shortly.
          </p>
        </div>

        <div v-if="loading" class="text-gray-600">
          Loading transfer details...
        </div>

        <div v-else-if="transfer" class="card text-left max-w-lg mx-auto">
          <h2 class="text-xl font-semibold text-charcoal mb-4">Transfer Details</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Registration URN:</span>
              <span class="font-medium">{{ transfer.registration?.urn }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Previous Owner:</span>
              <span class="font-medium">{{ transfer.previous_owner_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">New Owner:</span>
              <span class="font-medium">{{ transfer.new_owner_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Admin Fee Paid:</span>
              <span class="font-medium">£{{ transfer.payment_amount?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Transfer Date:</span>
              <span class="font-medium">{{ formatDate(transfer.completed_at) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <NuxtLink to="/" class="btn-primary px-8 py-3 inline-block">
            Return Home
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Transfer Complete - InsuraGuard',
  description: 'Your InsuraGuard ownership transfer has been completed successfully.',
})

const route = useRoute()
const supabase = useSupabaseClient()

const loading = ref(true)
const transfer = ref<any>(null)

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  const sessionId = route.query.session_id as string
  
  if (sessionId) {
    try {
      const { data, error } = await supabase
        .from('ownership_transfers')
        .select('*, registration:registrations(urn)')
        .eq('stripe_session_id', sessionId)
        .single()

      if (!error && data) {
        transfer.value = data
      }
    } catch (err) {
      console.error('Error fetching transfer:', err)
    }
  }
  
  loading.value = false
})
</script>
