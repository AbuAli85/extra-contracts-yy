import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function AnalyticsLoading() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-64 w-full" />
        </Card>
        <Card className="p-4">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
      <Card className="p-4">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-48 w-full" />
      </Card>
    </main>
  )
}
