import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractGeneratorForm } from "@/components/contract-generator-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default function GenerateContractPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/contracts">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Contracts
          </Link>
        </Button>
        <h1 className="ml-auto text-2xl font-semibold">Generate New Contract</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractGeneratorForm />
        </CardContent>
      </Card>
    </main>
  )
}
