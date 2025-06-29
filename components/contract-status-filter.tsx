"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

interface ContractStatusFilterProps {
  onSelectStatus: (status: string | null) => void
  selectedStatus?: string | null
}

export function ContractStatusFilter({ onSelectStatus, selectedStatus }: ContractStatusFilterProps) {
  const t = useTranslations("ContractStatusFilter")

  const statuses = ["All", "Draft", "Pending Review", "Active", "Completed", "Terminated"]

  const displayStatus = selectedStatus && selectedStatus !== "All" ? selectedStatus : t("filterByStatus")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          {displayStatus}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statuses.map((status) => (
          <DropdownMenuItem key={status} onClick={() => onSelectStatus(status)}>
            {t(status.replace(/\s/g, "") as any)} {/* Translate status names */}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
