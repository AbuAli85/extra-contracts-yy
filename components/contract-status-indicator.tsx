import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Loader2, FileText, XCircle } from "lucide-react"

interface ContractStatusIndicatorProps {
  status: "pending" | "queued" | "processing" | "completed" | "failed"
  showIcon?: boolean
}

export function ContractStatusIndicator({ status, showIcon = true }: ContractStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          variant: "secondary" as const,
          icon: FileText,
          label: "Pending",
          className: "bg-gray-100 text-gray-700 border-gray-200",
        }
      case "queued":
        return {
          variant: "outline" as const,
          icon: Clock,
          label: "Queued",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        }
      case "processing":
        return {
          variant: "outline" as const,
          icon: Loader2,
          label: "Processing",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
          animate: true,
        }
      case "completed":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Completed",
          className: "bg-green-50 text-green-700 border-green-200",
        }
      case "failed":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Failed",
          className: "bg-red-50 text-red-700 border-red-200",
        }
      default:
        return {
          variant: "secondary" as const,
          icon: FileText,
          label: "Unknown",
          className: "bg-gray-100 text-gray-700 border-gray-200",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      {showIcon && <Icon className={`h-3 w-3 ${config.animate ? "animate-spin" : ""}`} />}
      {config.label}
    </Badge>
  )
}
