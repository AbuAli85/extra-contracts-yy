import { getTranslations } from "next-intl/server"
import { AuditLogs } from "@/components/dashboard/audit-logs"
import { getAuditLogs } from "@/lib/dashboard-data"

export default async function AuditPage() {
  const t = await getTranslations("DashboardAuditLogs")
  const initialLogs = await getAuditLogs()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">{t("auditLogsTitle")}</h1>
      <AuditLogs />
    </main>
  )
}
