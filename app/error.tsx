"use client"

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error)
  return (
    <div className="p-4 space-y-2">
      <h2 className="font-semibold">Something went wrong!</h2>
      <button onClick={() => reset()} className="underline text-sm">Try again</button>
    </div>
  )
}
