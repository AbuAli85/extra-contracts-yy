import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getDashboardSummary, getContractStatusDistribution, getContractsByPromoter } from "@/lib/dashboard-data"
import { BarChart, PieChart } from "@/components/dashboard/charts-section"
import ContractReportsTable from "@/components/dashboard/contract-reports-table"
import { Users, FileText, Clock } from "lucide-react"

export default async function AnalyticsPage() {
  const t = await getTranslations("DashboardAnalytics")
  const summary = await getDashboardSummary()
  const statusDistribution = await getContractStatusDistribution()
  const contractsByPromoter = await getContractsByPromoter()

  const statusChartData = statusDistribution.map((item) => ({
    name: item.status,
    value: item.count,
  }))

  const promoterChartData = contractsByPromoter.map((item) => ({
    name: item.promoter_name_en,
    value: item.count,
  }))

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">{t("analyticsTitle")}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalContracts")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalContracts}</div>
            <p className="text-xs text-muted-foreground">{t("totalContractsDescription")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activeContracts")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeContracts}</div>
            <p className="text-xs text-muted-foreground">{t("activeContractsDescription")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalPromoters")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPromoters}</div>
            <p className="text-xs text-muted-foreground">{t("totalPromotersDescription")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalParties")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalParties}</div>
            <p className="text-xs text-muted-foreground">{t("totalPartiesDescription")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("contractStatusDistribution")}</CardTitle>
            <CardDescription>{t("contractStatusDistributionDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart data={statusChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("contractsByPromoter")}</CardTitle>
            <CardDescription>{t("contractsByPromoterDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={promoterChartData} />
          </CardContent>
        </Card>
      </div>

      <ContractReportsTable />
    </main>
  )
}
