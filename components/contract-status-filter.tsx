"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"

interface ContractStatusFilterProps {
  selectedStatus: string
  onFilterChange: (status: string) => void
  statuses: string[]
  disabled?: boolean
}

export function ContractStatusFilter({
  selectedStatus,
  onFilterChange,
  statuses,
  disabled,
}: ContractStatusFilterProps) {
  const t = useTranslations("ContractStatusFilter")

  return (
    <Select onValueChange={onFilterChange} value={selectedStatus} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("filterByStatus")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">{t("allStatuses")}</SelectItem>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
