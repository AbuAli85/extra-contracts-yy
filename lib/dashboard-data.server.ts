import { createClient } from "@/lib/supabase/server"
import 'server-only' // Mark this module as server-only
import type { AdminAction, DashboardAnalytics, Notification, PendingReview, User } from "./dashboard-types"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

// Server-only implementations
export async function getDashboardAnalytics(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const supabase = createClient()

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

// Add other server-only implementations
export async function getPendingReviews(): Promise<ServerActionResponse<PendingReview[]>> {
  const supabase = createClient()
  // Implementation...
  return { success: true, message: "Success", data: [] }
}

export async function getAdminActions(): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = createClient()
  // Implementation...
  return { success: true, message: "Success", data: [] }
}

// Add other server-only implementations here...
