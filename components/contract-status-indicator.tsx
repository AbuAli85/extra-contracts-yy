import { Badge } from "@/components/ui/badge"
import { Clock, Loader2, CheckCircle, XCircle, PlayCircle } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
}

export function ContractStatusIndicator({ status }: ContractStatusIndicatorProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: Clock,
      className: "text-gray-600",
    },
    queued: {
      label: "Queued",
      variant: "default" as const,
      icon: PlayCircle,
      className: "text-blue-600",
    },
    processing: {
      label: "Processing",
      variant: "default" as const,
      icon: Loader2,
      className: "text-blue-600 animate-spin",
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
      icon: XCircle,
      className: "text-red-600",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Icon className={`h-3 w-3 ${config.className}`} />
      {config.label}
    </Badge>
  )
}
