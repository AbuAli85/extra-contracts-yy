"use client"
import { AlertTriangle } from "lucide-react"

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <p className="mt-2 text-sm text-destructive">Failed to load contracts.</p>
      <button onClick={reset} className="mt-4 text-sm text-primary underline">
        Try again
      </button>
    </div>
  )
}
