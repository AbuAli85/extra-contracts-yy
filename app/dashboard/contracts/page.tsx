"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractReportsTable } from "@/components/dashboard/contract-reports-table"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import type { Contract } from "@/lib/types"

async function fetchContracts(): Promise<Contract[]> {
  const response = await fetch('/api/contracts')
  if (!response.ok) {
    throw new Error('Failed to fetch contracts')
  }
  return response.json()
}

export default function DashboardContractsPage() {
  const t = useTranslations("DashboardContractsPage")

  const {
    data: contractsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingContracts")}</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorLoading")}: {error?.message || t("unknownError")}
      </div>
    )
  }

  if (!contractsData) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorFetchingData")}: {t("unknownError")}
      </div>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractReportsTable contracts={contractsData} />
        </CardContent>
      </Card>
    </div>
  )
}
