"use client"

import { useEffect } from "react"
import { ContractsList } from "@/components/contracts-list"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BarChart3 } from "lucide-react"

export default function HomePage() {
  const { fetchContracts } = useContractsStore()

  // Set up real-time subscriptions
  useRealtimeContracts()

  // Fetch contracts on mount
  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Management</h1>
          <p className="text-muted-foreground">Generate, track, and manage your bilingual contracts</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contracts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Statistics</CardTitle>
              <CardDescription>Overview of your contract generation activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ContractsDashboardWidget />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <ContractsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
