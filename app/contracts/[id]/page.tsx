import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

import { getContractById } from "@/app/actions/contracts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Edit } from "lucide-react"

interface ContractDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ContractDetailsPage({ params }: ContractDetailsPageProps) {
  const t = await getTranslations("ContractDetailsPage")
  const { data: contract, error } = await getContractById(params.id)

  if (error || !contract) {
    console.error("Error fetching contract:", error)
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">{contract.contract_name}</CardTitle>
            <p className="text-muted-foreground">
              {t("contractId")}: {contract.contract_id}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{contract.status}</Badge>
            <Badge variant="outline">{contract.contract_type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{t("partiesInvolved")}</h3>
              <p>
                <span className="font-medium">{t("partyA")}:</span> {contract.parties_a?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">{t("partyB")}:</span> {contract.parties_b?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">{t("promoter")}:</span> {contract.promoters?.name || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t("keyDates")}</h3>
              <p>
                <span className="font-medium">{t("effectiveDate")}:</span>{" "}
                {contract.effective_date ? new Date(contract.effective_date).toLocaleDateString() : "N/A"}
              </p>
              <p>
                <span className="font-medium">{t("terminationDate")}:</span>{" "}
                {contract.termination_date ? new Date(contract.termination_date).toLocaleDateString() : "N/A"}
              </p>
              <p>
                <span className="font-medium">{t("createdAt")}:</span>{" "}
                {new Date(contract.created_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">{t("lastUpdated")}:</span>{" "}
                {new Date(contract.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2">{t("financialDetails")}</h3>
            <p>
              <span className="font-medium">{t("contractValue")}:</span>{" "}
              {contract.contract_value ? `$${contract.contract_value.toLocaleString()}` : "N/A"}
            </p>
            <p>
              <span className="font-medium">{t("paymentTerms")}:</span> {contract.payment_terms || "N/A"}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2">{t("contractContent")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-md mb-1">{t("englishVersion")}</h4>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{contract.content_english || t("noContentAvailable")}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-md mb-1">{t("spanishVersion")}</h4>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{contract.content_spanish || t("noContentAvailable")}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={`/edit-contract/${contract.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                {t("editContract")}
              </Link>
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t("downloadPdf")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
