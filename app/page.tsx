"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractsList } from "@/components/contracts-list"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { createClient } from "@/lib/supabase/client"

export default function HomePage() {
  const t = useTranslations("dashboard")
  const { setContracts, setLoading, setError } = useContractsStore()

  // Set up real-time subscriptions
  useRealtimeContracts()

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setContracts(data || [])
      } catch (error) {
        console.error("Error fetching contracts:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch contracts")
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [setContracts, setLoading, setError])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">Manage your bilingual contracts efficiently</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ContractsDashboardWidget />
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
