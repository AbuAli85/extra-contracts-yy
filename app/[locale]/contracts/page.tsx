import { ContractsList } from "@/components/contracts-list"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"

export default function ContractsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">Manage and generate your contracts with real-time updates.</p>
        </div>
      </div>

      <ContractsDashboardWidget />
      <ContractsList />
    </div>
  )
}
