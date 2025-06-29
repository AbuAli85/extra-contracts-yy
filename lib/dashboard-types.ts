export interface DashboardSummary {
  totalContracts: number
  activeContracts: number
  pendingContracts: number
}

export interface ContractTrend {
  month: string
  newContracts: number
  completedContracts: number
}

export interface ContractStatusDistribution {
  name: string
  count: number
}

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  target: string
  details: string
}

export interface Review {
  id: string
  title: string
  description: string
  avatar: string
  submitter: string
  period: string
}

export interface AdminAction {
  id: string
  name: string
  description: string
}

export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  message: string
  timestamp: string
  isRead: boolean
}

// Supabase row types for audit_logs and notifications
export type AuditLogRow = {
  id: string
  user_email: string | null
  action: string
  ip_address: string | null
  timestamp: string
  details: string | object | null
  target: string | null
}

export type NotificationRow = {
  id: string
  type: string
  message: string
  created_at: string
  user_email: string | null
  related_contract_id: string | null
  related_entity_id: string | null
  related_entity_type: string | null
  is_read: boolean
}

// Client-side types for components
export type AuditLogItem = {
  id: string
  user: string
  action: string
  ipAddress: string | null
  timestamp: string
  details: string | object | null
  target: string | null
}

export type ReviewItem = {
  id: string
  title: string
  promoter: string
  parties: string
  period: string
  contractLink: string
  submitter: string
  avatar: string
}

export type NotificationItem = {
  id: string
  type: "info" | "success" | "warning" | "error"
  message: string
  timestamp: string
  user_email: string | null
  related_contract_id: string | null
  isRead: boolean
  context?: string
}

export type ContractReportItem = {
  id: string
  contract_name: string
  contract_type: string
  party_a_name: string
  party_b_name: string
  promoter_name: string
  start_date: string
  end_date: string
  status: string
}
