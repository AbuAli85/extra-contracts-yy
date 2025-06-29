"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  DashboardAnalytics,
  PendingReview,
  AdminAction,
  ServerActionResponse,
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
      data
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
      .eq("status", "pending_review")
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
      data
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
      data
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${(error as Error).message}`
    };
  }
}
