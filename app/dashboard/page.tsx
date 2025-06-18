"use client"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SummaryWidget from "@/components/dashboard/summary-widget"
import ChartsSection from "@/components/dashboard/charts-section"
import ContractReportsTable from "@/components/dashboard/contract-reports-table"
import ReviewPanel from "@/components/dashboard/review-panel"
import NotificationSystem from "@/components/dashboard/notification-system"
import AdminTools from "@/components/dashboard/admin-tools"
import AuditLogs from "@/components/dashboard/audit-logs"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import type { SummaryWidgetData, ContractStats } from "@/lib/dashboard-types"
import { FileText, FileCheck, FileX, CalendarClock, Users, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialStats: ContractStats = {
  totalContracts: 0,
  activeContracts: 0,
  expiredContracts: 0,
  expiringSoonContracts: 0,
  totalPromoters: 0,
  totalCompanies: 0,
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ContractStats>(initialStats)
  const [loadingStats, setLoadingStats] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInitialStats = async () => {
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
          supabase.from("contracts").select("id", { count: "exact", head: true }).eq("status", "Active"),
          supabase.from("contracts").select("id", { count: "exact", head: true }).eq("status", "Expired"),
          supabase.from("contracts").select("id", { count: "exact", head: true }).eq("status", "Soon-to-Expire"),
          supabase.from("promoters").select("id", { count: "exact", head: true }),
          supabase.from("parties").select("id", { count: "exact", head: true }),
        ])

        if (totalError) throw totalError
        if (activeError) throw activeError
        if (expiredError) throw expiredError
        if (expiringSoonError) throw expiringSoonError
        if (promotersError) throw promotersError
        if (partiesError) throw partiesError

        setStats({
          totalContracts: totalContractsCount || 0,
          activeContracts: activeContractsCount || 0,
          expiredContracts: expiredContractsCount || 0,
          expiringSoonContracts: expiringSoonContractsCount || 0,
          totalPromoters: totalPromotersCount || 0,
          totalCompanies: totalCompaniesCount || 0,
        })
      } catch (error: any) {
        console.error("Error fetching initial stats:", error)
        toast({
          title: "Error Fetching Stats",
          description: error.message || "Could not load dashboard statistics.",
          variant: "destructive",
        })
      } finally {
        setLoadingStats(false)
      }
    }

    fetchInitialStats()

    const contractsChannel = supabase
      .channel("public:contracts:kpis") // Unique channel name for KPIs
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, (payload) => {
        devLog("Contracts table change for KPIs received!", payload)
        fetchInitialStats()
        toast({
          title: "Dashboard Stats Updated",
          description: "Key metrics have been updated in real-time.",
        })
      })
      .subscribe()

    // Assuming promoter and party counts also need to be real-time
    const promotersChannel = supabase
      .channel("public:promoters:kpis")
      .on("postgres_changes", { event: "*", schema: "public", table: "promoters" }, () => fetchInitialStats())
      .subscribe()

    const partiesChannel = supabase
      .channel("public:parties:kpis")
      .on("postgres_changes", { event: "*", schema: "public", table: "parties" }, () => fetchInitialStats())
      .subscribe()

    return () => {
      supabase.removeChannel(contractsChannel)
      supabase.removeChannel(promotersChannel)
      supabase.removeChannel(partiesChannel)
    }
  }, [toast])

  const summaryWidgetsData: SummaryWidgetData[] = [
    {
      title: "Total Contracts",
      titleAr: "إجمالي العقود",
      value: loadingStats ? "..." : stats.totalContracts,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Active Contracts",
      titleAr: "العقود النشطة",
      value: loadingStats ? "..." : stats.activeContracts,
      icon: FileCheck,
      color: "text-green-500",
    },
    {
      title: "Expired Contracts",
      titleAr: "العقود منتهية الصلاحية",
      value: loadingStats ? "..." : stats.expiredContracts,
      icon: FileX,
      color: "text-red-500",
    },
    {
      title: "Expiring in 30 Days",
      titleAr: "تنتهي خلال 30 يومًا",
      value: loadingStats ? "..." : stats.expiringSoonContracts,
      icon: CalendarClock,
      color: "text-orange-500",
    },
    {
      title: "Total Promoters",
      titleAr: "إجمالي المروجين",
      value: loadingStats ? "..." : stats.totalPromoters,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Total Companies",
      titleAr: "إجمالي الشركات",
      value: loadingStats ? "..." : stats.totalCompanies,
      icon: Building,
      color: "text-teal-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {summaryWidgetsData.map((widget) => (
            <SummaryWidget key={widget.title} data={widget} isLoading={loadingStats} />
          ))}
        </section>

        <ChartsSection />
        <ContractReportsTable />

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <ReviewPanel />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <NotificationSystem />
            <AdminTools />
          </div>
        </section>
        <AuditLogs />
      </div>
    </DashboardLayout>
  )
}
