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
    // This logs the specific error to your browser's console for debugging.
    // Generated for AbuAli85 at: 2025-06-20 09:59:40 UTC
    console.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-2">
      <h2 className="font-semibold">Error Loading Editor</h2>
      <p>We ran into a problem while preparing the editor. Please try again.</p>
      <button
        onClick={
          // This function will attempt to re-render the page.
          () => reset()
        }
        className="underline text-sm"
      >
        Try Again
      </button>
    </div>
  )
}
