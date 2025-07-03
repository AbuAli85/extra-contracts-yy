import { getContract } from "@/lib/data"
import { ManualErrorBoundary } from "@/components/ManualErrorBoundary"

interface Props {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function ContractPage({ params }: Props) {
  const { id, locale } = await params
  const contract = await getContract(id)

  if (!contract) {
    return <div>Contract not found</div>
  }

  const promoterName = contract.promoters && contract.promoters.length > 0 && contract.promoters[0]
    ? (locale === "ar" 
        ? contract.promoters[0].name_ar || contract.promoters[0].name_en
        : contract.promoters[0].name_en || contract.promoters[0].name_ar)
    : "N/A"

  return (
    <ManualErrorBoundary>
      <div>
        <h1>Contract Details</h1>
        <p>ID: {contract.id}</p>
        <p>Promoter: {promoterName}</p>
        {/* Add more contract details here */}
      </div>
    </ManualErrorBoundary>
  )
}
