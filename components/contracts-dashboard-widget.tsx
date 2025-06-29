"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"

export function ContractsDashboardWidget() {
  const { contracts, fetchContracts } = useContractsStore()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  })

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  useEffect(() => {
    const newStats = contracts.reduce(
      (acc, contract) => {
        acc.total++
        acc[contract.status]++
        return acc
      },
      { total: 0, pending: 0, queued: 0, processing: 0, completed: 0, failed: 0 },
    )
    setStats(newStats)
  }, [contracts])

  const statCards = [
    {
      title: "Total Contracts",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
