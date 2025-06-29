"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { useTranslations } from "next-intl"

interface SummaryWidgetProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
}

export default function SummaryWidget({ title, value, description, icon: Icon }: SummaryWidgetProps) {
  const t = useTranslations("DashboardSummaryWidget")
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
