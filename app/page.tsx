"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractsList } from "@/components/contracts-list"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function HomePage() {
  const t = useTranslations()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }

    getUser()
  }, [])

  useRealtimeContracts(userId || undefined)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("common.title")}</h1>
        <p className="text-muted-foreground mt-2">Generate and manage bilingual contracts with real-time updates</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t("dashboard.overview")}</TabsTrigger>
          <TabsTrigger value="contracts">{t("contracts.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ContractsDashboardWidget />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t("dashboard.recentActivity")}</h2>
              <p className="text-muted-foreground">Recent contract activity will appear here.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t("dashboard.statistics")}</h2>
              <p className="text-muted-foreground">Detailed statistics and analytics coming soon.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
