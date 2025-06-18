import { getContract } from "@/lib/data"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

interface Props {
  params: {
    id: string
    locale: string
  }
}

export default async function ContractPage({ params: { id, locale } }: Props) {
  const supabase = getSupabaseAdmin()
  const contract = await getContract(supabase, id)

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
