import { getContract } from "@/lib/data"
import { Suspense } from "react"

interface Props {
  params: {
    id: string
    locale: string
  }
}

async function ContractContent({ params: { id, locale } }: Props) {
  const contract = await getContract(id)

  if (!contract) {
    return <div>Contract not found</div>
  }

  return (
    <div>
      <h1>Contract Details</h1>
      <p>ID: {contract.id}</p>
      <p>Name: {contract.name}</p>
      {/* Add more contract details here */}
    </div>
  )
}

export default function ContractPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="flex justify-center p-4">Loading...</div>}>
      {/* @ts-expect-error Async Server Component */}
      <ContractContent params={params} />
    </Suspense>
  )
}
