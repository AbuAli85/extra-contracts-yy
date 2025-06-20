'use client' // This directive is mandatory for error components.

import { useEffect } from 'react'

export default function ContractsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // For your reference (AbuAli85), this logs the specific error to the developer console.
    // Generated at: 2025-06-20 09:55:34 UTC
    console.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-2">
      <h2 className="font-semibold">An Error Occurred</h2>
      <p>We ran into a problem while trying to load the requested content.</p>
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
