import { ContractsList } from "@/components/contracts-list"

export default function ContractsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <p className="text-gray-600 mt-2">Manage and generate your bilingual contracts</p>
      </div>
      <ContractsList />
    </div>
  )
}
