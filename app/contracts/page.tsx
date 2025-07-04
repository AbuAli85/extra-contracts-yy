"use client"

import type React from "react"
import { supabase } from "@/lib/supabase"
import type { ContractRecord } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowLeftIcon,
  FileTextIcon,
  CheckCircle2Icon,
  ClockIcon,
  ArchiveIcon,
  PlusIcon,
  BarChart3Icon,
} from "lucide-react"
import { format, parseISO, isWithinInterval, isFuture, isPast } from "date-fns"
import ContractStatusFilter from "@/components/contract-status-filter"
import ContractSearchInput from "@/components/contract-search-input"
import LifecycleStatusIndicator from "@/components/lifecycle-status-indicator"
import { EnhancedStatusBadge } from "@/components/enhanced-status-badge"
import { ContractActions } from "@/components/contract-actions"
import { ContractsAnalyticsDashboard } from "@/components/contracts-analytics"
import { BulkOperations } from "@/components/bulk-operations"
import { useState } from "react"

interface SummaryStats {
  total: number
  active: number
  upcoming: number
  expired: number
  errors: number
}

export default async function ContractsListPage({
  searchParams,
}: {
  searchParams?: { status?: string; q?: string; page?: string; view?: string }
}) {
  const generationStatusFilter = searchParams?.status
  const searchQuery = searchParams?.q
  const currentPage = Number(searchParams?.page || 1)
  const viewMode = searchParams?.view || "table" // 'table' or 'analytics'
  const ITEMS_PER_PAGE = 10

  // --- Data Fetching ---
  let query = supabase
    .from("contracts")
    .select(
      `
      id, created_at, status, google_doc_url, error_details, contract_start_date, contract_end_date,
      employer:parties!contracts_employer_id_fkey(id,name_en,name_ar),
      client:parties!contracts_client_id_fkey(id,name_en,name_ar),
      promoters(id,name_en,name_ar)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)

  if (generationStatusFilter && generationStatusFilter !== "all") {
    query = query.eq("status", generationStatusFilter)
  }

  if (searchQuery) {
    query = query.or(
      `employer.name_en.ilike.%${searchQuery}%,employer.name_ar.ilike.%${searchQuery}%,client.name_en.ilike.%${searchQuery}%,client.name_ar.ilike.%${searchQuery}%,promoters.name_en.ilike.%${searchQuery}%,promoters.name_ar.ilike.%${searchQuery}%`,
    )
  }

  const { data, error, count } = await query
  const contracts: ContractRecord[] = data || [] // Type should include start/end dates
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  // --- Summary Stats (simplified for this example, can be optimized) ---
  const { data: allContractsDataForStats, error: allContractsErrorStats } = await supabase
    .from("contracts")
    .select("status, contract_start_date, contract_end_date")

  const summaryStats: SummaryStats = { total: 0, active: 0, upcoming: 0, expired: 0, errors: 0 }
  if (!allContractsErrorStats && allContractsDataForStats) {
    summaryStats.total = allContractsDataForStats.length
    const now = new Date()
    allContractsDataForStats.forEach((c) => {
      if (c.status?.toUpperCase() === "GENERATION_ERROR") summaryStats.errors++
      try {
        const start = parseISO(c.contract_start_date!)
        const end = parseISO(c.contract_end_date!)
        if (isWithinInterval(now, { start, end })) summaryStats.active++
        else if (isFuture(start)) summaryStats.upcoming++
        else if (isPast(end)) summaryStats.expired++
      } catch (e) {
        /* handle invalid dates if necessary */
      }
    })
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not fetch contracts: {error.message}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/">
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ContractsManagement
      initialContracts={contracts}
      initialCount={count || 0}
      totalPages={totalPages}
      currentPage={currentPage}
      summaryStats={summaryStats}
      searchParams={searchParams}
    />
  )
}

// Client component for interactive features
function ContractsManagement({
  initialContracts,
  initialCount,
  totalPages,
  currentPage,
  summaryStats,
  searchParams,
}: {
  initialContracts: ContractRecord[]
  initialCount: number
  totalPages: number
  currentPage: number
  summaryStats: SummaryStats
  searchParams?: { status?: string; q?: string; page?: string; view?: string }
}) {
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [contracts, setContracts] = useState(initialContracts)
  const viewMode = searchParams?.view || "table"

  const handleSelectContract = (contractId: string, isSelected: boolean) => {
    setSelectedContracts(prev => 
      isSelected 
        ? [...prev, contractId]
        : prev.filter(id => id !== contractId)
    )
  }

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedContracts(isSelected ? contracts.map(c => c.id) : [])
  }

  const handleBulkAction = async (action: string, contractIds: string[]) => {
    // Handle bulk operations
    console.log(`Bulk ${action} for contracts:`, contractIds)
    // Add your bulk operation logic here
    setSelectedContracts([])
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900 sm:py-12">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Contract Management
          </h1>
          <div className="flex gap-2">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href="/generate-contract">
                <PlusIcon className="mr-2 h-4 w-4" /> New Contract
              </Link>
            </Button>
            <Button 
              asChild 
              variant={viewMode === "analytics" ? "default" : "outline"} 
              className="w-full sm:w-auto"
            >
              <Link href={`/contracts?${new URLSearchParams({
                ...searchParams,
                view: viewMode === "analytics" ? "table" : "analytics"
              }).toString()}`}>
                <BarChart3Icon className="mr-2 h-4 w-4" /> 
                {viewMode === "analytics" ? "Table View" : "Analytics"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Analytics View */}
        {viewMode === "analytics" && (
          <ContractsAnalyticsDashboard 
            contracts={contracts}
            summaryStats={summaryStats}
          />
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Contracts",
                  value: summaryStats.total,
                  Icon: FileTextIcon,
                  color: "text-blue-500",
                },
                {
                  title: "Active",
                  value: summaryStats.active,
                  Icon: CheckCircle2Icon,
                  color: "text-green-500",
                },
                {
                  title: "Upcoming",
                  value: summaryStats.upcoming,
                  Icon: ClockIcon,
                  color: "text-sky-500",
                },
                {
                  title: "Expired",
                  value: summaryStats.expired,
                  Icon: ArchiveIcon,
                  color: "text-orange-500",
                },
              ].map((stat) => (
                <Card key={stat.title} className="shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {stat.title}
                    </CardTitle>
                    <stat.Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-lg">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Contracts Log
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                      Manage and monitor all contract information.
                    </CardDescription>
                  </div>
                  <div className="flex w-full flex-col items-center gap-3 sm:flex-row md:w-auto">
                    <ContractSearchInput />
                    <ContractStatusFilter />
                  </div>
                </div>
                
                {/* Bulk Operations */}
                {selectedContracts.length > 0 && (
                  <BulkOperations
                    selectedContracts={selectedContracts}
                    onBulkAction={handleBulkAction}
                    onClearSelection={() => setSelectedContracts([])}
                  />
                )}
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader className="bg-slate-50 dark:bg-slate-800">
                      <TableRow>
                        <TableHead className="px-4 py-3 w-12">
                          <input
                            type="checkbox"
                            checked={selectedContracts.length === contracts.length && contracts.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Lifecycle Status
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Parties
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Promoter
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Dates (Start - End)
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Generation Status
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {contracts.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-32 text-center text-slate-500 dark:text-slate-400"
                          >
                            No contracts found. Try adjusting your search or filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        contracts.map((contract) => (
                          <TableRow
                            key={contract.id}
                            className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                          >
                            <TableCell className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedContracts.includes(contract.id)}
                                onChange={(e) => handleSelectContract(contract.id, e.target.checked)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-4 py-3">
                              {contract.contract_start_date && contract.contract_end_date ? (
                                <LifecycleStatusIndicator
                                  startDate={contract.contract_start_date}
                                  endDate={contract.contract_end_date}
                                />
                              ) : (
                                <span className="text-xs text-slate-400">Dates N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                {contract.employer && typeof contract.employer === 'object' && 'name_en' in contract.employer
                                  ? contract.employer.name_en || "N/A"
                                  : "N/A"}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                vs {contract.client && typeof contract.client === 'object' && 'name_en' in contract.client
                                  ? contract.client.name_en || "N/A"
                                  : "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                              {contract.promoters && contract.promoters.length > 0 && contract.promoters[0]
                                ? contract.promoters[0].name_en || "N/A"
                                : "N/A"}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                              {contract.contract_start_date
                                ? format(parseISO(contract.contract_start_date), "dd-MM-yyyy")
                                : "N/A"}
                              <span className="text-slate-400 dark:text-slate-500"> to </span>
                              {contract.contract_end_date
                                ? format(parseISO(contract.contract_end_date), "dd-MM-yyyy")
                                : "N/A"}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <EnhancedStatusBadge
                                status={contract.status}
                                errorDetails={contract.error_details}
                              />
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <ContractActions
                                contract={contract}
                                onUpdate={(updatedContract) => {
                                  setContracts(prev => 
                                    prev.map(c => c.id === updatedContract.id ? updatedContract : c)
                                  )
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination Controls */}
                {initialCount && initialCount > 10 && (
                  <div className="flex items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Showing {Math.min(10 * (currentPage - 1) + 1, initialCount)}-
                      {Math.min(10 * currentPage, initialCount)} of {initialCount} contracts
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
                        <Link
                          href={`/contracts?page=${currentPage - 1}${searchParams?.status ? `&status=${searchParams.status}` : ""}${searchParams?.q ? `&q=${searchParams.q}` : ""}`}
                        >
                          Previous
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" disabled={currentPage >= totalPages}>
                        <Link
                          href={`/contracts?page=${currentPage + 1}${searchParams?.status ? `&status=${searchParams.status}` : ""}${searchParams?.q ? `&q=${searchParams.q}` : ""}`}
                        >
                          Next
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
