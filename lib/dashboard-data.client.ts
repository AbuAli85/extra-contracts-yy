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
    const { data, error } = await supabase.rpc("get_dashboard_analytics");
    
    if (error) {
      return {
        success: false,
        message: `Failed to fetch analytics: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: "Analytics fetched successfully",
      data: data as DashboardAnalytics
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

