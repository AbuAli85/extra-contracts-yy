import type { Database } from "@/types/supabase"

export type Contract = Database["public"]["Tables"]["contracts"]["Row"] & {
  party_a_name?: string
  party_b_name?: string
  promoter_name?: string
}

export type Party = Database["public"]["Tables"]["parties"]["Row"]
export type Promoter = Database["public"]["Tables"]["promoters"]["Row"]

// Extended types for Supabase joins
export type ContractRecord = Database["public"]["Tables"]["contracts"]["Row"] & {
  parties_contracts_employer_id_fkey?: { name_en: string | null; name_ar: string | null } | null
  parties_contracts_client_id_fkey?: { name_en: string | null; name_ar: string | null } | null
  promoters?: { name_en: string | null; name_ar: string | null } | null
}

export type BilingualPdfData = {
  first_party_name_en?: string | null
  first_party_name_ar?: string | null
  second_party_name_en?: string | null
  second_party_name_ar?: string | null
  promoter_name_en?: string | null
  promoter_name_ar?: string | null
  contract_start_date?: string | null
  contract_end_date?: string | null
  job_title?: string | null
  email?: string | null
}
