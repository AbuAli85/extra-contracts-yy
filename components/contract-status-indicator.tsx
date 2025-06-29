import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, Loader2, FileText } from "lucide-react"

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
          icon: <FileText className="h-3 w-3" />,
        }
      case "queued":
        return {
          label: "Queued",
          variant: "outline" as const,
          icon: <Clock className="h-3 w-3" />,
        }
      case "processing":
        return {
          label: "Processing",
          variant: "default" as const,
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
        }
      case "completed":
        return {
          label: "Completed",
          variant: "default" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        }
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          icon: <AlertCircle className="h-3 w-3" />,
        }
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          icon: <FileText className="h-3 w-3" />,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  )
}
