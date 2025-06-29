"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { ContractsList } from "@/components/contracts-list"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"

export default function HomePage() {
  useRealtimeContracts()

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your contracts and track their status</p>
        </div>

        <ContractsDashboardWidget />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <ContractsList />
              </div>
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
