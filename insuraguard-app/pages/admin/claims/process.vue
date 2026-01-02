<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />
    
    <div class="container-narrow section-padding">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-semibold text-charcoal mb-2">Process Email Claim</h1>
        <p class="text-gray-600 mb-8">Update claim details for PDF claims submitted via email to support@insuraguard.co.uk</p>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
          <p class="font-medium">{{ success }}</p>
          <p v-if="generatedClaimId" class="mt-2">Claim ID: <strong>{{ generatedClaimId }}</strong></p>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          {{ error }}
        </div>

        <form @submit.prevent="processEmailClaim" class="space-y-6">
          <!-- Customer Details -->
          <div class="border-b pb-6">
            <h2 class="text-xl font-semibold text-charcoal mb-4">Customer Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Claim ID *</label>
                <input v-model="form.claim_id" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter claim ID from PDF" @blur="searchClaim">
                <p class="text-xs text-gray-500 mt-1">The claim ID provided to the customer when they downloaded the PDF</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">URN *</label>
                <input v-model="form.urn" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="URN-20260102-XXXX" readonly>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input v-model="form.full_name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input v-model="form.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input v-model="form.phone" type="tel" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Installation Address</label>
                <input v-model="form.installation_address" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                <input v-model="form.postcode" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
            </div>
          </div>

          <!-- System Details -->
          <div class="border-b pb-6">
            <h2 class="text-xl font-semibold text-charcoal mb-4">System Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">System Type *</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input v-model="form.system_type_solar_pv" type="checkbox" class="mr-2">
                    <span>Solar PV System</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.system_type_battery" type="checkbox" class="mr-2">
                    <span>Battery Storage System</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.system_type_solar_thermal" type="checkbox" class="mr-2">
                    <span>Solar Thermal</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Other System Type</label>
                <input v-model="form.system_type_other" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Installation Date</label>
                <input v-model="form.installation_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">System Size/Capacity</label>
                <input v-model="form.system_size" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 4kW">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Inverter Serial Number</label>
                <input v-model="form.inverter_serial" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Battery Serial Number</label>
                <input v-model="form.battery_serial" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
            </div>
          </div>

          <!-- Claim Details -->
          <div class="border-b pb-6">
            <h2 class="text-xl font-semibold text-charcoal mb-4">Claim Details</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nature of Issue *</label>
                <textarea v-model="form.nature_of_issue" required rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date Issue First Noticed</label>
                  <input v-model="form.issue_first_noticed" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current System Status</label>
                  <select v-model="form.system_status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select status</option>
                    <option value="Not operational">Not operational</option>
                    <option value="Partially operational">Partially operational</option>
                    <option value="Fully operational">Fully operational</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Installer Information -->
          <div class="border-b pb-6">
            <h2 class="text-xl font-semibold text-charcoal mb-4">Installer Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Installer Company</label>
                <input v-model="form.installer_company" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Installer Contact</label>
                <input v-model="form.installer_contact" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Has Installer Ceased Trading?</label>
                <select v-model="form.installer_ceased_trading" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date Installer Contacted</label>
                <input v-model="form.installer_contacted_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              </div>
            </div>
          </div>

          <!-- Payment Status -->
          <div class="border-b pb-6">
            <h2 class="text-xl font-semibold text-charcoal mb-4">Payment Status</h2>
            <div class="space-y-4">
              <label class="flex items-center">
                <input v-model="form.excess_fee_paid" type="checkbox" class="mr-2">
                <span class="font-medium">Excess fee (£29.95) has been paid</span>
              </label>
              <div v-if="form.excess_fee_paid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
                  <input v-model="form.excess_fee_payment_reference" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Bank transfer ref">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                  <input v-model="form.excess_fee_paid_at" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button type="submit" :disabled="loading" class="btn-primary">
              <span v-if="loading">Processing...</span>
              <span v-else>Create Claim & Send Confirmation</span>
            </button>
            <button type="button" @click="resetForm" class="btn-secondary">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const supabase = useSupabaseClient()
const loading = ref(false)
const error = ref('')
const success = ref('')
const generatedClaimId = ref('')

const form = ref({
  claim_id: '',
  urn: '',
  full_name: '',
  email: '',
  phone: '',
  installation_address: '',
  postcode: '',
  system_type_solar_pv: false,
  system_type_battery: false,
  system_type_solar_thermal: false,
  system_type_other: '',
  installation_date: '',
  system_size: '',
  inverter_serial: '',
  battery_serial: '',
  nature_of_issue: '',
  issue_first_noticed: '',
  system_status: '',
  installer_company: '',
  installer_contact: '',
  installer_ceased_trading: '',
  installer_contacted_date: '',
  excess_fee_paid: false,
  excess_fee_payment_reference: '',
  excess_fee_paid_at: ''
})

