"use client"

import { useContractsStore } from "@/lib/stores/contracts-store"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, Loader2, CheckCircle, XCircle } from "lucide-react"

export function ContractsDashboardWidget() {
  const { statistics, loading } = useContractsStore()

  const stats = [
    {
      title: "Total Contracts",
      value: statistics.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: statistics.pending,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "Processing",
      value: statistics.processing,
      icon: Loader2,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      animate: true,
    },
    {
      title: "Completed",
      value: statistics.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Failed",
      value: statistics.failed,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
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
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color} ${stat.animate ? "animate-spin" : ""}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
