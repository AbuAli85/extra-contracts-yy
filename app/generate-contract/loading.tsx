import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="ml-2 text-sm">Preparing form...</p>
    </div>
  )
}
