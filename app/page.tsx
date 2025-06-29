"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { ContractsList } from "@/components/contracts-list"

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contract Generator</h1>
        <p className="text-muted-foreground">Generate and manage bilingual contracts with real-time processing</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ContractsDashboardWidget />
          <div className="mt-8">
            <ContractsList />
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <ContractsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
