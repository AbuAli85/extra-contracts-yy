"use client"

import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
}

export function ContractStatusIndicator({ status }: ContractStatusIndicatorProps) {
  const t = useTranslations("contracts")

  const statusConfig = {
    pending: {
      label: t("pending"),
      variant: "secondary" as const,
    },
    queued: {
      label: t("queued"),
      variant: "outline" as const,
    },
    processing: {
      label: t("processing"),
      variant: "default" as const,
    },
    completed: {
      label: t("completed"),
      variant: "default" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    failed: {
      label: t("failed"),
      variant: "destructive" as const,
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
