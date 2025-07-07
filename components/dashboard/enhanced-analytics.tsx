"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  FileText,
  Target,
  Activity,
  Calendar,
  BarChart3
} from "lucide-react"
import { useTranslations } from "next-intl"

interface AnalyticsData {
  totalContracts: number
  activeContracts: number
  pendingContracts: number
  completedContracts: number
  failedContracts: number
  monthlyGrowth: number
  totalRevenue: number
  averageContractValue: number
  averageProcessingTime: number
  successRate: number
  monthlyTargets: {
    target: number
    achieved: number
    percentage: number
  }
  recentTrends: {
    contracts: number
    revenue: number
    efficiency: number
  }
}

interface EnhancedAnalyticsProps {
  data: AnalyticsData
}

export function EnhancedAnalytics({ data }: EnhancedAnalyticsProps) {
  const t = useTranslations("EnhancedAnalytics")

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = "number" 
  }: {
    title: string
    value: number
    change?: number
    icon: any
    format?: "number" | "currency" | "percentage" | "time"
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case "currency":
          return `$${val.toLocaleString()}`
        case "percentage":
          return `${val}%`
        case "time":
          return `${val} days`
        default:
          return val.toLocaleString()
      }
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          {change !== undefined && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={change > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(change)}%
              </span>
              <span>from last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("totalContracts")}
          value={data.totalContracts}
          change={data.monthlyGrowth}
          icon={FileText}
        />
        <MetricCard
          title={t("totalRevenue")}
          value={data.totalRevenue}
          change={data.recentTrends.revenue}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title={t("successRate")}
          value={data.successRate}
          change={data.recentTrends.efficiency}
          icon={Target}
          format="percentage"
        />
        <MetricCard
          title={t("avgProcessingTime")}
          value={data.averageProcessingTime}
          icon={Clock}
          format="time"
        />
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="performance">{t("performance")}</TabsTrigger>
          <TabsTrigger value="revenue">{t("revenue")}</TabsTrigger>
          <TabsTrigger value="trends">{t("trends")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("contractStatus")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("active")}</span>
                  <Badge variant="default">{data.activeContracts}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("pending")}</span>
                  <Badge variant="secondary">{data.pendingContracts}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("completed")}</span>
                  <Badge variant="outline">{data.completedContracts}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("failed")}</span>
                  <Badge variant="destructive">{data.failedContracts}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("monthlyTargets")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("target")}</span>
                  <span className="text-sm text-muted-foreground">{data.monthlyTargets.target}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("achieved")}</span>
                  <span className="text-sm font-semibold">{data.monthlyTargets.achieved}</span>
                </div>
                <Progress value={data.monthlyTargets.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  {data.monthlyTargets.percentage}% of monthly target
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("processingEfficiency")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{data.successRate}%</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("avgProcessingTime")}: {data.averageProcessingTime} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("contractValue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  ${data.averageContractValue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("averageContractValue")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("monthlyGrowth")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${data.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("comparedToLastMonth")}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("revenueBreakdown")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("totalRevenue")}</span>
                  <span className="text-lg font-bold">${data.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("averageContractValue")}</span>
                  <span className="text-lg font-semibold">${data.averageContractValue.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t("revenueGrowth")}: 
                    <span className={`ml-2 font-semibold ${data.recentTrends.revenue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.recentTrends.revenue > 0 ? '+' : ''}{data.recentTrends.revenue}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("recentTrends")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("contractGeneration")}</span>
                  <div className="flex items-center space-x-2">
                    {data.recentTrends.contracts > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={data.recentTrends.contracts > 0 ? "text-green-500" : "text-red-500"}>
                      {data.recentTrends.contracts > 0 ? '+' : ''}{data.recentTrends.contracts}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("revenue")}</span>
                  <div className="flex items-center space-x-2">
                    {data.recentTrends.revenue > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={data.recentTrends.revenue > 0 ? "text-green-500" : "text-red-500"}>
                      {data.recentTrends.revenue > 0 ? '+' : ''}{data.recentTrends.revenue}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("efficiency")}</span>
                  <div className="flex items-center space-x-2">
                    {data.recentTrends.efficiency > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={data.recentTrends.efficiency > 0 ? "text-green-500" : "text-red-500"}>
                      {data.recentTrends.efficiency > 0 ? '+' : ''}{data.recentTrends.efficiency}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("keyInsights")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">High Performance</div>
                      <div className="text-muted-foreground">
                        {data.successRate}% success rate maintained
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <BarChart3 className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Growth Trajectory</div>
                      <div className="text-muted-foreground">
                        {data.monthlyGrowth > 0 ? 'Positive' : 'Negative'} growth trend
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Target Achievement</div>
                      <div className="text-muted-foreground">
                        {data.monthlyTargets.percentage}% of monthly target
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
