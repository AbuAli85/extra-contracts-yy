"use client"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SummaryWidget from "@/components/dashboard/summary-widget"
import ChartsSection from "@/components/dashboard/charts-section"
import ContractReportsTable from "@/components/dashboard/contract-reports-table"
import ReviewPanel from "@/components/dashboard/review-panel"
import NotificationSystem from "@/components/dashboard/notification-system"
import AdminTools from "@/components/dashboard/admin-tools"
import { EnhancedAnalytics } from "@/components/dashboard/enhanced-analytics"
import { SmartTemplateManager } from "@/components/dashboard/smart-template-manager"
import { WorkflowManager } from "@/components/dashboard/workflow-manager"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { IntegrationManager } from "@/components/dashboard/integration-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import type { SummaryWidgetData, ContractStats } from "@/lib/dashboard-types"
import { 
  FileText, 
  FileCheck, 
  FileX, 
  CalendarClock, 
  Users, 
  Building, 
  BarChart3,
  FileTemplate,
  Workflow,
  Bell,
  Settings,
  Zap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

interface DashboardContentProps {
  locale?: string
}

const initialStats: ContractStats = {
  totalContracts: 0,
  activeContracts: 0,
  expiredContracts: 0,
  expiringSoonContracts: 0,
  totalPromoters: 0,
  totalCompanies: 0,
}

export default function DashboardContent({ locale }: DashboardContentProps) {
  const [stats, setStats] = useState<ContractStats>(initialStats)
  const [loadingStats, setLoadingStats] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    let isMounted = true

    const fetchInitialStats = async () => {
      if (!isMounted) return
      
      setLoadingStats(true)
      try {
        const [
          { count: totalContractsCount, error: totalError },
          { count: activeContractsCount, error: activeError },
          { count: expiredContractsCount, error: expiredError },
          { count: expiringSoonContractsCount, error: expiringSoonError },
          { count: totalPromotersCount, error: promotersError },
          { count: totalCompaniesCount, error: partiesError },
        ] = await Promise.all([
          supabase.from("contracts").select("id", { count: "exact", head: true }),
          supabase
            .from("contracts")
            .select("id", { count: "exact", head: true })
            .eq("status", "Active"),
          supabase
            .from("contracts")
            .select("id", { count: "exact", head: true })
            .eq("status", "Expired"),
          supabase
            .from("contracts")
            .select("id", { count: "exact", head: true })
            .eq("status", "Soon-to-Expire"),
          supabase.from("promoters").select("id", { count: "exact", head: true }),
          supabase.from("parties").select("id", { count: "exact", head: true }),
        ])

        if (totalError) throw totalError
        if (activeError) throw activeError
        if (expiredError) throw expiredError
        if (expiringSoonError) throw expiringSoonError
        if (promotersError) throw promotersError
        if (partiesError) throw partiesError

        if (isMounted) {
          setStats({
            totalContracts: totalContractsCount || 0,
            activeContracts: activeContractsCount || 0,
            expiredContracts: expiredContractsCount || 0,
            expiringSoonContracts: expiringSoonContractsCount || 0,
            totalPromoters: totalPromotersCount || 0,
            totalCompanies: totalCompaniesCount || 0,
          })
          setLoadingStats(false)
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error)
        devLog("Dashboard stats fetch error:", error)
        
        if (isMounted) {
          toast({
            title: "Error loading dashboard",
            description: "Failed to fetch dashboard statistics. Please try refreshing the page.",
            variant: "destructive",
          })
          setLoadingStats(false)
        }
      }
    }

    fetchInitialStats()

    return () => {
      isMounted = false
    }
  }, [toast])

  const summaryData: SummaryWidgetData[] = [
    {
      title: "Total Contracts",
      titleAr: "إجمالي العقود",
      value: stats.totalContracts.toString(),
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Contracts",
      titleAr: "العقود النشطة", 
      value: stats.activeContracts.toString(),
      icon: FileCheck,
      color: "text-green-600",
    },
    {
      title: "Expired Contracts",
      titleAr: "العقود المنتهية",
      value: stats.expiredContracts.toString(),
      icon: FileX,
      color: "text-red-600",
    },
    {
      title: "Expiring Soon",
      titleAr: "تنتهي قريباً",
      value: stats.expiringSoonContracts.toString(),
      icon: CalendarClock,
      color: "text-yellow-600",
    },
    {
      title: "Total Promoters",
      titleAr: "إجمالي المروجين",
      value: stats.totalPromoters.toString(),
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total Companies",
      titleAr: "إجمالي الشركات",
      value: stats.totalCompanies.toString(),
      icon: Building,
      color: "text-indigo-600",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryData.map((data, index) => (
            <SummaryWidget key={index} data={data} isLoading={loadingStats} />
          ))}
        </div>
        <ChartsSection />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContractReportsTable />
          </div>
          <div className="space-y-6">
            <ReviewPanel />
            <NotificationSystem />
            <AdminTools />
          </div>
        </div>
        <EnhancedAnalytics />
        <SmartTemplateManager />
        <WorkflowManager />
        <NotificationCenter />
        <IntegrationManager />
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Overview content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Analytics content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Templates content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Workflows content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Notifications content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Integrations content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
