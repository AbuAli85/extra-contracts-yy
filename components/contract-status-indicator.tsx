import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  className?: string
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800",
  },
  queued: {
    icon: Loader2,
    label: "Queued",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800",
    animate: true,
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800",
    animate: true,
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    variant: "secondary" as const,
    className: "bg-green-100 text-green-800",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800",
  },
}

export function ContractStatusIndicator({ status, className }: ContractStatusIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className={`h-3 w-3 mr-1 ${config.animate ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
