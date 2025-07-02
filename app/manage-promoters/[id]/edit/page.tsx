"use client" // Placeholder page, might use client features later

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon, Construction } from "lucide-react"
import { useParams } from "next/navigation"

export default function EditPromoterPage() {
  const params = useParams()
  const promoterId = params.id as string

  // Debug: Log if promoterId is undefined
  if (!promoterId) {
    console.warn("🔍 [Navigation Debug] promoterId is undefined in edit page", { params })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Edit Promoter
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Promoter ID: <span className="font-mono">{promoterId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Construction className="mx-auto mb-4 h-16 w-16 text-amber-500" />
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Editing functionality for promoters will be implemented here.
          </p>
          <Button 
            asChild 
            variant="outline" 
            className="mr-2"
            disabled={!promoterId}
          >
            <Link href={promoterId ? `/manage-promoters/${promoterId}` : "#"}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Promoter Details
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/manage-promoters">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Promoter List
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
