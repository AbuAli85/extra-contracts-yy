"use client" // Placeholder page, might use client features later

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon, Construction } from "lucide-react"
import { useParams } from "next/navigation"

export default function EditPromoterPage() {
  const params = useParams()
  const promoterId = params.id as string

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Edit Promoter</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Promoter ID: <span className="font-mono">{promoterId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Construction className="mx-auto h-16 w-16 text-amber-500 mb-4" />
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Editing functionality for promoters will be implemented here.
          </p>
          <Link href={`/manage-promoters/${promoterId}`} legacyBehavior passHref>
            <Button variant="outline" className="mr-2">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Promoter Details
            </Button>
          </Link>
          <Link href="/manage-promoters" legacyBehavior passHref>
            <Button variant="secondary">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Promoter List
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
