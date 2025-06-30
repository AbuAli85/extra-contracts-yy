import { Badge } from "@/components/ui/badge"
import { CheckCircle, CalendarClock, AlertCircle, CalendarX2 } from "lucide-react"
import { isFuture, isPast, isWithinInterval } from "date-fns"

interface LifecycleStatusIndicatorProps {
  startDate: string | Date
  endDate: string | Date
}

export default function LifecycleStatusIndicator({
  startDate,
  endDate,
}: LifecycleStatusIndicatorProps) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  let status: "Active" | "Upcoming" | "Expired" | "Invalid Dates" = "Invalid Dates"
  let Icon = AlertCircle
  let badgeClass = "bg-gray-500 text-white"

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    status = "Invalid Dates"
    Icon = AlertCircle
    badgeClass = "bg-red-100 text-red-700 border-red-300"
  } else if (isWithinInterval(now, { start, end })) {
    status = "Active"
    Icon = CheckCircle
    badgeClass = "bg-green-100 text-green-700 border-green-300"
  } else if (isFuture(start)) {
    status = "Upcoming"
    Icon = CalendarClock
    badgeClass = "bg-blue-100 text-blue-700 border-blue-300"
  } else if (isPast(end)) {
    status = "Expired"
    Icon = CalendarX2
    badgeClass = "bg-orange-100 text-orange-700 border-orange-300"
  }

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${badgeClass}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  )
}
