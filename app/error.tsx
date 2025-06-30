"use client"

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error)
  return (
    <div className="space-y-2 p-4">
      <h2 className="font-semibold">Something went wrong!</h2>
      <button onClick={() => reset()} className="text-sm underline">
        Try again
      </button>
    </div>
  )
}
