"use client"

import { useEffect } from "react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

export function ContractsDashboardWidget() {
  const { stats, fetchContracts, isLoading } = useContractsStore()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const statCards = [
    {
      title: "Total Contracts",
      value: stats.total,
      icon: FileText,
      description: "All contracts generated",
    },
    {
      title: "In Progress",
      value: stats.pending,
      icon: Clock,
      description: "Pending, queued, or processing",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      description: "Successfully generated",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: XCircle,
      description: "Generation failed",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
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
