"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-lg font-medium text-muted-foreground">
        Loading contracts…
      </span>
    </div>
  )
}

