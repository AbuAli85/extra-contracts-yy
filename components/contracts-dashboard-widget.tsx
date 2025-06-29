"use client"

import { useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"

export function ContractsDashboardWidget() {
  const { contracts, fetchContracts } = useContractsStore()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const stats = useMemo(() => {
    const total = contracts.length
    const pending = contracts.filter((c) => c.status === "pending").length
    const processing = contracts.filter((c) => c.status === "queued" || c.status === "processing").length
    const completed = contracts.filter((c) => c.status === "completed").length
    const failed = contracts.filter((c) => c.status === "failed").length

    return { total, pending, processing, completed, failed }
  }, [contracts])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Contract Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-2xl font-bold text-gray-600">{stats.pending}</span>
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Loader2 className="h-4 w-4 text-blue-500 mr-1 animate-spin" />
              <span className="text-2xl font-bold text-blue-600">{stats.processing}</span>
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-2xl font-bold text-red-600">{stats.failed}</span>
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {stats.processing > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center text-sm text-blue-800">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {stats.processing} contract{stats.processing > 1 ? "s" : ""} currently processing
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
