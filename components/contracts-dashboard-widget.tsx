"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useTranslations } from "next-intl"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

export function ContractsDashboardWidget() {
  const t = useTranslations("dashboard")
  const { getStatistics } = useContractsStore()
  const stats = getStatistics()

  const cards = [
    {
      title: t("totalContracts"),
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: t("pendingContracts"),
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: t("completedContracts"),
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: t("failedContracts"),
      value: stats.failed,
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
