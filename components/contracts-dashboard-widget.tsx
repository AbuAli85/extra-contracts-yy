"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Loader2, CheckCircle, XCircle, PlayCircle, FileText } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"

export function ContractsDashboardWidget() {
  const { contracts, fetchContracts } = useContractsStore()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const stats = {
    total: contracts.length,
    pending: contracts.filter((c) => c.status === "pending").length,
    queued: contracts.filter((c) => c.status === "queued").length,
    processing: contracts.filter((c) => c.status === "processing").length,
    completed: contracts.filter((c) => c.status === "completed").length,
    failed: contracts.filter((c) => c.status === "failed").length,
  }

  const statCards = [
    {
      title: "Total Contracts",
      value: stats.total,
      icon: FileText,
      className: "text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      className: "text-gray-600",
    },
    {
      title: "In Queue",
      value: stats.queued,
      icon: PlayCircle,
      className: "text-blue-600",
    },
    {
      title: "Processing",
      value: stats.processing,
      icon: Loader2,
      className: "text-blue-600 animate-spin",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      className: "text-green-600",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: XCircle,
      className: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.className}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
