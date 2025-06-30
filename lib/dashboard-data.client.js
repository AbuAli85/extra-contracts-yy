"use client";

import { createClient } from "@/lib/supabase/client";

// Client-side data helpers used by dashboard pages

export async function getDashboardAnalytics() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.rpc("get_dashboard_analytics");
    if (error) {
      return {
        success: false,
        message: `Failed to fetch analytics: ${error.message}`,
      };
    }
    return {
      success: true,
      message: "Analytics fetched successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

export async function getPendingReviews() {
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
        message: `Failed to fetch pending reviews: ${error.message}`,
      };
    }
    return {
      success: true,
      message: "Pending reviews fetched successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

export async function getAdminActions() {
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
        message: `Failed to fetch admin actions: ${error.message}`,
      };
    }
    return {
      success: true,
      message: "Admin actions fetched successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

export async function getNotifications() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
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
      message: `Failed to fetch notifications: ${error.message}`,
    };
  }
  return {
    success: true,
    message: "Notifications fetched successfully.",
    data,
  };
}

export async function getUsers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, created_at");
  if (error) {
    return {
      success: false,
      message: `Failed to fetch users: ${error.message}`,
    };
  }
  return {
    success: true,
    message: "Users fetched successfully.",
    data,
  };
}

export async function getAuditLogs(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    return {
      success: false,
      message: `Failed to fetch audit logs: ${error.message}`,
    };
  }
  return {
    success: true,
    message: "Audit logs fetched successfully.",
    data,
  };
}
