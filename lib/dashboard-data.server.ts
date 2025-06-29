import { createClient } from "@/lib/supabase/server"
import 'server-only' // Mark this module as server-only
import type {
  AdminAction,
  DashboardAnalytics,
  Notification,
  PendingReview,
  ServerActionResponse,
  User,
} from "./dashboard-types"

// Server-only implementations
export async function getDashboardAnalytics(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_dashboard_analytics")

  if (error) {
    console.error("Error fetching dashboard analytics:", error)
    return {
      success: false,
      message: `Failed to fetch dashboard analytics: ${error.message}`,
    }
  }

  return {
    success: true,
    message: "Dashboard analytics fetched successfully.",
    data: data as DashboardAnalytics,
  }
}

// Add other server-only implementations
export async function getPendingReviews(): Promise<ServerActionResponse<PendingReview[]>> {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from("contracts")
      .select("id, contract_name, status, updated_at")
      .in("status", ["pending", "processing", "Pending Review"])
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

// Add other server-only implementations here...
