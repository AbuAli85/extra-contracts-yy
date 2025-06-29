import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function UsersLoading() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-2xl font-semibold">
        <Skeleton className="h-8 w-48" />
      </h1>
      <Card className="p-4">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-[400px] w-full" />
      </Card>
    </main>
  )
}
