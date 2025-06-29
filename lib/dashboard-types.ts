export interface SummaryData {
  totalContracts: number
  activeContracts: number
  pendingContracts: number
}

export interface ContractsByMonth {
  month: string // e.g., "Jan 2023"
  count: number
}

export interface ContractsByStatus {
  status: string // e.g., "Draft", "Active", "Completed"
  count: number
}

export interface DashboardAnalytics {
  summary: SummaryData
  contractTrends: ContractsByMonth[]
  contractStatusDistribution: ContractsByStatus[]
}

export interface Review {
  id: string
  title: string
  description: string
  submitter: string
  avatar?: string
  period: string // e.g., "2 days ago"
}

export interface AdminAction {
  id: string
  name: string
  description: string
}

export interface Notification {
  id: string
  message: string
  timestamp: string // ISO string
  isRead: boolean
}

export interface User {
  id: string
  email: string
  role: string // e.g., "Admin", "User"
  createdAt: string // ISO string
}
