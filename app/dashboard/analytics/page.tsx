import { getTranslations } from "next-intl/server"

import { getDashboardAnalytics } from "@/lib/dashboard-data"
import { SummaryWidget } from "@/components/dashboard/summary-widget"
import { ChartsSection } from "@/components/dashboard/charts-section" // Named import

export default async function AnalyticsPage() {
  const t = await getTranslations("DashboardAnalyticsPage")
  const { data, error } = await getDashboardAnalytics()

  if (error || !data) {
    console.error("Error fetching dashboard analytics:", error)
    return <div className="text-red-500">{t("errorLoadingAnalytics")}</div>
  }

  const { summary, contractTrends, contractStatusDistribution } = data

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("analyticsOverview")}</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <SummaryWidget
          title={t("totalContracts")}
          value={summary.totalContracts}
          description={t("totalContractsDescription")}
        />
        <SummaryWidget
          title={t("activeContracts")}
          value={summary.activeContracts}
          description={t("activeContractsDescription")}
        />
        <SummaryWidget
          title={t("pendingContracts")}
          value={summary.pendingContracts}
          description={t("pendingContractsDescription")}
        />
      </div>

      <ChartsSection contractsByStatus={contractStatusDistribution} contractsByMonth={contractTrends} />
    </div>
  )
}
