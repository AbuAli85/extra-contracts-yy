import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function PromoterDetailsLoading() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="ml-auto h-8 w-48" />
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>

        <Skeleton className="h-0.5 w-full" />

        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-48 w-full" />
        </div>

        <Skeleton className="h-0.5 w-full" />

        <div className="flex flex-wrap gap-2 justify-end">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </Card>
    </main>
  )
}
