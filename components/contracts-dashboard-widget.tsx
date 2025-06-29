"use client"

import { useEffect, useMemo } from "react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export function ContractsDashboardWidget() {
  const { contracts, fetchContracts, loading } = useContractsStore()

  useEffect(() => {
    if (contracts.length === 0) {
      fetchContracts()
    }
  }, [contracts.length, fetchContracts])

  const stats = useMemo(() => {
    const total = contracts.length
    const pending = contracts.filter((c) => c.status === "pending").length
    const processing = contracts.filter((c) => c.status === "processing").length
    const completed = contracts.filter((c) => c.status === "completed").length
    const failed = contracts.filter((c) => c.status === "failed").length

    return { total, pending, processing, completed, failed }
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
      value: stats.processing,
      icon: RefreshCw,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
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

  if (loading && contracts.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
