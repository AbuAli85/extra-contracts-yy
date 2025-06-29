"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"

export function ContractsDashboardWidget() {
  const { contracts } = useContractsStore()

  const stats = {
    total: contracts.length,
    pending: contracts.filter((c) => c.status === "pending").length,
    processing: contracts.filter((c) => c.status === "processing" || c.status === "queued").length,
    completed: contracts.filter((c) => c.status === "completed").length,
    failed: contracts.filter((c) => c.status === "failed").length,
  }

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
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color} ${stat.animate ? "animate-spin" : ""}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
