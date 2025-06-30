export interface Contract {
  id: string
  contract_name: string
  contract_type: string
  start_date?: string
  end_date?: string
  contract_value?: number
  content_english: string
  content_spanish: string
  status: ContractStatus
  created_at: string
  updated_at: string
  user_id: string
  party_a_id?: string
  party_b_id?: string
  promoter_id?: string
  party_a_name?: string
  party_b_name?: string
  promoter_name?: string
  contract_data?: any
}

export interface Party {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  type: PartyType
  created_at: string
  updated_at: string
  user_id: string
}

export interface Promoter {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  bio?: string
  website?: string
  social_media?: any
  created_at: string
  updated_at: string
  user_id: string
}

export enum PartyType {
  INDIVIDUAL = "individual",
  COMPANY = "company",
  ORGANIZATION = "organization",
}

export enum ContractStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

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
