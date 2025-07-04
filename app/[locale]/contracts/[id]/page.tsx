"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  ArrowLeftIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  SendIcon,
  PrinterIcon,
  ShareIcon,
  HistoryIcon,
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  MoreHorizontalIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  TagIcon
} from "lucide-react"

interface Party {
  name_en: string
  name_ar?: string
  crn?: string
  address?: string
  phone?: string
  email?: string
}
interface Promoter {
  id: string
  name_en: string
  name_ar?: string
  id_card_number?: string
  email?: string
  phone?: string
}
interface ContractDetail {
  id: string
  status?: string
  created_at?: string
  updated_at?: string
  contract_start_date?: string
  contract_end_date?: string
  job_title?: string
  work_location?: string
  email?: string
  contract_number?: string
  id_card_number?: string
  employer_id?: string
  client_id?: string
  promoter_id?: string
  first_party_name_en?: string
  first_party_name_ar?: string
  second_party_name_en?: string
  second_party_name_ar?: string
  google_doc_url?: string
  pdf_url?: string
  error_details?: string
  salary?: number
  currency?: string
  contract_type?: string
  department?: string
  employer?: Party
  client?: Party
  promoters?: Promoter[]
}

interface ActivityLog {
  id: string
  action: string
  description: string
  created_at: string
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    action: "created",
    description: "Contract was created and initialized",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "2",
    action: "generated",
    description: "Google document was generated successfully",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "3",
    action: "reviewed",
    description: "Contract was reviewed by legal team",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "4",
    action: "sent",
    description: "Contract was sent to parties for review",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: "5",
    action: "downloaded",
    description: "PDF document was downloaded",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
]

const statusColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  expired: "bg-orange-100 text-orange-800 border-orange-200"
}
const getStatusColor = (status?: string) =>
  statusColorMap[status?.toLowerCase() || ""] || statusColorMap["draft"]

const getStatusIcon = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "completed":
      return <CheckCircleIcon className="h-4 w-4" aria-label="Active" />
    case "pending":
      return <ClockIcon className="h-4 w-4" aria-label="Pending" />
    case "draft":
      return <FileTextIcon className="h-4 w-4" aria-label="Draft" />
    case "cancelled":
    case "expired":
      return <AlertCircleIcon className="h-4 w-4" aria-label="Cancelled" />
    default:
      return <FileTextIcon className="h-4 w-4" aria-label="Unknown" />
  }
}

const formatCurrency = (amount?: number, currency?: string) => {
  if (!amount) return "N/A"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(amount)
}

const calculateDuration = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return "N/A"
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 30) return `${diffDays} days`
  if (diffDays < 365) return `${Math.round(diffDays / 30)} months`
  return `${Math.round(diffDays / 365)} years`
}

