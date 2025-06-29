"use client"

import { Button } from "@/components/ui/button"
import { FrownIcon } from "lucide-react"
import { useEffect } from "react"

export default function AnalyticsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-4 py-10">
      <FrownIcon className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
      <p className="text-muted-foreground">Could not load analytics data.</p>
      <p className="text-sm text-muted-foreground">Error: {error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
