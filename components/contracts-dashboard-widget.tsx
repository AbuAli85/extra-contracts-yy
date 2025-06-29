"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

export function ContractsDashboardWidget() {
  const { contracts, fetchContracts, getStatistics } = useContractsStore()
  const stats = getStatistics()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const statCards = [
    {
      title: "Total Contracts",
      value: stats.total,
      icon: FileText,
      description: "All contracts in the system",
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      description: "Contracts being processed",
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      description: "Successfully generated",
      color: "text-green-600",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: XCircle,
      description: "Generation failed",
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