function PartyCard({
  title,
  icon,
  party,
  detailsLink,
  emptyText
}: {
  title: string
  icon: React.ReactNode
  party?: Party | Promoter
  detailsLink: string
  emptyText?: string
}) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {party ? (
          <div className="space-y-4">
            {"name_en" in party && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name (English)
                </label>
                <p className="font-semibold text-gray-900 mt-1">
                  {"name_en" in party && party.name_en}
                </p>
              </div>
            )}
            {"name_ar" in party && party.name_ar && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name (Arabic)
                </label>
                <p className="font-semibold text-gray-900 mt-1" dir="rtl">
                  {party.name_ar}
                </p>
              </div>
            )}
            {"crn" in party && party.crn && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Commercial Registration
                </label>
                <p className="font-mono text-sm text-gray-700 mt-1">{party.crn}</p>
              </div>
            )}
            {"id_card_number" in party && party.id_card_number && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  ID Card Number
                </label>
                <p className="font-mono text-sm text-gray-700 mt-1">
                  {party.id_card_number}
                </p>
              </div>
            )}
            {"email" in party && party.email && (
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-gray-500" />
                  {party.email}
                </p>
              </div>
            )}
            {"phone" in party && party.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  {party.phone}
                </p>
              </div>
            )}
            {"address" in party && party.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-700 mt-1 flex items-start gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                  {party.address}
                </p>
              </div>
            )}
            <div className="pt-4 border-t">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={detailsLink}>View Details</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {emptyText || "No party assigned"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DocumentCard({
  label,
  url,
  color,
  isPdf
}: {
  label: string
  url?: string
  color: string
  isPdf?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg ${url ? color : "bg-gray-50"}`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 ${url ? color : "bg-gray-200"} rounded-lg flex items-center justify-center`}>
          <FileTextIcon className={`h-5 w-5 ${url ? "" : "text-gray-400"}`} />
        </div>
        <div>
          <p className={`font-medium ${url ? "text-gray-900" : "text-gray-400"}`}>{label}</p>
          <p className={`text-sm ${url ? "text-gray-600" : "text-gray-400"}`}>
            {isPdf ? "Downloadable contract PDF" : "Editable contract document"}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {url ? (
          <>
            <Button asChild size="sm" variant="outline" aria-label={`View ${label}`}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </a>
            </Button>
            <Button asChild size="sm" variant={isPdf ? undefined : "outline"} aria-label={isPdf ? `Download ${label}` : `External link to ${label}`}>
              {isPdf ? (
                <a href={url} download>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </a>
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              )}
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" disabled aria-label={`No ${label}`}>
            <EyeIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ContractDetailPage() {
  const params = useParams()
  const contractId = params?.id as string

  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  const formattedCreatedAt = useMemo(
    () =>
      contract?.created_at
        ? new Date(contract.created_at).toLocaleDateString()
        : "N/A",
    [contract?.created_at]
  )
  const contractDuration = useMemo(
    () => calculateDuration(contract?.contract_start_date, contract?.contract_end_date),
    [contract?.contract_start_date, contract?.contract_end_date]
  )
  const formattedSalary = useMemo(
    () => formatCurrency(contract?.salary, contract?.currency),
    [contract?.salary, contract?.currency]
  )

  const handleCopyId = useCallback(
    (id: string | undefined) => {
      if (id) navigator.clipboard.writeText(id)
    },
    []
  )

  useEffect(() => {
    async function fetchContract() {
      if (!contractId) return
      try {
        setLoading(true)
        setError(null)
        const { data: basicData, error: basicError } = await supabase
          .from("contracts")
          .select("*")
          .eq("id", contractId)
          .single()

        if (basicError) {
          setError(basicError.message)
          return
        }

        let enhancedData = { ...basicData } as any

        if (basicData.first_party_id) {
          const { data: employerData } = await supabase
            .from("parties")
            .select("name_en, name_ar, crn, address, phone, email")
            .eq("id", basicData.first_party_id)
            .single()
          if (employerData) enhancedData.employer = employerData
        }
        if (basicData.second_party_id) {
          const { data: clientData } = await supabase
            .from("parties")
            .select("name_en, name_ar, crn, address, phone, email")
            .eq("id", basicData.second_party_id)
            .single()
          if (clientData) enhancedData.client = clientData
        }
        if (basicData.promoter_id) {
          const { data: promoterData } = await supabase
            .from("promoters")
            .select("id, name_en, name_ar, id_card_number, email, phone")
            .eq("id", basicData.promoter_id)
            .single()
          if (promoterData) enhancedData.promoters = [promoterData]
        }
        setContract(enhancedData)
        setActivityLogs(mockActivityLogs)
      } catch (err) {
        setError("Failed to load contract")
      } finally {
        setLoading(false)
      }
    }
    fetchContract()
  }, [contractId])

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading Contract Details
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch the contract information...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5" />
                Error Loading Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-red-600 mb-6">{error}</p>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/contracts">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Contracts
                  </Link>
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )

  if (!contract)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <FileTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contract Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                The contract you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/contracts">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Contracts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-8xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Link href="/contracts">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Contracts
              </Link>
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Contracts</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Contract Details</span>
            </nav>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Contract Details
                  </h1>
                  <Badge
                    className={`${getStatusColor(contract?.status)} flex items-center gap-1 px-3 py-1 text-sm font-medium`}
                  >
                    {getStatusIcon(contract?.status)}
                    {contract?.status || "Unknown"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-500">
                      Contract ID
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{contractId}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Copy Contract ID"
                        onClick={() => handleCopyId(contractId)}
                      >
                        <CopyIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Created</label>
                    <p className="mt-1">{formattedCreatedAt}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Duration</label>
                    <p className="mt-1">{contractDuration}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Type</label>
                    <p className="mt-1">{contract.contract_type || "Standard"}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-8">
                {contract?.google_doc_url && (
                  <Button asChild size="sm" variant="outline" className="gap-2" aria-label="View Google Doc">
                    <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                      <EyeIcon className="h-4 w-4" />
                      View
                    </a>
                  </Button>
                )}
                <Button asChild size="sm" variant="outline" className="gap-2" aria-label="Edit Contract">
                  <Link href={`/edit-contract/${contractId}`}>
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                {contract?.pdf_url && (
                  <Button asChild size="sm" variant="outline" className="gap-2" aria-label="Download PDF">
                    <a href={contract.pdf_url} download>
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                )}
                <Button size="sm" className="gap-2" aria-label="Send Contract">
                  <SendIcon className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* ...Tabs and rest of component as in previous code... */}
      </div>
    </div>
  )
}
