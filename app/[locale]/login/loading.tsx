import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-1/3 mx-auto" />
      </Card>
    </div>
  )
}
