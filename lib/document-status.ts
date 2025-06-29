import type React from "react"
import { format, isPast, isFuture, parseISO, isValid, addDays } from "date-fns"
import { CheckCircle2Icon, XCircleIcon, AlertTriangleIcon, ClockIcon, HelpCircleIcon } from "lucide-react" // Added HelpCircleIcon

export const CONTRACT_STATUSES = [
  "Draft",
  "Pending Review",
  "Approved",
  "Active",
  "Completed",
  "Archived",
  "Terminated",
] as const

export type ContractStatus = (typeof CONTRACT_STATUSES)[number]

type DocumentStatus = {
  text: string
  colorClass: string
  Icon: React.ElementType
  tooltip: string
}

export function getDocumentStatus(expiryDateString: string | null): DocumentStatus {
  if (!expiryDateString) {
    return {
      text: "N/A",
      colorClass: "text-gray-500",
      Icon: ClockIcon,
      tooltip: "No expiry date provided.",
    }
  }

  const expiryDate = parseISO(expiryDateString)

  if (!isValid(expiryDate)) {
    return {
      text: "Invalid Date",
      colorClass: "text-red-500",
      Icon: XCircleIcon,
      tooltip: "The provided date is invalid.",
    }
  }

  const now = new Date()
  const threeMonthsFromNow = addDays(now, 90) // Approximately 3 months

  if (isPast(expiryDate) && expiryDate < now) {
    return {
      text: "Expired",
      colorClass: "text-red-500",
      Icon: XCircleIcon,
      tooltip: `Expired on ${format(expiryDate, "PPP")}.`,
    }
  } else if (isFuture(expiryDate) && expiryDate <= threeMonthsFromNow) {
    return {
      text: "Expiring Soon",
      colorClass: "text-orange-500",
      Icon: AlertTriangleIcon,
      tooltip: `Expires on ${format(expiryDate, "PPP")}.`,
    }
  } else if (isFuture(expiryDate) && expiryDate > threeMonthsFromNow) {
    return {
      text: "Valid",
      colorClass: "text-green-500",
      Icon: CheckCircle2Icon,
      tooltip: `Valid until ${format(expiryDate, "PPP")}.`,
    }
  } else {
    return {
      text: "Unknown",
      colorClass: "text-gray-500",
      Icon: HelpCircleIcon,
      tooltip: "Could not determine status.",
    }
  }
}
