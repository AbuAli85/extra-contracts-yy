import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon, DownloadIcon, EditIcon, MailIcon, PrinterIcon } from "lucide-react"
import { getContractById } from "@/lib/data"
import { LifecycleStatusIndicator } from "@/components/lifecycle-status-indicator"
import { format } from "date-fns"

interface ContractDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ContractDetailsPage({ params }: ContractDetailsPageProps) {
  const contract = await getContractById(params.id)

  if (!contract) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/contracts">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Contracts
          </Link>
        </Button>
        <h1 className="ml-auto text-2xl font-semibold">Contract Details</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Contract ID: {contract.contract_id}</CardTitle>
          <LifecycleStatusIndicator status={contract.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">First Party</p>
              <p className="font-medium">{contract.first_party_name_en}</p>
              <p className="text-sm text-muted-foreground">{contract.first_party_name_ar}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Second Party</p>
              <p className="font-medium">{contract.second_party_name_en}</p>
              <p className="text-sm text-muted-foreground">{contract.second_party_name_ar}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Promoter</p>
              <p className="font-medium">{contract.promoter_name_en}</p>
              <p className="text-sm text-muted-foreground">{contract.promoter_name_ar}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contract Type</p>
              <p className="font-medium">{contract.contract_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(new Date(contract.start_date), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{format(new Date(contract.end_date), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{format(new Date(contract.created_at), "PPP p")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium">{format(new Date(contract.updated_at), "PPP p")}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Contract Content (English)</h3>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contract.content_en }} />
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2 text-right">محتوى العقد (العربية)</h3>
            <div
              className="prose prose-sm max-w-none text-right"
              dangerouslySetInnerHTML={{ __html: contract.content_ar }}
              dir="rtl"
            />
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <MailIcon className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button size="sm" asChild>
              <Link href={`/edit-contract/${contract.id}`}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Contract
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
