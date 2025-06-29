"use client";

import { createClient } from "@/lib/supabase/client";
import type { 
  DashboardAnalytics, 
  PendingReview, 
  AdminAction,
  ServerActionResponse 
} from "./dashboard-types";

/**
 * Client-safe implementation for fetching dashboard analytics
 */
export async function getDashboardAnalytics(): Promise<ServerActionResponse<DashboardAnalytics>> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc("get_dashboard_analytics");

    if (error) {
      console.error("Error fetching dashboard analytics:", error);
      return {
        success: false,
        message: `Failed to fetch dashboard analytics: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Dashboard analytics fetched successfully.",
      data: data as DashboardAnalytics,
    };
  } catch (error) {
    console.error("Error in getDashboardAnalytics:", error);
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    };
  }
}

/**
 * Client-safe implementation for fetching pending reviews
 */
export async function getPendingReviews(): Promise<ServerActionResponse<PendingReview[]>> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("contracts")
      .select("id, contract_name, status, updated_at")
      .in("status", ["pending", "processing", "pending_review"])
      .order("updated_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching pending reviews:", error);
      return {
        success: false,
        message: `Failed to fetch pending reviews: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Pending reviews fetched successfully.",
      data: data as PendingReview[],
    };
  } catch (error) {
    console.error("Error in getPendingReviews:", error);
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    };
  }
}

/**
 * Client-safe implementation for fetching admin actions
 */
export async function getAdminActions(): Promise<ServerActionResponse<AdminAction[]>> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, action, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching admin actions:", error);
      return {
        success: false,
        message: `Failed to fetch admin actions: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Admin actions fetched successfully.",
      data: data as AdminAction[],
    };
  } catch (error) {
    console.error("Error in getAdminActions:", error);
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`,
    };
  }
}
