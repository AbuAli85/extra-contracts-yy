"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

export function ContractsDashboardWidget() {
  const { getStatistics } = useContractsStore()
  const stats = getStatistics()

  const widgets = [
    {
      title: "Total Contracts",
      value: stats.total,
      icon: FileText,
      className: "text-blue-600 bg-blue-50",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      className: "text-yellow-600 bg-yellow-50",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      className: "text-green-600 bg-green-50",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: XCircle,
      className: "text-red-600 bg-red-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {widgets.map((widget) => {
        const Icon = widget.icon
        return (
          <Card key={widget.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              <div className={`p-2 rounded-full ${widget.className}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
