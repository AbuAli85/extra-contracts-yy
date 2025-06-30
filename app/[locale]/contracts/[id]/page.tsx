"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useContracts } from "@/hooks/use-contracts"
import type { Contract } from "@/lib/types"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { LifecycleStatusIndicator } from "@/components/lifecycle-status-indicator"
import { Loader2 } from "lucide-react"

export default function ContractDetailPage() {
  const params = useParams()
  const contractId = params.id as string
  const t = useTranslations("ContractDetail")

  const { data: contracts, isLoading, isError, error } = useContracts()
  const [contract, setContract] = useState<any>(null)

  useEffect(() => {
    if (contracts) {
      const foundContract = contracts.find((c: Contract) => c.id === contractId)
      setContract(foundContract)
    }
  }, [contracts, contractId])

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loading")}</span>
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

  if (!contract) {
    return <div className="flex min-h-[80vh] items-center justify-center text-gray-500">{t("contractNotFound")}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t("contractDetails")} - {contract.contract_name}
            <div className="flex items-center gap-2">
              <LifecycleStatusIndicator status={contract.status} />
              <Badge variant="secondary">{contract.status}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <p>
              <strong>{t("contractId")}:</strong> {contract.contract_id}
            </p>
            <p>
              <strong>{t("contractType")}:</strong> {contract.contract_type}
            </p>
            <p>
              <strong>{t("partyA")}:</strong> {contract.parties_a?.name || "N/A"}
            </p>
            <p>
              <strong>{t("partyB")}:</strong> {contract.parties_b?.name || "N/A"}
            </p>
            <p>
              <strong>{t("promoter")}:</strong> {contract.promoters?.name || "N/A"}
            </p>
            <p>
              <strong>{t("effectiveDate")}:</strong>{" "}
              {contract.effective_date ? format(new Date(contract.effective_date), "PPP") : "N/A"}
            </p>
            <p>
              <strong>{t("terminationDate")}:</strong>{" "}
              {contract.termination_date ? format(new Date(contract.termination_date), "PPP") : "N/A"}
            </p>
            <p>
              <strong>{t("contractValue")}:</strong>{" "}
              {contract.contract_value ? `$${contract.contract_value.toLocaleString()}` : "N/A"}
            </p>
            <p>
              <strong>{t("paymentTerms")}:</strong> {contract.payment_terms || "N/A"}
            </p>
            <p>
              <strong>{t("createdAt")}:</strong>{" "}
              {contract.created_at ? format(new Date(contract.created_at), "PPP p") : "N/A"}
            </p>
            <p>
              <strong>{t("updatedAt")}:</strong>{" "}
              {contract.updated_at ? format(new Date(contract.updated_at), "PPP p") : "N/A"}
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">{t("contentEnglish")}</h3>
              <div className="prose max-w-none rounded-md border p-4 text-sm">
                <p>{contract.content_english}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 text-lg font-semibold">{t("contentSpanish")}</h3>
              <div className="prose max-w-none rounded-md border p-4 text-sm">
                <p>{contract.content_spanish}</p>
              </div>
            </div>
          </div>

          <div className="col-span-full flex justify-end gap-2">
            <Button variant="outline">{t("editContract")}</Button>
            <Button>{t("downloadPdf")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
