"use client"

import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  className?: string
}

export function ContractStatusIndicator({ status, className }: ContractStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          variant: "secondary" as const,
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        }
      case "queued":
        return {
          variant: "outline" as const,
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        }
      case "processing":
        return {
          variant: "default" as const,
          icon: Loader2,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          animate: true,
        }
      case "completed":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
        }
      case "failed":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
        }
      default:
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.bgColor} ${config.color} ${className}`}>
      <Icon className={`w-3 h-3 mr-1 ${config.animate ? "animate-spin" : ""}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
