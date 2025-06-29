"use client"

import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"

interface ContractSearchInputProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

export function ContractSearchInput({ searchTerm, onSearchChange, placeholder }: ContractSearchInputProps) {
  const t = useTranslations("ContractSearchInput")
  const currentPlaceholder = placeholder || t("searchContracts")

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={currentPlaceholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}
