import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractGeneratorForm } from "@/components/contract-generator-form"
import { getParties } from "@/app/actions/parties"
import { getPromoters } from "@/app/actions/promoters"

export default async function GenerateContractPage() {
  const t = await getTranslations("GenerateContractPage")
  const { data: parties, error: partiesError } = await getParties()
  const { data: promoters, error: promotersError } = await getPromoters()

  if (partiesError || promotersError) {
    console.error("Error fetching data for contract generator:", partiesError || promotersError)
    return <div className="text-red-500">{t("errorLoadingData")}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t("generateNewContract")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("contractDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractGeneratorForm parties={parties || []} promoters={promoters || []} />
        </CardContent>
      </Card>
    </div>
  )
}
