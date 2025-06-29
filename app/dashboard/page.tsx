import { getTranslations } from "next-intl/server"
import { getDashboardAnalytics, getPendingReviews, getAdminActions } from "@/lib/dashboard-data"

import { SummaryWidget } from "@/components/dashboard/summary-widget"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { ReviewPanel } from "@/components/dashboard/review-panel"
import { AdminTools } from "@/components/dashboard/admin-tools"

export default async function DashboardPage() {
  const t = await getTranslations("DashboardPage")

  const { data: analyticsData, error: analyticsError } = await getDashboardAnalytics()
  const { data: pendingReviews, error: reviewsError } = await getPendingReviews()
  const { data: adminActions, error: adminActionsError } = await getAdminActions()

  if (analyticsError || reviewsError || adminActionsError) {
    console.error("Error fetching dashboard data:", analyticsError || reviewsError || adminActionsError)
    return <div className="text-red-500">{t("errorLoadingDashboard")}</div>
  }

  const { summary, contractTrends, contractStatusDistribution } = analyticsData || {
    summary: { totalContracts: 0, activeContracts: 0, pendingContracts: 0 },
    contractTrends: [],
    contractStatusDistribution: [],
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("dashboardOverview")}</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ReviewPanel reviews={pendingReviews || []} />
        <AdminTools actions={adminActions || []} />
      </div>
    </div>
  )
}
