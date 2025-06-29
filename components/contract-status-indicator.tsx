import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "processing" | "completed" | "failed"
}

export function ContractStatusIndicator({ status }: ContractStatusIndicatorProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: Clock,
    },
    processing: {
      label: "Processing",
      variant: "default" as const,
      icon: Loader2,
    },
    completed: {
      label: "Completed",
      variant: "default" as const,
      icon: CheckCircle,
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      icon: XCircle,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
