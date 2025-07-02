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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ExternalLinkIcon,
  ArrowLeftIcon,
  FileTextIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  HelpCircleIcon,
  MoreHorizontal,
  Edit3Icon,
  EyeIcon,
  ArchiveIcon,
  SendIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format, parseISO, isWithinInterval, isFuture, isPast } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ContractStatusFilter from "@/components/contract-status-filter"
import ContractSearchInput from "@/components/contract-search-input"
import LifecycleStatusIndicator from "@/components/lifecycle-status-indicator" // New import

// Re-using the Generation Status Badge from previous version
function GenerationStatusBadge({
  status,
  errorDetails,
}: {
  status: string | null
  errorDetails?: string | null
}) {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
  let IconComponent: React.ElementType = HelpCircleIcon
  let statusText = status || "Unknown"
  let className = ""

  switch (status?.toUpperCase()) {
    case "GENERATED_SUCCESSFULLY":
      badgeVariant = "default"
      IconComponent = CheckCircle2Icon
      statusText = "Successful"
      className = "bg-green-600 hover:bg-green-700 text-white"
      break
    case "EMAIL_SENT":
      badgeVariant = "default"
      IconComponent = SendIcon // Changed icon
      statusText = "Email Sent"
      className = "bg-sky-600 hover:bg-sky-700 text-white"
      break
    case "PENDING_GENERATION":
      badgeVariant = "secondary"
      IconComponent = ClockIcon
      statusText = "Pending Gen."
      className = "bg-yellow-500 hover:bg-yellow-600 text-black"
      break
    case "GENERATION_ERROR":
      badgeVariant = "destructive"
      IconComponent = XCircleIcon
      statusText = "Gen. Error"
      break
    default:
      statusText = status ? status.replace(/_/g, " ") : "Unknown"
      IconComponent = HelpCircleIcon
      break
  }

  const badgeContent = (
    <Badge
      variant={badgeVariant}
      className={`flex items-center gap-1 px-1.5 py-0.5 text-xs ${className}`}
    >
      <IconComponent className="h-3 w-3" />
      <span>{statusText}</span>
    </Badge>
  )

  if (status?.toUpperCase() === "GENERATION_ERROR" && errorDetails) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
          <TooltipContent className="max-w-xs break-words rounded-md bg-destructive p-2 text-destructive-foreground shadow-lg">
            <p className="mb-1 text-sm font-semibold">Error Details:</p>
            <p className="text-xs">{errorDetails}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return badgeContent
}

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
  searchParams?: { status?: string; q?: string; page?: string }
}) {
  const generationStatusFilter = searchParams?.status
  const searchQuery = searchParams?.q
  const currentPage = Number(searchParams?.page || 1)
  const ITEMS_PER_PAGE = 10

  // --- Data Fetching ---
  let query = supabase
    .from("contracts")
    .select(
      "id, created_at, first_party_name_en, second_party_name_en, promoter_name_en, status, google_doc_url, error_details, contract_start_date, contract_end_date", // Added dates
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)

  if (generationStatusFilter && generationStatusFilter !== "all") {
    query = query.eq("status", generationStatusFilter)
  }

  if (searchQuery) {
    query = query.or(
      `first_party_name_en.ilike.%${searchQuery}%,second_party_name_en.ilike.%${searchQuery}%,promoter_name_en.ilike.%${searchQuery}%`,
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
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900 sm:py-12">
      <div className="mx-auto max-w-screen-xl">
        {" "}
        {/* Wider max-width */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Contract Management
          </h1>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
        {/* Summary Cards - Refined Style */}
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
            // { title: "Generation Errors", value: summaryStats.errors, Icon: XCircleIcon, color: "text-red-500" }, // Can add this too
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
          </CardHeader>
          <CardContent className="p-0">
            {" "}
            {/* Remove padding for full-width table */}
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-800">
                  <TableRow>
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
                        colSpan={6}
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
                            {contract.first_party_name_en}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            vs {contract.second_party_name_en}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                          {contract.promoter_name_en}
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
                          <GenerationStatusBadge
                            status={contract.status}
                            errorDetails={contract.error_details}
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Manage</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/contracts/${contract.id}`} passHref legacyBehavior>
                                <DropdownMenuItem asChild>
                                  <a>
                                    <EyeIcon className="mr-2 h-4 w-4" /> View Details
                                  </a>
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/edit-contract/${contract.id}`} passHref legacyBehavior>
                                <DropdownMenuItem asChild>
                                  <a>
                                    <Edit3Icon className="mr-2 h-4 w-4" /> Edit Contract
                                  </a>
                                </DropdownMenuItem>
                              </Link>
                              {contract.google_doc_url && (
                                <a
                                  href={contract.google_doc_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <ExternalLinkIcon className="mr-2 h-4 w-4" /> View Document
                                  </DropdownMenuItem>
                                </a>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-700/20 dark:focus:text-red-500">
                                <ArchiveIcon className="mr-2 h-4 w-4" /> Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination Controls - Refined Style */}
            {count && count > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {Math.min(ITEMS_PER_PAGE * (currentPage - 1) + 1, count)}-
                  {Math.min(ITEMS_PER_PAGE * currentPage, count)} of {count} contracts
                </span>
                <div className="flex items-center space-x-2">
                  <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
                    <Link
                      href={`/contracts?page=${currentPage - 1}${generationStatusFilter ? `&status=${generationStatusFilter}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    >
                      Previous
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" disabled={currentPage >= totalPages}>
                    <Link
                      href={`/contracts?page=${currentPage + 1}${generationStatusFilter ? `&status=${generationStatusFilter}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    >
                      Next
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
