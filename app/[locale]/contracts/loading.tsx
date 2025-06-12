import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ContractsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 sm:py-12 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Skeleton className="h-9 w-64" /> {/* Title */}
          <Skeleton className="h-10 w-36" /> {/* Back Button */}
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" /> {/* Stat Title */}
                <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" /> {/* Stat Value */}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <Skeleton className="h-6 w-48 mb-1" /> {/* Card Title */}
                <Skeleton className="h-4 w-72" /> {/* Card Description */}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Skeleton className="h-10 w-full sm:w-64" /> {/* Search Input */}
                <Skeleton className="h-10 w-full sm:w-40" /> {/* Status Filter */}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-800">
                  <TableRow>
                    {[...Array(6)].map((_, i) => (
                      <TableHead key={i} className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {[...Array(5)].map(
                    (
                      _,
                      i, // 5 Skeleton rows
                    ) => (
                      <TableRow key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <TableCell className="px-4 py-3">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Skeleton className="h-4 w-36" />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination Controls Skeleton */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 dark:border-slate-700">
              <Skeleton className="h-4 w-48" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
