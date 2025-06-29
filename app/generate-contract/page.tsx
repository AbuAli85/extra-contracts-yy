import { redirect } from "next/navigation"

export default async function GenerateContractPage() {
  // Redirect to the default locale version if accessed directly without locale
  redirect("/en/generate-contract")
  return null

  // const t = await getTranslations("GenerateContractPage")
  // const { data: parties, error: partiesError } = await getParties()
  // const { data: promoters, error: promotersError } = await getPromoters()

  // if (partiesError || promotersError) {
  //   console.error("Error fetching data for contract generator:", partiesError || promotersError)
  //   return <div className="text-red-500">{t("errorLoadingData")}</div>
  // }

  // return (
  //   <div className="container mx-auto py-8 px-4 md:px-6">
  //     <h1 className="text-3xl font-bold mb-6">{t("generateNewContract")}</h1>
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>{t("contractDetails")}</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <ContractGeneratorForm parties={parties || []} promoters={promoters || []} />
  //       </CardContent>
  //     </Card>
  //   </div>
  // )
}
