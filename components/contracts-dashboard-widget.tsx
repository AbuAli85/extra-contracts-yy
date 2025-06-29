"use client"

import { useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"

export function ContractsDashboardWidget() {
  const { contracts, loading, fetchContracts } = useContractsStore()

  useEffect(() => {
    if (contracts.length === 0) {
      fetchContracts()
    }
  }, [contracts.length, fetchContracts])

  const stats = useMemo(() => {
    const total = contracts.length
    const pending = contracts.filter((c) => c.status === "pending").length
    const queued = contracts.filter((c) => c.status === "queued").length
    const processing = contracts.filter((c) => c.status === "processing").length
    const completed = contracts.filter((c) => c.status === "completed").length
    const failed = contracts.filter((c) => c.status === "failed").length

    return { total, pending, queued, processing, completed, failed }
  }, [contracts])

  const statCards = [
    {
      title: "Total Contracts",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Processing",
      value: stats.queued + stats.processing,
      icon: Loader2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      animate: stats.processing > 0,
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color} ${stat.animate ? "animate-spin" : ""}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" /> : stat.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
