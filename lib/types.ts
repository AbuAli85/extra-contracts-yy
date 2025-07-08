export interface Party {
  id: string
  name_en: string
  name_ar: string
  crn: string
  type?: "Employer" | "Client" | "Generic" | null  // Removed "Both" to match database
  role?: string | null
  cr_expiry_date?: string | null
  contact_person?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  address_en?: string | null
  address_ar?: string | null
  tax_number?: string | null
  license_number?: string | null
  license_expiry_date?: string | null
  status?: string | null  // Changed from literal union to string
  notes?: string | null
  created_at?: string | null
  owner_id?: string | null
  // Additional fields for the contract page
  email?: string | null
  phone?: string | null
  address?: string | null
}

export interface Promoter {
  id: string
  name_en: string
  name_ar: string
  id_card_number: string
  id_card_url?: string | null
  passport_url?: string | null
  status?: string | null
  id_card_expiry_date?: string | null
  passport_expiry_date?: string | null
  notify_days_before_id_expiry?: number | null
  notify_days_before_passport_expiry?: number | null
  notes?: string | null
  created_at?: string | null
  active_contracts_count?: number
  employer_id?: string | null
  outsourced_to_id?: string | null
  job_title?: string | null
  work_location?: string | null
  contract_valid_until?: string | null
  // Additional fields found in the codebase
  email?: string | null
  phone?: string | null
  national_id?: string | null
  crn?: string | null
  address?: string | null
}

export interface Contract {
  id: string
  created_at: string
  updated_at?: string | null
  contract_number?: string | null
  is_current?: boolean | null
  pdf_url?: string | null
  google_doc_url?: string | null
  error_details?: string | null
  user_id?: string | null
  first_party_id: string
  second_party_id: string
  promoter_id: string
  contract_valid_from?: string | null
  contract_valid_until?: string | null
  contract_start_date?: string | null
  contract_end_date?: string | null
  contract_value?: number | null
  job_title?: string | null
  status?: string | null
  work_location?: string | null
  email?: string | null
  contract_name?: string | null
  party_a?: string | null
  party_b?: string | null
  contract_type?: string | null
  terms?: string | null
  department?: string | null
  currency?: string | null
  end_date?: string | null
  duration?: string | null
  
  // Additional fields found in codebase
  effective_date?: string | null
  termination_date?: string | null
  payment_terms?: string | null
  content_english?: string | null
  content_spanish?: string | null
  
  // Legacy field names (used in some forms)
  party_a_id?: string | null
  party_b_id?: string | null
  
  // Direct employer/client fields
  employer_id?: string | null
  client_id?: string | null
  employee_name?: string | null
  employee_email?: string | null
  employer_name?: string | null
  
  // Party A (Client) - Direct fields
  first_party_name_en?: string | null
  first_party_name_ar?: string | null
  first_party_crn?: string | null
  
  // Party B (Employer) - Direct fields  
  second_party_name_en?: string | null
  second_party_name_ar?: string | null
  second_party_crn?: string | null
  
  // Promoter - Direct fields
  promoter_name_en?: string | null
  promoter_name_ar?: string | null
  id_card_number?: string | null
  promoter_id_card_url?: string | null
  promoter_passport_url?: string | null
  
  // Legacy field names
  first_party_name?: string | null
  second_party_name?: string | null
  promoter_name?: string | null
  
  // Related entities (joins)
  first_party?: Party | null
  second_party?: Party | null
  promoter?: Promoter | null
  
  // These should be arrays for list pages or detail pages with multiple entities
  parties?: Party[] | null
  promoters?: Promoter[] | null
  
  // Related entities for enhancement
  employer?: Party | null
  client?: Party | null
}

export interface PromoterProfile extends Promoter {
  employer_id?: string | null
  outsourced_to_id?: string | null
  job_title?: string | null
  work_location?: string | null
  contract_valid_until?: string | null
}

export interface ContractRecord {
  id: string
  created_at?: string | null
  first_party_name_en?: string | null
  second_party_name_en?: string | null
  promoter_name_en?: string | null
  status?: string | null
  google_doc_url?: string | null
  error_details?: string | null
  contract_start_date?: string | null
  contract_end_date?: string | null
}

export interface BilingualPdfData {
  first_party_name_en?: string | null
  first_party_name_ar?: string | null
  first_party_crn?: string | null
  second_party_name_en?: string | null
  second_party_name_ar?: string | null
  second_party_crn?: string | null
  promoter_name_en?: string | null
  promoter_name_ar?: string | null
  id_card_number?: string | null
  promoter_id_card_url?: string | null
  promoter_passport_url?: string | null
  contract_start_date: string | null
  contract_end_date: string | null
  job_title?: string | null
  work_location?: string | null
  email: string | null
  contract_number?: string | null
  pdf_url?: string | null
}

// Additional interfaces for contract pages
export interface ContractDetail extends Omit<Contract, 'parties' | 'promoters'> {
  id: string
  parties: Party[]
  promoters: Promoter[]
  first_party: Party
  second_party: Party
  promoter: Promoter
  contract_value: number
  status: string
  salary?: number | null
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  created_at: string;
  user_id?: string;
  metadata?: any;
}

export interface ContractDetailDebug extends Contract {
  status?: string // Allow string for compatibility
  employer_id?: string | null
  client_id?: string | null
  promoters?: {
    id: string
    name_en: string
    name_ar: string
    id_card_number: string
    id_card_url?: string | null
    passport_url?: string | null
    status?: string | null
    email?: string | null
    phone?: string | null
  }[] | null
}

export interface SimpleContract extends Omit<Contract, 'status'> {
  status?: string // Allow string for compatibility
}

export interface PartyNote {
  id: string;
  party_id: string;
  user_id: string;
  note: string;
  created_at: string;
}

export interface PartyTag {
  id: string;
  party_id: string;
  tag: string;
  created_at: string;
}

export interface PartyActivity {
  id: string;
  party_id: string;
  user_id?: string;
  activity_type: string;
  details: string;
  created_at: string;
}

export interface PartyFile {
  id: string;
  party_id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  created_at: string;
}

export type ContractStatus = "draft" | "pending" | "active" | "completed" | "cancelled" | "expired" | "failed" | "generating"
