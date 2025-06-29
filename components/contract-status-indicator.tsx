import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "processing" | "completed" | "failed"
}

export function ContractStatusIndicator({ status }: ContractStatusIndicatorProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: Clock,
      className: "text-gray-600",
    },
    processing: {
      label: "Processing",
      variant: "default" as const,
      icon: RefreshCw,
      className: "text-blue-600",
    },
    completed: {
      label: "Completed",
      variant: "default" as const,
      icon: CheckCircle,
      className: "text-green-600",
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      icon: AlertCircle,
      className: "text-red-600",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      <Icon className={`h-3 w-3 ${config.className} ${status === "processing" ? "animate-spin" : ""}`} />
      <span>{config.label}</span>
    </Badge>
  )
}
