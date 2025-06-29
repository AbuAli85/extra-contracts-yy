"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

export function ContractsDashboardWidget() {
  const t = useTranslations("dashboard")
  const { contracts, fetchContracts, getStatistics } = useContractsStore()
  const stats = getStatistics()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const statCards = [
    {
      title: t("totalContracts"),
      value: stats.total,
      icon: FileText,
      description: "Total contracts in system",
      color: "text-blue-600",
    },
    {
      title: t("pendingContracts"),
      value: stats.pending,
      icon: Clock,
      description: "Contracts being processed",
      color: "text-yellow-600",
    },
    {
      title: t("completedContracts"),
      value: stats.completed,
      icon: CheckCircle,
      description: "Successfully completed",
      color: "text-green-600",
    },
    {
      title: t("failedContracts"),
      value: stats.failed,
      icon: XCircle,
      description: "Failed to generate",
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
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
