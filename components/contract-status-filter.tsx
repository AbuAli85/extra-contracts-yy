"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export const ContractStatusFilter = () => {
  const t = useTranslations("ContractStatusFilter")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select onValueChange={handleStatusChange} defaultValue={searchParams.get("status")?.toString() || "all"}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("filterByStatus")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("allStatuses")}</SelectItem>
        <SelectItem value="Draft">{t("statusDraft")}</SelectItem>
        <SelectItem value="Pending Review">{t("statusPendingReview")}</SelectItem>
        <SelectItem value="Approved">{t("statusApproved")}</SelectItem>
        <SelectItem value="Signed">{t("statusSigned")}</SelectItem>
        <SelectItem value="Active">{t("statusActive")}</SelectItem>
        <SelectItem value="Completed">{t("statusCompleted")}</SelectItem>
        <SelectItem value="Archived">{t("statusArchived")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
