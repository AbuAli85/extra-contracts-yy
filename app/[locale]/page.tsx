"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractsList } from "@/components/contracts-list"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"

export default function HomePage() {
  const t = useTranslations("dashboard")
  const { fetchContracts } = useContractsStore()

  // Initialize real-time subscriptions
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">Manage your contracts and track their progress in real-time.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="contracts">{t("recentContracts")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ContractsDashboardWidget />
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <ContractsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
