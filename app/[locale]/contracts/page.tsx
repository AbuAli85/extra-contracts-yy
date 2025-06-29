import { ContractsList } from "@/components/contracts-list"

export default function ContractsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <p className="text-gray-600 mt-2">Manage and generate your contracts with real-time status updates.</p>
      </div>
      <ContractsList />
    </div>
  )
}
