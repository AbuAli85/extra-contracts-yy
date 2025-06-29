"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractsList } from "@/components/contracts-list"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { useContractsStore } from "@/lib/stores/contracts-store"

export default function HomePage() {
  const t = useTranslations("dashboard")
  const { fetchContracts } = useContractsStore()

  // Set up real-time subscriptions
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">Manage and track your bilingual contract generation</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              <ContractsDashboardWidget />
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <ContractsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
