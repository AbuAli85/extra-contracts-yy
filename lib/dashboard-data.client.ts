import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import type { 
  DashboardAnalytics, 
  PendingReview, 
  AdminAction, 
  AuditLog, 
  Notification, 
  User 
} from '@/lib/dashboard-types'

const getSupabaseClient = () => createClientComponentClient<Database>()

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  try {
    const supabase = getSupabaseClient()
    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('status, created_at')
    if (error) throw error

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const totalContracts = contracts?.length || 0
    const pendingContracts = contracts?.filter(c => c.status === 'pending').length || 0
    const completedContracts = contracts?.filter(c => c.status === 'completed').length || 0
    const failedContracts = contracts?.filter(c => c.status === 'failed').length || 0
    const contractsThisMonth = contracts?.filter(c => new Date(c.created_at) >= lastMonth).length || 0
    const contractsLastMonth = contracts?.filter(c => {
      const contractDate = new Date(c.created_at)
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
      return contractDate >= twoMonthsAgo && contractDate < lastMonth
    }).length || 0

    const averageProcessingTime = 2.5 // Mock value - replace with actual calculation
    const successRate = totalContracts > 0 ? (completedContracts / totalContracts) * 100 : 0

    return {
      totalContracts,
      pendingContracts,
      completedContracts,
      failedContracts,
      contractsThisMonth,
      contractsLastMonth,
      averageProcessingTime,
      successRate
    }
  } catch {
    return {
      totalContracts: 0,
      pendingContracts: 0,
      completedContracts: 0,
      failedContracts: 0,
      contractsThisMonth: 0,
      contractsLastMonth: 0,
      averageProcessingTime: 0,
      successRate: 0
    }
  }
}

export async function getPendingReviews(): Promise<PendingReview[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('contracts')
      .select('id, contract_name, status, updated_at')
      .eq('status', 'pending')
      .order('updated_at', { ascending: false })
      .limit(10)
    if (error) return []
    return data?.map(contract => ({
      id: contract.id,
      contract_name: contract.contract_name,
      status: contract.status,
      updated_at: contract.updated_at
    })) || []
  } catch {
    return []
  }
}

export async function getAdminActions(): Promise<AdminAction[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) return []
    return data?.map(log => ({
      id: log.id,
      action: log.action,
      created_at: log.created_at,
      user_id: log.user_id,
      details: log.details ? JSON.stringify(log.details) : undefined,
      resource_type: log.table_name || undefined,
      resource_id: log.record_id || undefined
    })) || []
  } catch {
    return []
  }
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return []
    return data?.map(log => ({
      id: log.id,
      action: log.action,
      created_at: log.created_at,
      user_id: log.user_id,
      details: log.details ? JSON.stringify(log.details) : '',
      resource_type: log.table_name || 'unknown',
      resource_id: log.record_id || 'unknown'
    })) || []
  } catch {
    return []
  }
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) return []
    return data?.map(notification => ({
      id: notification.id,
      message: notification.message,
      created_at: notification.created_at,
      read: notification.read,
      type: notification.type || undefined,
      user_id: notification.user_id
    })) || []
  } catch {
    return []
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(20)
    if (error) return []
    return data?.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      full_name: user.profile_data?.full_name || undefined,
      last_sign_in_at: user.profile_data?.last_sign_in_at || undefined
    })) || []
  } catch {
    return []
  }
}
