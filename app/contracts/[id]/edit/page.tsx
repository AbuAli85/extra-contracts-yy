// Placeholder for Edit Contract Page
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon, Construction } from "lucide-react"

export default function EditContractPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Edit Contract</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Contract ID: <span className="font-mono">{params.id}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Construction className="mx-auto h-16 w-16 text-amber-500 mb-4" />
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            This page is under construction. Editing functionality will be implemented here.
          </p>
          <Link href={`/contracts/${params.id}`} passHref className="inline-block mr-2">
            <Button variant="outline">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Details
            </Button>
          </Link>
          <Link href="/contracts" passHref className="inline-block">
            <Button variant="secondary">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Contracts List
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
