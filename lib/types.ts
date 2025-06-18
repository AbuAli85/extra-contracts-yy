export interface Party {
  id: string
  name_en: string
  name_ar: string
  crn: string
  type?: string | null
  created_at?: string | null
}

export interface Promoter {
  id: string
  name_en: string
  name_ar: string
  id_card_number: string
  id_card_url?: string | null
  passport_url?: string | null
  employer_id?: string | null
  outsourced_to_id?: string | null
  job_title?: string | null
  work_location?: string | null
  status?: string | null
  contract_valid_until?: string | null
  id_card_expiry_date?: string | null
  passport_expiry_date?: string | null
  notify_before_id_expiry_days?: number | null
  notify_before_passport_expiry_days?: number | null
  notify_before_contract_expiry_days?: number | null
  notes?: string | null
  created_at?: string | null
  active_contracts_count?: number
}

export interface PromoterProfile extends Promoter {}

export interface ContractRecord<Extra extends Record<string, unknown> = {}>
  extends Extra {
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
  second_party_name_en?: string
  second_party_name_ar?: string
  promoter_name_en?: string
  promoter_name_ar?: string
  contract_start_date: string | null
  contract_end_date: string | null
  job_title?: string | null
  email: string | null
}
