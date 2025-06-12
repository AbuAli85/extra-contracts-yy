"use client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AuditLogs from "@/components/dashboard/audit-logs" // Re-use the panel

export default function AuditPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">System Audit Logs / سجلات تدقيق النظام</h1>
        <AuditLogs /> {/* Can be enhanced for a full page view with more filters/pagination */}
      </div>
    </DashboardLayout>
  )
}
