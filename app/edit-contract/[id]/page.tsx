import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractGeneratorForm } from "@/components/contract-generator-form"
import { getContractById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

interface EditContractPageProps {
  params: {
    id: string
  }
}

export default async function EditContractPage({ params }: EditContractPageProps) {
  const contract = await getContractById(params.id)

  if (!contract) {
    notFound()
  }

  const initialData = {
    firstPartyNameEn: contract.first_party_name_en,
    firstPartyNameAr: contract.first_party_name_ar,
    secondPartyNameEn: contract.second_party_name_en,
    secondPartyNameAr: contract.second_party_name_ar,
    promoterNameEn: contract.promoter_name_en,
    promoterNameAr: contract.promoter_name_ar,
    contractType: contract.contract_type,
    startDate: new Date(contract.start_date),
    endDate: new Date(contract.end_date),
    contentEn: contract.content_en,
    contentAr: contract.content_ar,
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/contracts/${contract.id}`}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Contract
          </Link>
        </Button>
        <h1 className="ml-auto text-2xl font-semibold">Edit Contract</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractGeneratorForm initialData={initialData} contractId={contract.id} />
        </CardContent>
      </Card>
    </main>
  )
}
