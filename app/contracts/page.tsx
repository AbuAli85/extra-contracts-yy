import { getTranslations } from "next-intl/server"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getContracts } from "@/app/actions/contracts"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function ContractsPage() {
  const t = await getTranslations("ContractsPage")
  const { data: contracts, error } = await getContracts()

  if (error) {
    console.error("Error fetching contracts:", error)
    return <div className="text-red-500">{t("errorLoadingContracts")}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("contractsTitle")}</h1>
        <Button asChild>
          <Link href="/generate-contract">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("newContract")}
          </Link>
        </Button>
      </div>

      {contracts && contracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">{t("noContractsYet")}</p>
          <Button asChild className="mt-4">
            <Link href="/generate-contract">{t("createFirstContract")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contracts?.map((contract) => (
            <Card key={contract.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{contract.contract_name}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>
                    {t("id")}: {contract.contract_id}
                  </span>
                  <Badge variant="secondary">{contract.status}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">{t("type")}:</span> {contract.contract_type}
                  </p>
                  <p>
                    <span className="font-medium">{t("partyA")}:</span> {contract.parties_a?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">{t("promoter")}:</span> {contract.promoters?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">{t("effectiveDate")}:</span>{" "}
                    {contract.effective_date ? format(new Date(contract.effective_date), "PPP") : "N/A"}
                  </p>
                </div>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href={`/contracts/${contract.id}`}>{t("viewDetails")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
