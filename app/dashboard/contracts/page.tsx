"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractReportsTable } from "@/components/dashboard/contract-reports-table"
import { useQuery } from "@tanstack/react-query"
import { getContractsData } from "@/lib/data"
import { Loader2 } from "lucide-react"

export default function DashboardContractsPage() {
  const t = useTranslations("DashboardContractsPage")

  const {
    data: contractsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["contracts"],
    queryFn: getContractsData,
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

  if (!contractsData?.success || !contractsData.data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorFetchingData")}: {contractsData?.message || t("unknownError")}
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
          <ContractReportsTable contracts={contractsData.data} />
        </CardContent>
      </Card>
    </div>
  )
}
