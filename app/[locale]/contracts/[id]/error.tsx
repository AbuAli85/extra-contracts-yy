'use client' 

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // You can log the error to an error reporting service here
    console.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-2">
      <h2 className="font-semibold">Something went wrong loading the contract!</h2>
      <p>We couldn't retrieve the requested document. Please try again.</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="underline text-sm"
      >
        Try again
      </button>
    </div>
  )
}
