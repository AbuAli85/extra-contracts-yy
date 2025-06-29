import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractGeneratorForm } from "@/components/contract-generator-form"
import { getParties } from "@/app/actions/parties"
import { getPromoters } from "@/app/actions/promoters"
import { getContractById } from "@/app/actions/contracts"

interface EditContractPageProps {
  params: {
    id: string
  }
}

export default async function EditContractPage({ params }: EditContractPageProps) {
  const t = await getTranslations("EditContractPage")
  const { data: parties, error: partiesError } = await getParties()
  const { data: promoters, error: promotersError } = await getPromoters()
  const { data: contract, error: contractError } = await getContractById(params.id)

  if (partiesError || promotersError || contractError || !contract) {
    console.error("Error fetching data for contract editor:", partiesError || promotersError || contractError)
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("editContract")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("contractDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractGeneratorForm parties={parties || []} promoters={promoters || []} initialData={contract} />
        </CardContent>
      </Card>
    </div>
  )
}
