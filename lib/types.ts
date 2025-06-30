export interface Contract {
  id: string
  contract_name: string
  contract_number?: string | null
  contract_type?: string | null
  status: ContractStatus
  created_at: string
  updated_at: string
  user_id?: string | null
  party_a_id?: string | null
  party_b_id?: string | null
  promoter_id?: string | null
  start_date?: string | null
  end_date?: string | null
  contract_value?: number | null
  content_english?: string | null
  content_spanish?: string | null
  party_a_name?: string
  party_b_name?: string
  promoter_name?: string
  contract_data?: any
  file_url?: string | null
  notes?: string | null
}

export interface ContractInsert {
  contract_name: string
  contract_number: string
  status?: ContractStatus
  user_id?: string | null
  party_a_id?: string | null
  party_b_id?: string | null
  promoter_id?: string | null
  contract_type?: string | null
  start_date?: string | null
  end_date?: string | null
  contract_value?: number | null
  content_english?: string | null
  content_spanish?: string | null
  contract_data?: any
  file_url?: string | null
  notes?: string | null
}

export interface ContractUpdate {
  contract_name?: string
  contract_number?: string
  status?: ContractStatus
  user_id?: string | null
  party_a_id?: string | null
  party_b_id?: string | null
  promoter_id?: string | null
  contract_type?: string | null
  start_date?: string | null
  end_date?: string | null
  contract_value?: number | null
  content_english?: string | null
  content_spanish?: string | null
  contract_data?: any
  file_url?: string | null
  notes?: string | null
}

export interface Party {
  id: string
  name: string
  email: string | null
  phone?: string | null
  address?: string | null
  type: PartyType
  created_at: string
  updated_at: string
  user_id: string | null
  additional_info?: any
}

export interface PartyInsert {
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  type: PartyType
  user_id?: string | null
  additional_info?: any
}

export interface PartyUpdate {
  name?: string
  email?: string | null
  phone?: string | null
  address?: string | null
  type?: PartyType
  user_id?: string | null
  additional_info?: any
}

export interface Promoter {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  specialization?: string | null
  experience_years?: number | null
  rating?: number | null
  status?: "active" | "inactive" | "suspended"
  created_at: string
  updated_at: string
  user_id: string | null
  profile_data?: any
}

export interface PromoterInsert {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  specialization?: string | null
  experience_years?: number | null
  rating?: number | null
  status?: "active" | "inactive" | "suspended"
  user_id?: string | null
  profile_data?: any
}

export interface PromoterUpdate {
  name?: string
  email?: string
  phone?: string | null
  company?: string | null
  specialization?: string | null
  experience_years?: number | null
  rating?: number | null
  status?: "active" | "inactive" | "suspended"
  user_id?: string | null
  profile_data?: any
}

export const PartyType = {
  INDIVIDUAL: "individual",
  COMPANY: "company", 
  ORGANIZATION: "organization",
} as const

export type PartyType = typeof PartyType[keyof typeof PartyType]

export const ContractStatus = {
  PENDING: "pending",
  PROCESSING: "processing", 
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const

export type ContractStatus = typeof ContractStatus[keyof typeof ContractStatus]

export interface User {
  id: string
  email: string
  role?: string
  created_at: string
}

export interface AuditLog {
  id: string
  action: string
  user_id: string
  created_at: string
  details?: any
}

export interface DashboardStats {
  totalContracts: number
  activeContracts: number
  pendingContracts: number
  completedContracts: number
  totalParties: number
  totalPromoters: number
  recentActivity: AuditLog[]
}
