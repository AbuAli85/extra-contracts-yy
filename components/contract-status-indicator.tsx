"use client"

import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { Clock, CheckCircle, XCircle, Loader2, Timer } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
}

export function ContractStatusIndicator({ status }: ContractStatusIndicatorProps) {
  const t = useTranslations("contracts")

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: t("pending"),
          variant: "secondary" as const,
          icon: Clock,
        }
      case "queued":
        return {
          label: t("queued"),
          variant: "outline" as const,
          icon: Timer,
        }
      case "processing":
        return {
          label: t("processing"),
          variant: "default" as const,
          icon: Loader2,
        }
      case "completed":
        return {
          label: t("completed"),
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        }
      case "failed":
        return {
          label: t("failed"),
          variant: "destructive" as const,
          icon: XCircle,
        }
      default:
        return {
          label: status,
          variant: "secondary" as const,
          icon: Clock,
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className={`h-3 w-3 mr-1 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
