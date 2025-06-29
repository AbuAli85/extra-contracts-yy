import { cn } from "@/lib/utils"

interface LifecycleStatusIndicatorProps {
  status: string
  className?: string
}

export function LifecycleStatusIndicator({ status, className }: LifecycleStatusIndicatorProps) {
  let colorClass = "bg-gray-400" // Default color

  switch (status) {
    case "Draft":
      colorClass = "bg-gray-400"
      break
    case "Pending Review":
      colorClass = "bg-yellow-500"
      break
    case "Active":
      colorClass = "bg-green-500"
      break
    case "Completed":
      colorClass = "bg-blue-500"
      break
    case "Terminated":
      colorClass = "bg-red-500"
      break
    default:
      colorClass = "bg-gray-400"
      break
  }

  return <span className={cn("h-2 w-2 rounded-full", colorClass, className)} />
}
