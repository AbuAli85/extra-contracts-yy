import { cn } from "@/lib/utils"

interface LifecycleStatusIndicatorProps {
  status: string
}

export const LifecycleStatusIndicator = ({ status }: LifecycleStatusIndicatorProps) => {
  let colorClass = ""
  switch (status.toLowerCase()) {
    case "draft":
      colorClass = "bg-gray-500"
      break
    case "pending review":
      colorClass = "bg-yellow-500"
      break
    case "approved":
      colorClass = "bg-blue-500"
      break
    case "signed":
      colorClass = "bg-purple-500"
      break
    case "active":
      colorClass = "bg-green-500"
      break
    case "completed":
      colorClass = "bg-teal-500"
      break
    case "archived":
      colorClass = "bg-red-500"
      break
    default:
      colorClass = "bg-gray-400"
  }

  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white", colorClass)}
    >
      {status}
    </span>
  )
}
