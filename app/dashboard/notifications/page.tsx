"use client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import NotificationSystem from "@/components/dashboard/notification-system" // Re-use the panel for a full page view

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">All Notifications / جميع الإشعارات</h1>
        <NotificationSystem />{" "}
        {/* Can be enhanced for a full page view with more filters/actions */}
      </div>
    </DashboardLayout>
  )
}
