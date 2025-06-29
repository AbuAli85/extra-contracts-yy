"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { FileText, Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function ContractsDashboardWidget() {
  const { statistics, fetchContracts, loading } = useContractsStore()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const stats = [
    {
      title: "Total Contracts",
      value: statistics.total,
      icon: <FileText className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: statistics.pending,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Processing",
      value: statistics.processing + statistics.queued,
      icon: <Loader2 className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: statistics.completed,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Failed",
      value: statistics.failed,
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="h-6 w-8 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
