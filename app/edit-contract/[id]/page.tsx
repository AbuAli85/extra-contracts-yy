"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractGeneratorForm } from "@/components/contract-generator-form"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useContracts } from "@/hooks/use-contracts"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import type { Contract } from "@/lib/types"

export default function EditContractPage() {
  const t = useTranslations("EditContractPage")
  const params = useParams()
  const contractId = params.id as string

  const { data: contracts, isLoading, isError, error } = useContracts()
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null)

  useEffect(() => {
    if (contracts) {
      const foundContract = contracts.find((c) => c.id === contractId)
      if (foundContract) {
        setContractToEdit(foundContract)
      }
    }
  }, [contracts, contractId])

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingContract")}</span>
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

  if (!contractToEdit) {
    return <div className="flex min-h-[80vh] items-center justify-center text-gray-500">{t("contractNotFound")}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractGeneratorForm contract={contractToEdit} />
        </CardContent>
      </Card>
    </div>
  )
}
