import type React from "react"
import { format, parseISO, differenceInDays, isPast } from "date-fns"
import { AlertTriangleIcon, ShieldCheckIcon, ShieldAlertIcon } from "lucide-react"

export const getDocumentStatus = (
  expiryDate: string | null | undefined,
): {
  text: string
  Icon: React.ElementType
  colorClass: string
  tooltip?: string
} => {
  if (!expiryDate) {
    return {
      text: "No Date",
      Icon: AlertTriangleIcon,
      colorClass: "text-slate-500",
      tooltip: "Expiry date not set",
    }
  }
  const date = parseISO(expiryDate)
  const today = new Date()
  const daysUntilExpiry = differenceInDays(date, today)

  if (isPast(date)) {
    return {
      text: "Expired",
      Icon: ShieldAlertIcon,
      colorClass: "text-red-500",
      tooltip: `Expired on ${format(date, "MMM d, yyyy")}`,
    }
  }
  if (daysUntilExpiry <= 30) {
    return {
      text: "Expires Soon",
      Icon: ShieldAlertIcon,
      colorClass: "text-orange-500",
      tooltip: `Expires in ${daysUntilExpiry} day(s) on ${format(date, "MMM d, yyyy")}`,
    }
  }
  return {
    text: "Valid",
    Icon: ShieldCheckIcon,
    colorClass: "text-green-500",
    tooltip: `Valid until ${format(date, "MMM d, yyyy")}`,
  }
}
