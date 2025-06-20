'use client' // This directive is mandatory for error components.

import { useEffect } from 'react'

export default function ContractSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // For AbuAli85 - This error boundary is now at the parent [id] level.
    // It will catch errors for the view, edit, and any other sub-pages.
    // Generated at: 2025-06-20 10:13:27 UTC
    console.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-2">
      <h2 className="font-semibold">An Error Occurred</h2>
      <p>A problem was encountered within this contract section. Please try again.</p>
      <button
        onClick={
          // Attempt to recover by re-rendering this segment of the application.
          () => reset()
        }
        className="underline text-sm"
      >
        Try Again
      </button>
    </div>
  )
}
