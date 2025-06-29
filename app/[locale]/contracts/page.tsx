import { ContractsList } from "@/components/contracts-list"

export default function ContractsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">Manage and generate your contracts with real-time status updates.</p>
        </div>

        <ContractsList />
      </div>
    </div>
  )
}
