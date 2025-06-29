import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Loader2, PlayCircle } from "lucide-react"

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
          className: "text-gray-600",
        }
      case "queued":
        return {
          variant: "outline" as const,
          icon: PlayCircle,
          label: "Queued",
          className: "text-blue-600",
        }
      case "processing":
        return {
          variant: "outline" as const,
          icon: Loader2,
          label: "Processing",
          className: "text-yellow-600",
          animate: true,
        }
      case "completed":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Completed",
          className: "text-green-600 bg-green-50",
        }
      case "failed":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Failed",
          className: "text-red-600",
        }
      default:
        return {
          variant: "secondary" as const,
          icon: Clock,
          label: "Unknown",
          className: "text-gray-600",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className={`h-3 w-3 mr-1 ${config.animate ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
