import { ContractsList } from "@/components/contracts-list"
import { ContractsDashboardWidget } from "@/components/contracts-dashboard-widget"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ContractsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contracts</h1>
          <p className="text-gray-600 mt-2">Manage and track your contract generation requests</p>
        </div>
        <Link href="/generate-contract">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Contract
          </Button>
        </Link>
      </div>

      <ContractsDashboardWidget />
      <ContractsList />
    </div>
  )
}
