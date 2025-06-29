import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircleIcon, FileTextIcon } from "lucide-react"
import { getContracts } from "@/lib/data"
import { ContractSearchInput } from "@/components/contract-search-input"
import { ContractStatusFilter } from "@/components/contract-status-filter"
import { format } from "date-fns"
import { LifecycleStatusIndicator } from "@/components/lifecycle-status-indicator"

interface ContractsPageProps {
  searchParams: {
    q?: string
    status?: string
  }
}

export default async function ContractsPage({ searchParams }: ContractsPageProps) {
  const contracts = await getContracts(searchParams.q, searchParams.status)

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <Button asChild className="ml-auto">
          <Link href="/generate-contract">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            New Contract
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <ContractSearchInput placeholder="Search by party or promoter..." />
            <ContractStatusFilter />
          </div>
          {contracts.length === 0 ? (
            <div className="text-center py-8">
              <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No contracts found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {contracts.map((contract) => (
                <Link key={contract.id} href={`/contracts/${contract.id}`} className="block">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="grid gap-1">
                      <h3 className="font-semibold text-lg">
                        {contract.contract_id} - {contract.contract_type}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Parties: {contract.first_party_name_en} & {contract.second_party_name_en}
                      </p>
                      <p className="text-sm text-muted-foreground">Promoter: {contract.promoter_name_en}</p>
                      <p className="text-xs text-muted-foreground">
                        Dates: {format(new Date(contract.start_date), "PPP")} -{" "}
                        {format(new Date(contract.end_date), "PPP")}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center gap-2">
                      <LifecycleStatusIndicator status={contract.status} />
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
