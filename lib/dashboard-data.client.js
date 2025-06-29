"use client";

// Very simple implementation with only the required exports
const getDashboardAnalytics = async () => {
  return {
    success: true,
    message: "Analytics data fetched",
    data: {
      totalContracts: 100,
      pendingContracts: 25,
      completedContracts: 70,
      failedContracts: 5
    }
  };
};

const getPendingReviews = async () => {
  return {
    success: true,
    message: "Pending reviews fetched",
    data: [
      {
        id: "1",
        contract_name: "Sample Contract",
        status: "pending_review",
        updated_at: new Date().toISOString()
      }
    ]
  };
};

const getAdminActions = async () => {
  return {
    success: true,
    message: "Admin actions fetched",
    data: [
      {
        id: "1",
        action: "User login",
        created_at: new Date().toISOString(),
        user_id: "user123"
      }
    ]
  };
};

// Use this export style - sometimes V0.dev has issues with named exports
export {
  getDashboardAnalytics,
  getPendingReviews,
  getAdminActions
};
