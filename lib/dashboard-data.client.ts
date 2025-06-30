import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export interface DashboardAnalytics {
  totalContracts: number
  activeContracts: number
  pendingContracts: number
  completedContracts: number
  monthlyGrowth: number
  revenueTotal: number
  averageContractValue: number
  contractsByStatus: {
    draft: number
    pending: number
    active: number
    completed: number
    cancelled: number
  }
}

export interface PendingReview {
  id: string
  title: string
  contract_type: string
  created_at: string
  party_a_name?: string
  party_b_name?: string
  contract_value?: number
  priority: 'low' | 'medium' | 'high'
}

export interface AdminAction {
  id: string
  action_type: string
  description: string
  user_id: string
  user_name?: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface AuditLog {
  id: string
  table_name: string
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  user_id: string
  user_name?: string
  timestamp: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  created_at: string
  link?: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  role: string
  last_sign_in_at?: string
  created_at: string
  is_active: boolean
}

const getSupabaseClient = () => createClientComponentClient<Database>()

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  try {
    const supabase = getSupabaseClient()
    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('status, contract_value, created_at')
    if (error) throw error

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const totalContracts = contracts?.length || 0
    const contractsByStatus = {
      draft: contracts?.filter(c => c.status === 'draft').length || 0,
      pending: contracts?.filter(c => c.status === 'pending').length || 0,
      active: contracts?.filter(c => c.status === 'active').length || 0,
      completed: contracts?.filter(c => c.status === 'completed').length || 0,
      cancelled: contracts?.filter(c => c.status === 'cancelled').length || 0,
    }
    const revenueTotal = contracts?.reduce((sum, contract) => sum + (contract.contract_value || 0), 0) || 0
    const averageContractValue = totalContracts > 0 ? revenueTotal / totalContracts : 0
    const monthlyContracts = contracts?.filter(c => new Date(c.created_at) >= lastMonth).length || 0
    const monthlyGrowth = totalContracts > 0 ? (monthlyContracts / totalContracts) * 100 : 0

    return {
      totalContracts,
      activeContracts: contractsByStatus.active,
      pendingContracts: contractsByStatus.pending,
      completedContracts: contractsByStatus.completed,
      monthlyGrowth,
      revenueTotal,
      averageContractValue,
      contractsByStatus
    }
  } catch {
    return {
      totalContracts: 0,
      activeContracts: 0,
      pendingContracts: 0,
      completedContracts: 0,
      monthlyGrowth: 0,
      revenueTotal: 0,
      averageContractValue: 0,
      contractsByStatus: {
        draft: 0,
        pending: 0,
        active: 0,
        completed: 0,
        cancelled: 0
      }
    }
  }
}

export async function getPendingReviews(): Promise<PendingReview[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('contracts')
      .select('id, title, contract_type, created_at, contract_value')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10)
    if (error) return []
    return data?.map(contract => ({
      id: contract.id,
      title: contract.title || `Contract ${contract.id}`,
      contract_type: contract.contract_type || 'Unknown',
      created_at: contract.created_at,
      contract_value: contract.contract_value,
      priority: contract.contract_value && contract.contract_value > 10000 ? 'high' : 'medium'
    })) || []
  } catch {
    return []
  }
}

export async function getAdminActions(): Promise<AdminAction[]> {
  // Replace with real DB calls if you have an admin_actions table
  return [
    {
      id: '1',
      action_type: 'CONTRACT_CREATED',
      description: 'New contract created',
      user_id: 'system',
      user_name: 'System',
      timestamp: new Date().toISOString(),
      metadata: { contract_id: 'example' }
    }
  ]
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  // Replace with real DB calls if you have an audit_logs table
  return [
    {
      id: '1',
      table_name: 'contracts',
      operation: 'INSERT',
      new_values: { status: 'draft' },
      user_id: 'system',
      user_name: 'System',
      timestamp: new Date().toISOString()
    }
  ]
}

export async function getNotifications(): Promise<Notification[]> {
  // Replace with real DB calls if you have a notifications table
  return [
    {
      id: '1',
      user_id: 'current-user',
      title: 'Welcome',
      message: 'Welcome to the contract management system',
      type: 'info',
      read: false,
      created_at: new Date().toISOString()
    }
  ]
}

export async function getUsers(): Promise<User[]> {
  try {
    const supabase = getSupabaseClient()
    // Try to get users from a 'profiles' table or similar
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(20)
    if (error) {
      return [
        {
          id: 'mock-user-1',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          last_sign_in_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          is_active: true
        }
      ]
    }
    return data?.map(profile => ({
      id: profile.id || 'unknown',
      email: profile.email || 'unknown@example.com',
      full_name: profile.full_name || 'Unknown User',
      role: profile.role || 'user',
      last_sign_in_at: profile.last_sign_in_at,
      created_at: profile.created_at || new Date().toISOString(),
      is_active: profile.is_active !== false
    })) || []
  } catch {
    return []
  }
}
