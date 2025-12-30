<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-semibold text-charcoal">Template Editor</h1>
          <p class="mt-2 text-gray-600">Manage system templates for PDF certificates, forms, and underwriter information</p>
        </div>
        <NuxtLink to="/admin" class="text-amber hover:text-amber/90">
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading templates...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
      {{ error }}
    </div>

    <div v-if="success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
      {{ success }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-1">
        <div class="bg-white shadow sm:rounded-lg p-4">
          <h3 class="text-sm font-medium text-charcoal mb-4">Templates</h3>
          <nav class="space-y-2">
            <button
              v-for="type in templateTypes"
              :key="type.id"
              @click="selectedTemplate = type.id"
              :class="[
                'w-full text-left px-3 py-2 rounded text-sm',
                selectedTemplate === type.id
                  ? 'bg-amber text-white'
                  : 'text-charcoal hover:bg-gray-100'
              ]"
            >
              {{ type.label }}
            </button>
          </nav>
        </div>

        <div class="bg-white shadow sm:rounded-lg p-4 mt-6">
          <h3 class="text-sm font-medium text-charcoal mb-2">Available Variables</h3>
          <p class="text-xs text-gray-500 mb-3">Use these in your templates:</p>
          <ul class="space-y-1 text-xs text-gray-600">
            <li><code class="bg-gray-100 px-1 rounded">{'{full_name}'}</code></li>
            <li><code class="bg-gray-100 px-1 rounded">{'{email}'}</code></li>
            <li><code class="bg-gray-100 px-1 rounded">{'{urn}'}</code></li>
            <li><code class="bg-gray-100 px-1 rounded">{'{system_description}'}</code></li>
            <li><code class="bg-gray-100 px-1 rounded">{'{system_cost}'}</code></li>
            <li><code class="bg-gray-100 px-1 rounded">{'{commissioning_date}'}</code></li>
            <li><code class="bg-gray-100 px-1 rounded">{'{installer_company}'}</code></li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-3">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-charcoal mb-4">
              {{ currentTemplateLabel }}
            </h3>

            <div class="mb-4">
              <label class="block text-sm font-medium text-charcoal mb-2">
                Template Content
              </label>
              <textarea
                v-model="currentContent"
                rows="20"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber focus:border-amber sm:text-sm font-mono"
                :placeholder="getPlaceholder(selectedTemplate)"
              ></textarea>
            </div>

            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-500">
                Last updated: {{ lastUpdated }}
              </p>
              <div class="space-x-3">
                <button
                  @click="resetTemplate"
                  class="px-4 py-2 border border-gray-300 rounded-md text-charcoal hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  @click="saveTemplate"
                  :disabled="saving"
                  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="saving">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminTemplate } from '~/types';

definePageMeta({
  middleware: 'admin'
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const templateTypes = [
  { id: 'certificate_template', label: 'Certificate Template' },
  { id: 'pdf_legal_text', label: 'PDF Legal Text' },
  { id: 'claim_form', label: 'Claim Form' },
  { id: 'dsar_form', label: 'DSAR Form' },
  { id: 'underwriter_info', label: 'Underwriter Information' }
];

const templates = ref<AdminTemplate[]>([]);
const selectedTemplate = ref<string>('pdf_legal_text');
const currentContent = ref('');
const originalContent = ref('');
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const success = ref('');

const currentTemplateLabel = computed(() => {
  return templateTypes.find(t => t.id === selectedTemplate.value)?.label || '';
});

const lastUpdated = computed(() => {
  const template = templates.value.find(t => t.template_type === selectedTemplate.value);
  if (!template) return 'Never';
  return new Date(template.updated_at).toLocaleString('en-GB');
});

const getPlaceholder = (templateType: string) => {
  const placeholders: Record<string, string> = {
    certificate_template: 'Enter the certificate template. Use {{variable}} for dynamic fields like {{full_name}}, {{urn}}, {{system_cost}}, etc.',
    pdf_legal_text: 'Enter the legal text that will appear in PDF certificates...',
    claim_form: 'Enter the claim form template content...',
    dsar_form: 'Enter the DSAR form template content...',
    underwriter_info: 'Enter underwriter information (name, FCA number, etc.)...'
  };
  return placeholders[templateType] || '';
};

const fetchTemplates = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('admin_templates')
      .select('*');

    if (fetchError) throw fetchError;

    templates.value = data || [];
    loadCurrentTemplate();
  } catch (e: any) {
    error.value = e.message || 'Failed to load templates';
  } finally {
    loading.value = false;
  }
};

const loadCurrentTemplate = () => {
  const template = templates.value.find(t => t.template_type === selectedTemplate.value);
  currentContent.value = template?.content || '';
  originalContent.value = currentContent.value;
};

const resetTemplate = () => {
  currentContent.value = originalContent.value;
  success.value = '';
  error.value = '';
};

const saveTemplate = async () => {
  saving.value = true;
  error.value = '';
  success.value = '';

  try {
    const { error: saveError } = await supabase
      .from('admin_templates')
      .update({
        content: currentContent.value,
        updated_at: new Date().toISOString(),
        updated_by: user.value?.id
      })
      .eq('template_type', selectedTemplate.value);

    if (saveError) throw saveError;

    originalContent.value = currentContent.value;
    success.value = 'Template saved successfully!';
    
    await fetchTemplates();

    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e: any) {
    error.value = e.message || 'Failed to save template';
  } finally {
    saving.value = false;
  }
};

watch(selectedTemplate, () => {
  loadCurrentTemplate();
  success.value = '';
  error.value = '';
});

onMounted(() => {
  fetchTemplates();
});
</script>
