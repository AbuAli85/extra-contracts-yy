export interface Party {
  id: string
  name_en: string
  name_ar: string
  crn: string
  type?: "Employer" | "Client" | "Both" | null
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
  status?: "Active" | "Inactive" | "Suspended" | null
  notes?: string | null
  created_at?: string | null
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
}

export interface PromoterProfile extends Promoter {}

export interface ContractRecord<Extra extends Record<string, unknown> = {}> extends Extra {
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
  first_party_name_en?: string
  first_party_name_ar?: string
  first_party_crn?: string
  second_party_name_en?: string
  second_party_name_ar?: string
  second_party_crn?: string
  promoter_name_en?: string
  promoter_name_ar?: string
  id_card_number?: string
  promoter_id_card_url?: string
  promoter_passport_url?: string
  contract_start_date: string | null
  contract_end_date: string | null
  job_title?: string | null
  work_location?: string | null
  email: string | null
  contract_number?: string
  pdf_url?: string
}
