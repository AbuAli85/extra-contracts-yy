"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"

interface ContractSearchInputProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  placeholder?: string
}

export function ContractSearchInput({ searchTerm, onSearchChange, placeholder }: ContractSearchInputProps) {
  const t = useTranslations("ContractSearchInput")
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder || t("searchContracts")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}
