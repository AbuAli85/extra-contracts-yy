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
      <p>Job Title: {contract.job_title}</p>
      {/* Add more contract details here */}
    </div>
  )
}
