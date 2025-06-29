"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, Loader2, FileText } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  className?: string
}

const statusConfig = {
  pending: {
    icon: FileText,
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  queued: {
    icon: Clock,
    label: "Queued",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    variant: "secondary" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  failed: {
    icon: AlertCircle,
    label: "Failed",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
}

export function ContractStatusIndicator({ status, className }: ContractStatusIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className={`h-3 w-3 mr-1 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
