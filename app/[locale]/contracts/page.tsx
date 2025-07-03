"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useContracts, useDeleteContractMutation } from "@/hooks/use-contracts"
import type { Contract } from "@/types/custom"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, parseISO } from "date-fns"
import {
  Loader2,
  Eye,
  Trash2,
  Download,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard/dashboard-layout" // Assuming this is your main layout
import { FileTextIcon } from "@radix-ui/react-icons"

type ContractStatus = "Active" | "Expired" | "Upcoming" | "Unknown"

const getContractStatus = (contract: Contract): ContractStatus => {
  if (!contract.contract_valid_from || !contract.contract_valid_until) return "Unknown"
  const now = new Date()
  const startDate = parseISO(contract.contract_valid_from)
  const endDate = parseISO(contract.contract_valid_until)
  if (now >= startDate && now <= endDate) return "Active"
  if (now > endDate) return "Expired"
  if (now < startDate) return "Upcoming"
  return "Unknown"
}

export default function ContractsDashboardPage() {
  const params = useParams()
  const locale = (params.locale as string) || "en"

  const { data: contracts, isLoading, error } = useContracts()
  const deleteContractMutation = useDeleteContractMutation()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ContractStatus>("all")
  const [sortColumn, setSortColumn] = useState<keyof Contract | "status">("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)

  const filteredAndSortedContracts = useMemo(() => {
    if (!contracts) return []
    const filtered = contracts.filter((contract) => {
      const contractStatus = getContractStatus(contract)
      const matchesStatus = statusFilter === "all" || contractStatus === statusFilter

      const firstParty =
        (contract.employer && typeof contract.employer === 'object' && 'name_en' in contract.employer
          ? contract.employer.name_en || contract.employer.name_ar
          : "") || ""
      const secondParty =
        (contract.client && typeof contract.client === 'object' && 'name_en' in contract.client
          ? contract.client.name_en || contract.client.name_ar
          : "") || ""
      const promoterName = contract.promoters && contract.promoters.length > 0 && contract.promoters[0]
        ? (locale === "ar" 
            ? contract.promoters[0].name_ar || contract.promoters[0].name_en
            : contract.promoters[0].name_en || contract.promoters[0].name_ar)
        : ""

      const matchesSearch =
        !searchTerm ||
        contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firstParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        secondParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promoterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contract.job_title && contract.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesStatus && matchesSearch
    })

    return filtered.sort((a, b) => {
      let valA, valB
      if (sortColumn === "status") {
        valA = getContractStatus(a)
        valB = getContractStatus(b)
      } else {
        valA = a[sortColumn as keyof Contract]
        valB = b[sortColumn as keyof Contract]
      }

      if (valA === null || valA === undefined) valA = "" // Handle null/undefined for sorting
      if (valB === null || valB === undefined) valB = ""

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA
      }
      // Fallback for dates or other types
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [contracts, searchTerm, statusFilter, sortColumn, sortDirection, locale])

  const handleSort = (column: keyof Contract | "status") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const handleDeleteClick = (contract: Contract) => {
    setContractToDelete(contract)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!contractToDelete) return
    try {
      await deleteContractMutation.mutateAsync(contractToDelete.id)
      toast({ title: "Success", description: "Contract deleted successfully." })
    } catch (e: any) {
      toast({
        title: "Error",
        description: `Failed to delete contract: ${e.message}`,
        variant: "destructive",
      })
    } finally {
      setShowDeleteConfirm(false)
      setContractToDelete(null)
    }
  }

  const renderSortIcon = (column: keyof Contract | "status") => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <ArrowUpDown className="ml-2 inline h-4 w-4 rotate-180 transform" />
      ) : (
        <ArrowUpDown className="ml-2 inline h-4 w-4" />
      )
    }
    return <ArrowUpDown className="ml-2 inline h-4 w-4 opacity-50" />
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-150px)] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Loading contracts...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Contracts Dashboard</CardTitle>
            <CardDescription>
              View, manage, and track all your contracts in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="relative w-full flex-grow md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID, parties, promoter, job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8"
                />
              </div>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as "all" | ContractStatus)}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button asChild>
                <Link href={`/${locale}/generate-contract`}>
                  Create New Contract
                </Link>
              </Button>
            </div>

            {filteredAndSortedContracts.length === 0 ? (
              <div className="py-12 text-center">
                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No contracts found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "Get started by creating a new contract."}
                </p>
                {!(searchTerm || statusFilter !== "all") && (
                  <Button asChild className="mt-6">
                    <Link href={`/${locale}/generate-contract`}>
                      Create New Contract
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                        Contract ID {renderSortIcon("id")}
                      </TableHead>
                      <TableHead>First Party</TableHead>
                      <TableHead>Second Party</TableHead>
                      <TableHead>Promoter</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("contract_valid_from")}
                      >
                        Start Date {renderSortIcon("contract_valid_from")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("contract_valid_until")}
                      >
                        End Date {renderSortIcon("contract_valid_until")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        Status {renderSortIcon("status")}
                      </TableHead>
                      <TableHead>PDF</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedContracts.map((contract) => {
                      const contractStatus = getContractStatus(contract)
                      const promoterName = contract.promoters && contract.promoters.length > 0 && contract.promoters[0]
                        ? (locale === "ar" 
                            ? contract.promoters[0].name_ar || contract.promoters[0].name_en
                            : contract.promoters[0].name_en || contract.promoters[0].name_ar)
                        : ""
                      return (
                        <TableRow key={contract.id}>
                          <TableCell className="font-mono text-xs">
                            {contract.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {contract.employer && typeof contract.employer === 'object' && 'name_en' in contract.employer
                              ? contract.employer.name_en || contract.employer.name_ar || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {contract.client && typeof contract.client === 'object' && 'name_en' in contract.client
                              ? contract.client.name_en || contract.client.name_ar || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell>{promoterName || "N/A"}</TableCell>
                          <TableCell>
                            {contract.contract_valid_from
                              ? format(parseISO(contract.contract_valid_from), "dd-MM-yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {contract.contract_valid_until
                              ? format(parseISO(contract.contract_valid_until), "dd-MM-yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${contractStatus === "Active" ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100" : ""} ${contractStatus === "Expired" ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100" : ""} ${contractStatus === "Upcoming" ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100" : ""} ${contractStatus === "Unknown" ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100" : ""}`}
                            >
                              {contractStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            {contract.pdf_url ? (
                              <a
                                href={contract.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                <Download className="inline h-5 w-5" />
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link
                                  href={`/${locale}/contracts/${contract.id}`}
                                >
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(contract)}
                                  className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-700/20"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contract "
              {contractToDelete?.id.substring(0, 8)}...".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setContractToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteContractMutation.isPending}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {deleteContractMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
