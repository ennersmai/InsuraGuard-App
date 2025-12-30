export interface Registration {
  id: string;
  user_id: string;
  urn: string;
  full_name: string;
  email: string;
  phone: string;
  installation_address: string;
  system_description: string;
  system_cost: number;
  commissioning_date: string;
  installer_company: string;
  inverter_serial?: string;
  battery_serial?: string;
  document_urls?: string[];
  stripe_payment_id?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_amount?: number;
  pdf_url?: string;
  registration_date: string;
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface AdminTemplate {
  id: string;
  template_type: 'pdf_legal_text' | 'claim_form' | 'dsar_form' | 'underwriter_info';
  content: string;
  updated_at: string;
  updated_by?: string;
}

export interface RegistrationFormData {
  full_name: string;
  email: string;
  phone: string;
  installation_address: string;
  system_description: string;
  system_cost: number;
  commissioning_date: Date;
  installer_company: string;
  inverter_serial?: string;
  battery_serial?: string;
  documents: File[];
}
