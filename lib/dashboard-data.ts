import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import type { AdminAction, DashboardAnalytics, Notification, PendingReview, User } from "./dashboard-types"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

export async function getDashboardAnalytics(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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

export async function getPendingReviews(): Promise<ServerActionResponse<PendingReview[]>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
