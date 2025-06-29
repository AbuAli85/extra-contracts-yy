"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
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

  const inProgress = stats.queued + stats.processing

  const statCards = [
    {
      title: "Total Contracts",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Loader2,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      animate: stats.processing > 0,
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className={`${stat.borderColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color} ${stat.animate ? "animate-spin" : ""}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
