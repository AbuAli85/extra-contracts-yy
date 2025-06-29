export interface DashboardAnalytics {
  totalContracts: number
  pendingContracts: number
  completedContracts: number
  failedContracts: number
  contractsThisMonth: number
  contractsLastMonth: number
  averageProcessingTime: number
  successRate: number
}

export interface PendingReview {
  id: string
  contract_name: string
  status: string
  updated_at: string
}

export interface AdminAction {
  id: string
  action: string
  created_at: string
  user_id: string
  details?: string
  resource_type?: string
  resource_id?: string
}

export interface Notification {
  id: string
  message: string
  created_at: string
  read: boolean
  type?: string
  user_id: string
}

export interface User {
  id: string
  email: string
  role: string
  created_at: string
  full_name?: string
  last_sign_in_at?: string
}

export interface ContractStats {
  total: number
  pending: number
  completed: number
  failed: number
  thisMonth: number
  lastMonth: number
  growth: number
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface AuditLog extends AdminAction {
  ip_address?: string
  user_agent?: string
  details: string
  resource_type: string
  resource_id: string
}

export interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}
