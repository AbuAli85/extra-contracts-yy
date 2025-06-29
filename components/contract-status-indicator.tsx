import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
}

export function ContractStatusIndicator({ status }: ContractStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          variant: "secondary" as const,
          icon: Clock,
          label: "Pending",
          className: "text-yellow-600 bg-yellow-50 border-yellow-200",
        }
      case "queued":
        return {
          variant: "secondary" as const,
          icon: Clock,
          label: "Queued",
          className: "text-blue-600 bg-blue-50 border-blue-200",
        }
      case "processing":
        return {
          variant: "secondary" as const,
          icon: Loader2,
          label: "Processing",
          className: "text-blue-600 bg-blue-50 border-blue-200",
        }
      case "completed":
        return {
          variant: "secondary" as const,
          icon: CheckCircle,
          label: "Completed",
          className: "text-green-600 bg-green-50 border-green-200",
        }
      case "failed":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Failed",
          className: "text-red-600 bg-red-50 border-red-200",
        }
      default:
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          label: "Unknown",
          className: "text-gray-600 bg-gray-50 border-gray-200",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`inline-flex items-center gap-1 ${config.className}`}>
      <Icon className={`h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
