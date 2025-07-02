"use client"
import { useEffect, useState } from "react"
import PartyForm from "@/components/party-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Party } from "@/lib/types"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EditIcon, PlusCircleIcon, ArrowLeftIcon, BuildingIcon, Loader2, Search, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO } from "date-fns"

export default function ManagePartiesPage() {
  const [parties, setParties] = useState<Party[]>([])
  const [filteredParties, setFilteredParties] = useState<Party[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedParty, setSelectedParty] = useState<Party | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const { toast } = useToast()

  async function fetchParties() {
    setIsLoading(true)
    const { data, error } = await supabase.from("parties").select("*").order("name_en")
    if (error) {
      toast({ title: "Error fetching parties", description: error.message, variant: "destructive" })
      setParties([])
    } else {
      setParties(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchParties()
  }, [])

  // Filter parties based on search and filters
  useEffect(() => {
    let filtered = parties

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(party =>
        party.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.crn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(party => party.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(party => party.type === typeFilter)
    }

    setFilteredParties(filtered)
  }, [parties, searchTerm, statusFilter, typeFilter])

  const handleEdit = (party: Party) => {
    setSelectedParty(party)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setSelectedParty(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedParty(null)
    fetchParties() // Refresh the list after form submission
  }

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "Suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeBadge = (type: string | null | undefined) => {
    switch (type) {
      case "Employer":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Employer</Badge>
      case "Client":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Client</Badge>
      case "Both":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Both</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    try {
      return format(parseISO(dateString), "dd-MM-yyyy")
    } catch {
      return "Invalid Date"
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg">Loading parties...</p>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Button variant="outline" onClick={handleFormClose} className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Party List
          </Button>
          <PartyForm partyToEdit={selectedParty} onFormSubmit={handleFormClose} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Parties</h1>
          <Button onClick={handleAddNew}>
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Add New Party
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Employer">Employer</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Showing {filteredParties.length} of {parties.length} parties
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredParties.length === 0 ? (
          <Card className="py-10 text-center">
            <CardHeader>
              <BuildingIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle>No Parties Found</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {parties.length === 0 
                  ? "Get started by adding your first party. Click the 'Add New Party' button."
                  : "No parties match your current filters. Try adjusting your search criteria."
                }
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Party List</CardTitle>
              <CardDescription>View, add, or edit party details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name (EN)</TableHead>
                      <TableHead>Name (AR)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>CRN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>CR Expiry</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParties.map((party) => (
                      <TableRow key={party.id}>
                        <TableCell className="font-medium">{party.name_en}</TableCell>
                        <TableCell dir="rtl" className="text-right">{party.name_ar}</TableCell>
                        <TableCell>{getTypeBadge(party.type)}</TableCell>
                        <TableCell>{party.role || "N/A"}</TableCell>
                        <TableCell className="font-mono">{party.crn}</TableCell>
                        <TableCell>{getStatusBadge(party.status)}</TableCell>
                        <TableCell>{party.contact_person || "N/A"}</TableCell>
                        <TableCell>{formatDate(party.cr_expiry_date)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(party)}>
                            <EditIcon className="mr-1 h-4 w-4" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
