'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-4 text-center space-y-2">
      <h2 className="font-semibold">Something went wrong.</h2>
      <button onClick={reset} className="underline text-sm">Try again</button>
    </div>
  )
}
