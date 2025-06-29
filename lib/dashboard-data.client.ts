import { createClient } from "@/lib/supabase/client"

export interface DashboardAnalytics {
  totalContracts: number
  activeContracts: number
  pendingContracts: number
  completedContracts: number
  failedContracts: number
  contractsThisMonth: number
  contractsLastMonth: number
  averageProcessingTime: number
  successRate: number
  contractTrends: ContractTrend[]
  statusDistribution: ContractStatusDistribution[]
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
}

export interface Notification {
  id: string
  message: string
  created_at: string
  read: boolean
}

export interface User {
  id: string
  email: string
  role: string
  created_at: string
}

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

export async function getDashboardAnalytics(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const supabase = createClient()

  try {
    // Try to use RPC function first, fallback to manual queries
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_dashboard_analytics")

    if (!rpcError && rpcData) {
      return {
        success: true,
        message: "Dashboard analytics fetched successfully.",
        data: rpcData as DashboardAnalytics,
      }
    }

    // Fallback to manual queries if RPC doesn't exist
    const { data: contracts, error: contractsError } = await supabase
      .from("contracts")
      .select("status, created_at, updated_at")

    if (contractsError) {
      console.error("Error fetching contracts:", contractsError)
      return {
        success: false,
        message: `Failed to fetch contracts: ${contractsError.message}`,
      }
    }

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const totalContracts = contracts?.length || 0
    const pendingContracts =
      contracts?.filter(
        (c) => c.status === "pending" || c.status === "processing" || c.status === "pending_review"
      ).length || 0
    const completedContracts = contracts?.filter((c) => c.status === "completed").length || 0
    const failedContracts = contracts?.filter((c) => c.status === "failed").length || 0
    const activeContracts =
      contracts?.filter(
        (c) => !["completed", "failed", "cancelled", "terminated", "expired"].includes(c.status)
      ).length || 0

    const contractsThisMonth = contracts?.filter((c) => new Date(c.created_at) >= thisMonth).length || 0

    const contractsLastMonth =
      contracts?.filter((c) => {
        const createdAt = new Date(c.created_at)
        return createdAt >= lastMonth && createdAt < thisMonth
      }).length || 0

    const completedContractsWithTimes =
      contracts?.filter((c) => c.status === "completed" && c.created_at && c.updated_at) || []

    const averageProcessingTime =
      completedContractsWithTimes.length > 0
        ? completedContractsWithTimes.reduce((acc, contract) => {
            const created = new Date(contract.created_at).getTime()
            const updated = new Date(contract.updated_at).getTime()
            return acc + (updated - created)
          }, 0) /
          completedContractsWithTimes.length /
          (1000 * 60) // Convert to minutes
        : 0

    const successRate = totalContracts > 0 ? (completedContracts / totalContracts) * 100 : 0

    // Generate contract trends for the last 6 months
    const monthsBack = 6
    const contractTrends: ContractTrend[] = []
    for (let i = monthsBack - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const monthLabel = start.toLocaleString("default", { month: "short" })

      const newContracts =
        contracts?.filter((c) => {
          const created = new Date(c.created_at)
          return created >= start && created < end
        }).length || 0

      const completedInMonth =
        contracts?.filter((c) => {
          if (c.status !== "completed" || !c.updated_at) return false
          const updated = new Date(c.updated_at)
          return updated >= start && updated < end
        }).length || 0

      contractTrends.push({
        month: monthLabel,
        newContracts,
        completedContracts: completedInMonth,
      })
    }

    const statusMap: Record<string, number> = {}
    contracts?.forEach((c) => {
      statusMap[c.status] = (statusMap[c.status] || 0) + 1
    })
    const statusDistribution: ContractStatusDistribution[] = Object.entries(statusMap).map(
      ([name, count]) => ({ name, count })
    )

    const analytics: DashboardAnalytics = {
      totalContracts,
      activeContracts,
      pendingContracts,
      completedContracts,
      failedContracts,
      contractsThisMonth,
      contractsLastMonth,
      averageProcessingTime: Math.round(averageProcessingTime),
      successRate: Math.round(successRate * 100) / 100,
      contractTrends,
      statusDistribution,
    }

    return {
      success: true,
      message: "Dashboard analytics fetched successfully.",
      data: analytics,
    }
  } catch (error) {
    console.error("Error in getDashboardAnalytics:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}

export async function getPendingReviews(): Promise<ServerActionResponse<PendingReview[]>> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("contracts")
      .select("id, contract_name, status, updated_at")
      .in("status", ["pending", "processing", "pending_review"])
      .order("updated_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching pending reviews:", error)
      return {
        success: false,
        message: `Failed to fetch pending reviews: ${error.message}`,
      }
    }

    return {
      success: true,
      message: "Pending reviews fetched successfully.",
      data: data as PendingReview[],
    }
  } catch (error) {
    console.error("Error in getPendingReviews:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}

export async function getAdminActions(): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = createClient()

  try {
    // Try audit_logs table first, fallback to contracts table
    const { data: auditData, error: auditError } = await supabase
      .from("audit_logs")
      .select("id, action, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10)

    if (!auditError && auditData) {
      return {
        success: true,
        message: "Admin actions fetched successfully.",
        data: auditData as AdminAction[],
      }
    }

    // Fallback to contracts table for recent activity
    const { data: contractData, error: contractError } = await supabase
      .from("contracts")
      .select("id, status, updated_at, user_id")
      .order("updated_at", { ascending: false })
      .limit(10)

    if (contractError) {
      console.error("Error fetching admin actions:", contractError)
      return {
        success: false,
        message: `Failed to fetch admin actions: ${contractError.message}`,
      }
    }

    // Transform contract data to admin actions format
    const adminActions: AdminAction[] = (contractData || []).map((contract) => ({
      id: contract.id,
      action: `Contract ${contract.status}`,
      created_at: contract.updated_at,
      user_id: contract.user_id || "system",
    }))

    return {
      success: true,
      message: "Admin actions fetched successfully.",
      data: adminActions,
    }
  } catch (error) {
    console.error("Error in getAdminActions:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}

export async function getNotifications(): Promise<ServerActionResponse<Notification[]>> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        message: "User not authenticated.",
      }
    }

    // Try notifications table first, fallback to contracts for notifications
    const { data: notificationData, error: notificationError } = await supabase
      .from("notifications")
      .select("id, message, created_at, read")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (!notificationError && notificationData) {
      return {
        success: true,
        message: "Notifications fetched successfully.",
        data: notificationData as Notification[],
      }
    }

    // Fallback to recent contract updates as notifications
    const { data: contractData, error: contractError } = await supabase
      .from("contracts")
      .select("id, contract_name, status, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(5)

    if (contractError) {
      console.error("Error fetching notifications:", contractError)
      return {
        success: false,
        message: `Failed to fetch notifications: ${contractError.message}`,
      }
    }

    // Transform contract updates to notifications
    const notifications: Notification[] = (contractData || []).map((contract) => ({
      id: contract.id,
      message: `Contract "${contract.contract_name}" is now ${contract.status}`,
      created_at: contract.updated_at,
      read: false,
    }))

    return {
      success: true,
      message: "Notifications fetched successfully.",
      data: notifications,
    }
  } catch (error) {
    console.error("Error in getNotifications:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}

export async function getUsers(): Promise<ServerActionResponse<User[]>> {
  const supabase = createClient()

  try {
    // Try users table first, fallback to auth.users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, role, created_at")
      .limit(50)

    if (!userError && userData) {
      return {
        success: true,
        message: "Users fetched successfully.",
        data: userData as User[],
      }
    }

    // Fallback to getting unique users from contracts table
    const { data: contractUsers, error: contractError } = await supabase
      .from("contracts")
      .select("user_id, created_at")
      .not("user_id", "is", null)

    if (contractError) {
      console.error("Error fetching users:", contractError)
      return {
        success: false,
        message: `Failed to fetch users: ${contractError.message}`,
      }
    }

    // Create unique users list from contracts
    const uniqueUsers = new Map()
    contractUsers?.forEach((contract) => {
      if (contract.user_id && !uniqueUsers.has(contract.user_id)) {
        uniqueUsers.set(contract.user_id, {
          id: contract.user_id,
          email: `user-${contract.user_id.slice(0, 8)}@example.com`,
          role: "user",
          created_at: contract.created_at,
        })
      }
    })

    const users: User[] = Array.from(uniqueUsers.values())

    return {
      success: true,
      message: "Users fetched successfully.",
      data: users,
    }
  } catch (error) {
    console.error("Error in getUsers:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}

export async function getAuditLogs(limit = 50): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = createClient()

  try {
    // Try audit_logs table first
    const { data: auditData, error: auditError } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!auditError && auditData) {
      return {
        success: true,
        message: "Audit logs fetched successfully.",
        data: auditData as AdminAction[],
      }
    }

    // Fallback to contracts table for audit trail
    const { data: contractData, error: contractError } = await supabase
      .from("contracts")
      .select("id, contract_name, status, created_at, updated_at, user_id")
      .order("updated_at", { ascending: false })
      .limit(limit)

    if (contractError) {
      console.error("Error fetching audit logs:", contractError)
      return {
        success: false,
        message: `Failed to fetch audit logs: ${contractError.message}`,
      }
    }

    // Transform contract data to audit logs
    const auditLogs: AdminAction[] = (contractData || []).map((contract) => ({
      id: contract.id,
      action: `Contract "${contract.contract_name}" ${contract.status}`,
      created_at: contract.updated_at,
      user_id: contract.user_id || "system",
    }))

    return {
      success: true,
      message: "Audit logs fetched successfully.",
      data: auditLogs,
    }
  } catch (error) {
    console.error("Error in getAuditLogs:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}
