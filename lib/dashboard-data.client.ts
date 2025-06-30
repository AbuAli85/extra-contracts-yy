"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  ServerActionResponse,
  DashboardAnalytics,
  PendingReview,
  AdminAction,
  Notification,
  User,
} from "./dashboard-types";

/**
 * Fetches dashboard analytics data
 */
export async function getDashboardAnalytics(): Promise<
  ServerActionResponse<DashboardAnalytics>
> {
  const supabase = createClient();
  
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        message: "User not authenticated"
      };
    }

    // Fetch basic analytics
    const { data: analyticsData, error: analyticsError } = await supabase.rpc("get_dashboard_analytics");
    
    if (analyticsError) {
      return {
        success: false,
        message: `Failed to fetch analytics: ${analyticsError.message}`
      };
    }

    // Fetch contract trends
    const { data: trendsData, error: trendsError } = await supabase.rpc("get_contract_trends", {
      user_uuid: user.id,
      months_back: 6
    });

    // Fetch status distribution
    const { data: statusData, error: statusError } = await supabase.rpc("get_contract_status_distribution", {
      user_uuid: user.id
    });

    // Transform and combine the data
    const combinedData: DashboardAnalytics = {
      totalContracts: analyticsData?.total_contracts || 0,
      activeContracts: analyticsData?.active_contracts || 0,
      pendingContracts: analyticsData?.pending_review_contracts || 0,
      completedContracts: 0, // Will be calculated from status distribution
      failedContracts: 0, // Will be calculated from status distribution
      contractsThisMonth: 0, // Can be calculated from trends
      contractsLastMonth: 0, // Can be calculated from trends
      averageProcessingTime: 0, // Mock value for now
      successRate: 0, // Can be calculated
      contractTrends: trendsData?.map((trend: any) => ({
        month: trend.month,
        newContracts: trend.new_contracts || 0,
        completedContracts: trend.completed_contracts || 0
      })) || [],
      statusDistribution: statusData?.map((status: any) => ({
        name: status.status,
        count: status.count || 0
      })) || []
    };

    // Calculate derived values
    if (combinedData.statusDistribution.length > 0) {
      const completed = combinedData.statusDistribution.find(s => s.name === 'Completed')?.count || 0;
      const failed = combinedData.statusDistribution.find(s => s.name === 'Failed')?.count || 0;
      combinedData.completedContracts = completed;
      combinedData.failedContracts = failed;
      
      if (combinedData.totalContracts > 0) {
        combinedData.successRate = (completed / combinedData.totalContracts) * 100;
      }
    }

    // Calculate monthly trends
    if (combinedData.contractTrends.length >= 2) {
      const currentMonth = combinedData.contractTrends[combinedData.contractTrends.length - 1];
      const lastMonth = combinedData.contractTrends[combinedData.contractTrends.length - 2];
      combinedData.contractsThisMonth = currentMonth?.newContracts || 0;
      combinedData.contractsLastMonth = lastMonth?.newContracts || 0;
    }
    
    return {
      success: true,
      message: "Analytics fetched successfully",
      data: combinedData
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${(error as Error).message}`
    };
  }
}

/**
 * Fetches pending reviews data
 */
export async function getPendingReviews(): Promise<
  ServerActionResponse<PendingReview[]>
> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from("contracts")
      .select("id, contract_name, status, updated_at")
      .eq("status", "Pending Review")
      .order("updated_at", { ascending: false });
    
    if (error) {
      return {
        success: false,
        message: `Failed to fetch pending reviews: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: "Pending reviews fetched successfully",
      data: data as PendingReview[]
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${(error as Error).message}`
    };
  }
}

/**
 * Fetches admin actions data
 */
export async function getAdminActions(): Promise<
  ServerActionResponse<AdminAction[]>
> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, action, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (error) {
      return {
        success: false,
        message: `Failed to fetch admin actions: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: "Admin actions fetched successfully",
      data: data as AdminAction[]
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${(error as Error).message}`
    };
  }
}

/**
 * Fetches notifications for the current user
 */
export async function getNotifications(): Promise<
  ServerActionResponse<Notification[]>
> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated."
    };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, message, created_at, read")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return {
      success: false,
      message: `Failed to fetch notifications: ${error.message}`
    };
  }

  return {
    success: true,
    message: "Notifications fetched successfully.",
    data: data as Notification[]
  };
}

/**
 * Fetches list of users (admin view)
 */
export async function getUsers(): Promise<ServerActionResponse<User[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, created_at");

  if (error) {
    return {
      success: false,
      message: `Failed to fetch users: ${error.message}`
    };
  }

  return {
    success: true,
    message: "Users fetched successfully.",
    data: data as User[]
  };
}

/**
 * Fetches audit logs
 */
export async function getAuditLogs(
  limit = 50
): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      success: false,
      message: `Failed to fetch audit logs: ${error.message}`
    };
  }

  return {
    success: true,
    message: "Audit logs fetched successfully.",
    data: data as AdminAction[]
  };
}

