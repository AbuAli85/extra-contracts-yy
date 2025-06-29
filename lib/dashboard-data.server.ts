import { createClient } from "@/lib/supabase/server.server"
import { cookies } from "next/headers"
import type { AdminAction, DashboardAnalytics, Notification, PendingReview, User } from "./dashboard-types"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

// This file will ONLY be imported by Server Components in the app/ directory
export async function getDashboardAnalyticsServer(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const cookieStore = cookies()
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

// Continue with all the other server-side functions, but add "Server" suffix to their names
export async function getPendingReviewsServer(): Promise<ServerActionResponse<PendingReview[]>> {
  const supabase = createClient()
  // ...function implementation...
  return { success: true, message: "Success", data: [] }
}

export async function getAdminActionsServer(): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = createClient()
  // ...function implementation...
  return { success: true, message: "Success", data: [] }
}

// ... other server-only functions ...
