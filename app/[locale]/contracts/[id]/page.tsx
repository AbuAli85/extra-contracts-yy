import { getContract } from "@/lib/data"

interface Props {
  params: {
    id: string
    locale: string
  }
}

export default async function ContractPage({ params: { id, locale } }: Props) {
  const contract = await getContract(id)

  if (!contract) {
    return <div>Contract not found</div>
  }

  const promoterName =
    contract.promoter_name_en ||
    (locale === "ar"
      ? contract.promoters?.name_ar || contract.promoters?.name_en
      : contract.promoters?.name_en || contract.promoters?.name_ar) ||
    "N/A"

  return (
    <div>
      <h1>Contract Details</h1>
      <p>ID: {contract.id}</p>
      <p>Promoter: {promoterName}</p>
      {/* Add more contract details here */}
    </div>
  )
}
