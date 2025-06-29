"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditLogs } from "@/components/dashboard/audit-logs"
import { useQuery } from "@tanstack/react-query"
import { getAuditLogs } from "@/lib/dashboard-data.client"
import { Loader2 } from "lucide-react"

export default function DashboardAuditPage() {
  const t = useTranslations("DashboardAuditPage")

  const {
    data: auditLogsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: getAuditLogs,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingAuditLogs")}</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorLoading")}: {error?.message || t("unknownError")}
      </div>
    )
  }

  if (!auditLogsData?.success || !auditLogsData.data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorFetchingData")}: {auditLogsData?.message || t("unknownError")}
      </div>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLogs logs={auditLogsData.data} />
        </CardContent>
      </Card>
    </div>
  )
}
