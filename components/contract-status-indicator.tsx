"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, RotateCcw, CheckCircle, XCircle } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  showIcon?: boolean
}

export function ContractStatusIndicator({ status, showIcon = true }: ContractStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          variant: "secondary" as const,
          label: "Pending",
        }
      case "queued":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: "outline" as const,
          label: "Queued",
        }
      case "processing":
        return {
          icon: <RotateCcw className="h-4 w-4 animate-spin" />,
          variant: "default" as const,
          label: "Processing",
        }
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: "default" as const,
          label: "Completed",
        }
      case "failed":
        return {
          icon: <XCircle className="h-4 w-4" />,
          variant: "destructive" as const,
          label: "Failed",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          variant: "secondary" as const,
          label: "Unknown",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {showIcon && config.icon}
      {config.label}
    </Badge>
  )
}
