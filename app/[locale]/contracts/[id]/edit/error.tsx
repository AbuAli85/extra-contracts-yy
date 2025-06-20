'use client' // This directive is mandatory for error components.

import { useEffect } from 'react'

export default function EditContractError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // For AbuAli85 - Clearing the .next cache and recreating this file.
    // Generated at: 2025-06-20 10:12:09 UTC
    console.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-2">
      <h2 className="font-semibold">Error in Editor</h2>
      <p>A problem occurred while loading the contract editor.</p>
      <button
        onClick={
          // Attempt to recover by re-rendering this page segment.
          () => reset()
        }
        className="underline text-sm"
      >
        Try Again
      </button>
    </div>
  )
}
