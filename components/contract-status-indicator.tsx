import { Badge } from "@/components/ui/badge"
import { Clock, Loader2, CheckCircle, XCircle, PlayCircle } from "lucide-react"

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
          className: "text-gray-600",
        }
      case "queued":
        return {
          label: "Queued",
          variant: "outline" as const,
          icon: PlayCircle,
          className: "text-blue-600",
        }
      case "processing":
        return {
          label: "Processing",
          variant: "default" as const,
          icon: Loader2,
          className: "text-blue-600 animate-spin",
        }
      case "completed":
        return {
          label: "Completed",
          variant: "default" as const,
          icon: CheckCircle,
          className: "text-green-600 bg-green-50 text-green-700 border-green-200",
        }
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          icon: XCircle,
          className: "text-red-600",
        }
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          icon: Clock,
          className: "text-gray-600",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
