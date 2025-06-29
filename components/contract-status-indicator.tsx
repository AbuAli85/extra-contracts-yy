import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, Loader2, XCircle } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
}

export function ContractStatusIndicator({ status }: ContractStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          variant: "secondary" as const,
          icon: Clock,
          className: "text-yellow-600 bg-yellow-50 border-yellow-200",
        }
      case "queued":
        return {
          label: "Queued",
          variant: "secondary" as const,
          icon: Clock,
          className: "text-blue-600 bg-blue-50 border-blue-200",
        }
      case "processing":
        return {
          label: "Processing",
          variant: "secondary" as const,
          icon: Loader2,
          className: "text-blue-600 bg-blue-50 border-blue-200",
        }
      case "completed":
        return {
          label: "Completed",
          variant: "default" as const,
          icon: CheckCircle,
          className: "text-green-600 bg-green-50 border-green-200",
        }
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          icon: XCircle,
          className: "text-red-600 bg-red-50 border-red-200",
        }
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "text-gray-600 bg-gray-50 border-gray-200",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className={`mr-1 h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
