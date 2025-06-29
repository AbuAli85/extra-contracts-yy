// Re-export from our unified data API
export * from './data'
import type { AdminAction, DashboardAnalytics, Notification, PendingReview, User } from "./dashboard-types"
// Import only browser client statically
import { createClient as createBrowserClient } from "@/lib/supabase/client"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

// Helper function to get the appropriate client
async function getSupabaseClient() {
  // In a browser environment
  if (typeof window !== 'undefined') {
    return createBrowserClient()
  }
  
  // In server environment
  try {
    // Dynamically import server-only modules
    const { cookies } = await import('next/headers')
    const { createClient: createServerClient } = await import("@/lib/supabase/server") 
    const cookieStore = cookies()
    return createServerClient(cookieStore)
  } catch (error) {
    // Fallback to browser client
    console.warn('Falling back to browser client in server environment')
    return createBrowserClient()
  }
}

export async function getDashboardAnalytics(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const supabase = await getSupabaseClient()

  try {
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
          (1000 * 60)
        : 0

    const successRate = totalContracts > 0 ? (completedContracts / totalContracts) * 100 : 0

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

      contractTrends.push({ month: monthLabel, newContracts, completedContracts: completedInMonth })
    }

    const statusMap: Record<string, number> = {}
    contracts?.forEach((c) => {
      statusMap[c.status] = (statusMap[c.status] || 0) + 1
    })
    const statusDistribution: ContractStatusDistribution[] = Object.entries(statusMap).map(([name, count]) => ({
      name,
      count,
    }))

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
    console.error("Error fetching dashboard analytics:", error)
    return { success: false, message: `Failed to fetch dashboard analytics: ${(error as Error).message}` }
  }
}

export async function getPendingReviews(): Promise<ServerActionResponse<PendingReview[]>> {
  const supabase = await getSupabaseClient()

  // Example: Fetch contracts that are 'pending_review'
  const { data, error } = await supabase
    .from("contracts")
    .select("id, contract_name, status, updated_at")
    .eq("status", "pending_review")
    .order("updated_at", { ascending: false })

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
}

export async function getAdminActions(): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = await getSupabaseClient()

  // Example: Fetch recent audit logs or admin-specific actions
  const { data, error } = await supabase
    .from("audit_logs") // Assuming an audit_logs table exists
    .select("id, action, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching admin actions:", error)
    return {
      success: false,
      message: `Failed to fetch admin actions: ${error.message}`,
    }
  }

  return {
    success: true,
    message: "Admin actions fetched successfully.",
    data: data as AdminAction[],
  }
}

export async function getNotifications(): Promise<ServerActionResponse<Notification[]>> {
  const supabase = await getSupabaseClient()

  // Example: Fetch notifications for the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
    }
  }

  const { data, error } = await supabase
    .from("notifications") // Assuming a notifications table exists
    .select("id, message, created_at, read")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching notifications:", error)
    return {
      success: false,
      message: `Failed to fetch notifications: ${error.message}`,
    }
  }

  return {
    success: true,
    message: "Notifications fetched successfully.",
    data: data as Notification[],
  }
}

export async function getUsers(): Promise<ServerActionResponse<User[]>> {
  const supabase = await getSupabaseClient()

  // Example: Fetch a list of users (admin view)
  // In a real app, you'd likely have RLS or a separate admin client for this
  const { data, error } = await supabase.from("users").select("id, email, role, created_at") // Assuming a users table or view

  if (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      message: `Failed to fetch users: ${error.message}`,
    }
  }

  return {
    success: true,
    message: "Users fetched successfully.",
    data: data as User[],
  }
}

export async function getAuditLogs(limit = 50): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching audit logs:", error)
    return {
      success: false,
      message: `Failed to fetch audit logs: ${error.message}`,
    }
  }

  return {
    success: true,
    message: "Audit logs fetched successfully.",
    data: data as AdminAction[],
  }
}
