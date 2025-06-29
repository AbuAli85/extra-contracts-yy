"use client";

// Simple implementations with explicit exports
function getDashboardAnalytics() {
  return {
    success: true,
    data: {
      totalContracts: 100,
      pendingContracts: 25,
      completedContracts: 70,
      failedContracts: 5
    }
  };
}

function getPendingReviews() {
  return {
    success: true,
    data: [{ id: "1", contract_name: "Sample Contract", status: "pending_review", updated_at: new Date().toISOString() }]
  };
}

function getAdminActions() {
  return {
    success: true,
    data: [{ id: "1", action: "User login", created_at: new Date().toISOString(), user_id: "user123" }]
  };
}

// Export all three required functions
module.exports = {
  getDashboardAnalytics,
  getPendingReviews,
  getAdminActions
};
