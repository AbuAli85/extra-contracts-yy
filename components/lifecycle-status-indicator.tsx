"use client"

import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

interface LifecycleStatusIndicatorProps {
  status: string
}

export function LifecycleStatusIndicator({ status }: LifecycleStatusIndicatorProps) {
  const t = useTranslations("LifecycleStatusIndicator")

  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "info" | "warning" = "secondary"
  let translatedStatus = status

  switch (status) {
    case "Draft":
      variant = "outline"
      translatedStatus = t("draft")
      break
    case "Pending Review":
      variant = "info"
      translatedStatus = t("pendingReview")
      break
    case "Approved":
      variant = "success"
      translatedStatus = t("approved")
      break
    case "Active":
      variant = "default"
      translatedStatus = t("active")
      break
    case "Completed":
      variant = "secondary"
      translatedStatus = t("completed")
      break
    case "Archived":
      variant = "outline"
      translatedStatus = t("archived")
      break
    case "Terminated":
      variant = "destructive"
      translatedStatus = t("terminated")
      break
    default:
      variant = "secondary"
      break
  }

  return <Badge variant={variant}>{translatedStatus}</Badge>
}
