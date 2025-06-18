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

  return (
    <div>
      <h1>Contract Details</h1>
      <p>ID: {contract.id}</p>
      <p>
        Promoter:{" "}
        {contract.promoter_name_en || contract.promoter?.name || "N/A"}
      </p>
      {/* Add more contract details here */}
    </div>
  )
}
