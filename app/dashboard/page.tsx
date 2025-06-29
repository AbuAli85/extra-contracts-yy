"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryWidget } from "@/components/dashboard/summary-widget"
import { ReviewPanel } from "@/components/dashboard/review-panel"
import { AdminTools } from "@/components/dashboard/admin-tools"
import { useQuery } from "@tanstack/react-query"
// Import from the client-safe version instead
import {
  getDashboardAnalytics,
  getPendingReviews,
  getAdminActions,
} from "@/lib/dashboard-data.client"
import { Loader2 } from "lucide-react"

// Rest of your component remains the same
export default function DashboardOverviewPage() {
  const t = useTranslations("DashboardOverviewPage")

  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
    isError: isErrorAnalytics,
    error: errorAnalytics,
  } = useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: getDashboardAnalytics,
  })

  const {
    data: pendingReviewsData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: errorReviews,
  } = useQuery({
    queryKey: ["pendingReviews"],
    queryFn: getPendingReviews,
  })

  const {
    data: adminActionsData,
    isLoading: isLoadingAdminActions,
    isError: isErrorAdminActions,
    error: errorAdminActions,
  } = useQuery({
    queryKey: ["adminActions"],
    queryFn: getAdminActions,
  })

  if (isLoadingAnalytics || isLoadingReviews || isLoadingAdminActions) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingDashboard")}</span>
      </div>
    )
  }

  if (isErrorAnalytics || isErrorReviews || isErrorAdminActions) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorLoading")}: {(errorAnalytics || errorReviews || errorAdminActions)?.message || t("unknownError")}
      </div>
    )
  }

  const totalContracts = analyticsData?.data?.totalContracts || 0
  const activeContracts = analyticsData?.data?.activeContracts || 0
  const pendingContracts = analyticsData?.data?.pendingContracts || 0
  const pendingReviews = pendingReviewsData?.data || []
  const adminActions = adminActionsData?.data || []

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
          <CardTitle>{t("pendingReviews")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewPanel reviews={pendingReviews} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>{t("adminTools")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTools actions={adminActions} />
        </CardContent>
      </Card>
    </div>
  )
}