const searchClaim = async () => {
  if (!form.value.claim_id) return
  
  try {
    const { data: existingClaim, error: searchError } = await supabase
      .from('claims')
      .select('*')
      .eq('claim_reference', form.value.claim_id)
      .single()

    if (searchError || !existingClaim) {
      error.value = 'Claim not found. Please verify the claim ID.'
      return
    }

    // Pre-fill form with existing data
    form.value.urn = existingClaim.urn || ''
    form.value.full_name = existingClaim.full_name || ''
    form.value.email = existingClaim.email || ''
    form.value.phone = existingClaim.phone || ''
    
    success.value = `Found existing claim for URN ${existingClaim.urn}. Update the details below.`
  } catch (e: any) {
    error.value = 'Failed to search for claim: ' + e.message
  }
}

const processEmailClaim = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  generatedClaimId.value = ''

  try {
    // Check if claim exists
    const { data: existingClaim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('claim_reference', form.value.claim_id)
      .single()

    if (claimError || !existingClaim) {
      throw new Error('Claim not found. Please verify the claim ID.')
    }

    // Update existing claim with PDF details
    const claimData: any = {
      urn: form.value.urn,
      full_name: form.value.full_name,
      email: form.value.email,
      phone: form.value.phone,
      installation_address: form.value.installation_address || null,
      postcode: form.value.postcode || null,
      system_type_solar_pv: form.value.system_type_solar_pv,
      system_type_battery: form.value.system_type_battery,
      system_type_solar_thermal: form.value.system_type_solar_thermal,
      system_type_other: form.value.system_type_other || null,
      installation_date: form.value.installation_date || null,
      system_size: form.value.system_size || null,
      inverter_serial: form.value.inverter_serial || null,
      battery_serial: form.value.battery_serial || null,
      nature_of_issue: form.value.nature_of_issue,
      issue_first_noticed: form.value.issue_first_noticed || null,
      system_status: form.value.system_status || null,
      installer_company: form.value.installer_company || null,
      installer_contact: form.value.installer_contact || null,
      installer_ceased_trading: form.value.installer_ceased_trading || null,
      installer_contacted_date: form.value.installer_contacted_date || null,
      status: 'pending',
      excess_fee_paid: form.value.excess_fee_paid,
      excess_fee_payment_reference: form.value.excess_fee_payment_reference || null,
      excess_fee_paid_at: form.value.excess_fee_paid_at || null
    }

    const { data: updatedClaim, error: updateError } = await supabase
      .from('claims')
      .update(claimData)
      .eq('claim_reference', form.value.claim_id)
      .select()
      .single()

    if (updateError || !updatedClaim) throw new Error('Failed to update claim')

    generatedClaimId.value = form.value.claim_id

    // Send confirmation email to customer
    const { error: emailError } = await supabase.functions.invoke('send-claim-confirmation', {
      body: {
        claimId: generatedClaimId.value,
        customerName: form.value.full_name,
        customerEmail: form.value.email,
        urn: form.value.urn,
        claimDescription: form.value.nature_of_issue,
        paymentAmount: 2995
      }
    })

    if (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      success.value = `Claim created successfully (${generatedClaimId.value}), but failed to send confirmation email.`
    } else {
      success.value = `Claim ${generatedClaimId.value} updated successfully and confirmation email sent to ${form.value.email}`
    }

    // Reset form
    resetForm()

  } catch (e: any) {
    error.value = e.message || 'Failed to process claim'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    urn: '',
    full_name: '',
    email: '',
    phone: '',
    installation_address: '',
    postcode: '',
    system_type_solar_pv: false,
    system_type_battery: false,
    system_type_solar_thermal: false,
    system_type_other: '',
    installation_date: '',
    system_size: '',
    inverter_serial: '',
    battery_serial: '',
    nature_of_issue: '',
    issue_first_noticed: '',
    system_status: '',
    installer_company: '',
    installer_contact: '',
    installer_ceased_trading: '',
    installer_contacted_date: '',
    excess_fee_paid: false,
    excess_fee_payment_reference: '',
    excess_fee_paid_at: ''
  }
}
</script>
