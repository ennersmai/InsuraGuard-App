<template>
  <div>
    <section class="section-padding bg-white">
      <div class="container-narrow text-center">
        <div class="mb-8">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-semibold text-charcoal mb-6">Transfer Cancelled</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The ownership transfer payment was cancelled. No charges have been made.
          </p>
        </div>

        <div class="card text-left max-w-lg mx-auto mb-8">
          <h2 class="text-xl font-semibold text-charcoal mb-4">What happens now?</h2>
          <ul class="space-y-3 text-gray-600">
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>The transfer request has been cancelled and no ownership change has occurred.</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Your current registration remains unchanged and active.</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>You can start a new transfer request at any time.</span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/transfer" class="btn-primary px-8 py-3">
            Try Again
          </NuxtLink>
          <NuxtLink to="/" class="bg-gray-100 text-charcoal px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Return Home
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Transfer Cancelled - InsuraGuard',
  description: 'Your InsuraGuard ownership transfer has been cancelled.',
})

const route = useRoute()
const supabase = useSupabaseClient()

onMounted(async () => {
  const transferId = route.query.transfer_id as string
  
  if (transferId) {
    // Update transfer status to cancelled
    await supabase
      .from('ownership_transfers')
      .update({ status: 'cancelled' })
      .eq('id', transferId)
      .eq('status', 'pending_payment')
  }
})
</script>
