"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { SummaryWidget } from "@/components/dashboard/summary-widget"
import { useQuery } from "@tanstack/react-query"
// Import from the client-safe version instead
import { getDashboardAnalytics } from "@/lib/dashboard-data.client"
import { Loader2 } from "lucide-react"

export default function DashboardAnalyticsPage() {
  // Rest of your component remains the same
  const t = useTranslations("DashboardAnalyticsPage")

  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: getDashboardAnalytics,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingAnalytics")}</span>
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

  if (!analyticsData?.success || !analyticsData.data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorFetchingData")}: {analyticsData?.message || t("unknownError")}
      </div>
    )
  }

  const { totalContracts, activeContracts, pendingContracts, contractTrends, statusDistribution } = analyticsData.data

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      <SummaryWidget title={t("totalContracts")} value={totalContracts} description={t("totalContractsDescription")} />
      <SummaryWidget
        title={t("activeContracts")}
        value={activeContracts}
        description={t("activeContractsDescription")}
      />
      <SummaryWidget
        title={t("pendingContracts")}
        value={pendingContracts}
        description={t("pendingContractsDescription")}
      />

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>{t("contractTrends")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartsSection contractTrends={contractTrends} statusDistribution={statusDistribution} />
        </CardContent>
      </Card>
    </div>
  )
}
