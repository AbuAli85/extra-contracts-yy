import type React from "react"

export interface ContractStats {
  totalContracts: number
  activeContracts: number
  expiredContracts: number
  expiringSoonContracts: number
  totalPromoters: number
  totalCompanies: number
}
export interface SummaryWidgetData {
  title: string
  titleAr: string
  value: string | number
  icon: React.ElementType
  trend?: "up" | "down" | "neutral" | string
  comparison?: string
  color?: string
  description?: string
  period?: string
}

export interface ContractReportItem {
  id: string // from contracts.id (via contracts_view)
  contract_id: string // from contracts_view (originally contracts.contract_id)
  promoter_name: string // from contracts_view
  employer_name: string // from contracts_view
  client_name: string // from contracts_view
  start_date: string // from contracts_view (originally contracts.contract_start_date)
  end_date: string // from contracts_view (originally contracts.contract_end_date)
  status: "Active" | "Expired" | "Soon-to-Expire" | "Pending Approval" | "Draft" // from contracts_view (originally contracts.status)
}

export interface ReviewItem {
  id: string
  title: string
  promoter: string
  parties: string
  period: string
  contractLink: string
  submitter?: string
  avatar?: string
}

export interface NotificationItem {
  id: string
  type: "success" | "error" | "warning" | "info" | "default"
  message: string
  timestamp: string // ISO Date string from created_at
  context?: string
  isRead?: boolean
  user_email?: string
  related_contract_id?: string // This is the required field
  related_entity_id?: string
  related_entity_type?: string
}

// Row shape from the `notifications` table used in realtime payloads
export interface NotificationRow {
  id: string
  type: NotificationItem["type"]
  message: string
  created_at: string
  user_email?: string | null
  related_contract_id?: string | null
  related_entity_id?: string | null
  related_entity_type?: string | null
  is_read: boolean
}

export interface AuditLogItem {
  id: string
  user: string // Mapped from user_email or "System"
  action: string
  ipAddress: string // Mapped from ip_address
  timestamp: string // ISO Date string from timestamp
  details?: string | object // Mapped from details
}

// Row shape from the `audit_logs` table used in realtime payloads
export interface AuditLogRow {
  id: string
  user_email?: string | null
  action: string
  ip_address?: string | null
  timestamp: string
  details?: string | object | null
}

export interface ContractsByStatusDataPoint {
  name: string
  nameAr: string
  count: number
  fill: string
}

export interface MonthlyContractRevenueDataPoint {
  month: string
  monthAr: string
  contracts: number
  revenue: number
}
