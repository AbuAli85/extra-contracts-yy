import { getTranslations } from "next-intl/server"

import { getAuditLogs } from "@/lib/dashboard-data"
import { AuditLogs } from "@/components/dashboard/audit-logs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuditPage() {
  const t = await getTranslations("DashboardAuditPage")
  const { data: auditLogs, error } = await getAuditLogs()

  if (error) {
    console.error("Error fetching audit logs:", error)
    return <div className="text-red-500">{t("errorLoadingAuditLogs")}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("auditLogs")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("recentActivity")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLogs logs={auditLogs || []} />
        </CardContent>
      </Card>
    </div>
  )
}
