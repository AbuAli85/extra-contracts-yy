import { createClient } from "@/lib/supabase/server"
import type { DashboardAnalytics, Notification, Review, User } from "@/lib/dashboard-types"
import { devLog } from "@/lib/dev-log"
import { cookies } from "next/headers"

interface ServerActionResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

export async function getDashboardAnalytics(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data, error } = await supabase.rpc("get_dashboard_analytics")

    if (error) {
      devLog("Error calling get_dashboard_analytics RPC:", error)
      throw new Error(error.message)
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        message: "No analytics data found.",
        data: {
          summary: { totalContracts: 0, activeContracts: 0, pendingContracts: 0 },
          contractTrends: [],
          contractStatusDistribution: [],
        },
      }
    }

    const analyticsData = data[0] // Assuming the RPC returns a single row with JSON

    const result: DashboardAnalytics = {
      summary: analyticsData.summary || { totalContracts: 0, activeContracts: 0, pendingContracts: 0 },
      contractTrends: analyticsData.contract_trends || [],
      contractStatusDistribution: analyticsData.contract_status_distribution || [],
    }

    return {
      success: true,
      message: "Dashboard analytics fetched successfully.",
      data: result,
    }
  } catch (error: any) {
    devLog("Exception in getDashboardAnalytics:", error)
    return {
      success: false,
      message: `Failed to fetch dashboard analytics: ${error.message}`,
    }
  }
}

export async function getPendingReviews(): Promise<ServerActionResponse<Review[]>> {
  // This is mock data. In a real application, you would fetch this from your database.
  // For example, from a 'reviews' table where status is 'pending'.
  const mockReviews: Review[] = [
    {
      id: "rev1",
      title: "Contract #C-001 Approval",
      description: "Review and approve the service contract for Project Alpha.",
      submitter: "Alice Johnson",
      avatar: "/placeholder-user.jpg",
      period: "2 days ago",
    },
    {
      id: "rev2",
      title: "Promoter Profile Update",
      description: "New promoter 'Global Events Inc.' profile needs verification.",
      submitter: "Bob Williams",
      avatar: "/placeholder-user.jpg",
      period: "1 day ago",
    },
  ]

  return {
    success: true,
    message: "Pending reviews fetched successfully.",
    data: mockReviews,
  }
}

export async function getAdminActions(): Promise<ServerActionResponse<any[]>> {
  // This is mock data. In a real application, these might be configurable actions
  // or system-level tasks.
  const mockActions: any[] = [
    {
      id: "act1",
      name: "Run Database Migrations",
      description: "Apply pending database schema changes.",
    },
    {
      id: "act2",
      name: "Clear Cache",
      description: "Clear application cache for all users.",
    },
  ]

  return {
    success: true,
    message: "Admin actions fetched successfully.",
    data: mockActions,
  }
}

export async function getNotifications(): Promise<ServerActionResponse<Notification[]>> {
  // This is mock data. In a real application, you would fetch user-specific notifications.
  const mockNotifications: Notification[] = [
    {
      id: "notif1",
      message: "Your contract 'Project Phoenix' has been approved.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isRead: false,
    },
    {
      id: "notif2",
      message: "New party 'Innovate Solutions' added to the system.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      isRead: false,
    },
    {
      id: "notif3",
      message: "System maintenance scheduled for next Sunday at 2 AM UTC.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      isRead: true,
    },
  ]

  return {
    success: true,
    message: "Notifications fetched successfully.",
    data: mockNotifications,
  }
}

export async function getUsers(): Promise<ServerActionResponse<User[]>> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data: users, error } = await supabase.from("users").select("id, email, created_at, user_metadata")

    if (error) {
      devLog("Error fetching users:", error)
      throw new Error(error.message)
    }

    const formattedUsers: User[] = users.map((user) => ({
      id: user.id,
      email: user.email || "N/A",
      role: user.user_metadata?.role || "User", // Assuming role is in user_metadata
      createdAt: user.created_at,
    }))

    return {
      success: true,
      message: "Users fetched successfully.",
      data: formattedUsers,
    }
  } catch (error: any) {
    devLog("Exception in getUsers:", error)
    return {
      success: false,
      message: `Failed to fetch users: ${error.message}`,
    }
  }
}
