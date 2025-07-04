"use client"

import { useState, useEffect } from "react"
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
  MoreHorizontalIcon
} from "lucide-react"

interface ContractDetailDebug {
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
  promoter_name_en?: string
  promoter_name_ar?: string
  employer?: any
  client?: any
  promoters?: any[]
  google_doc_url?: string
  pdf_url?: string
  error_details?: string
  version?: number
  last_sent_at?: string
  downloaded_count?: number
  generation_status?: string
}

interface ActivityLog {
  id: string
  action: string
  description: string
  created_at: string
  user_id?: string
  metadata?: any
}

export default function ContractDetailPage() {
  const params = useParams()
  const contractId = params.id as string
  
  const [contract, setContract] = useState<ContractDetailDebug | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const mockActivityLogs: ActivityLog[] = [
    {
      id: '1',
      action: 'created',
      description: 'Contract was created',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '2',
      action: 'generated',
      description: 'PDF document was generated',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: '3',
      action: 'viewed',
      description: 'Contract was viewed',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
      id: '4',
      action: 'downloaded',
      description: 'Contract PDF was downloaded',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]

  useEffect(() => {
    async function fetchContract() {
      try {
        setLoading(true)
        console.log("Fetching contract with ID:", contractId)

        // Fetch basic contract data
        const { data: basicData, error: basicError } = await supabase
          .from("contracts")
          .select("*")
          .eq("id", contractId)
          .single()

        if (basicError) {
          console.error("Basic query error:", basicError)
          setError(basicError.message)
          return
        }

        console.log("Basic contract data:", basicData)

        // Enhanced query with relations - try different approach
        let enhancedData = { ...basicData }
        
        // Try to fetch related parties separately
        if (basicData.employer_id) {
          const { data: employerData } = await supabase
            .from("parties")
            .select("name_en, name_ar, crn")
            .eq("id", basicData.employer_id)
            .single()
          
          if (employerData) {
            enhancedData.employer = employerData
          }
        }
        
        if (basicData.client_id) {
          const { data: clientData } = await supabase
            .from("parties")
            .select("name_en, name_ar, crn")
            .eq("id", basicData.client_id)
            .single()
          
          if (clientData) {
            enhancedData.client = clientData
          }
        }
        
        if (basicData.promoter_id) {
          const { data: promoterData } = await supabase
            .from("promoters")
            .select("id, name_en, name_ar, id_card_number")
            .eq("id", basicData.promoter_id)
            .single()
          
          if (promoterData) {
            enhancedData.promoters = [promoterData]
          }
        }
        
        console.log("Enhanced contract data:", enhancedData)
        setContract(enhancedData)
        setActivityLogs(mockActivityLogs)
      } catch (err) {
        console.error("Exception:", err)
        setError("Failed to load contract")
      } finally {
        setLoading(false)
      }
    }

    if (contractId) {
      fetchContract()
    }
  }, [contractId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading contract details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Contract</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500 mb-4">{error}</p>
              <Button asChild variant="outline">
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
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/contracts">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Contracts
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Contract Details</h1>
          <p className="text-gray-600">Contract ID: {contractId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contract ID</label>
                <p className="font-mono text-sm">{contract?.id || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p>{contract?.status || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p>{contract?.created_at ? new Date(contract.created_at).toLocaleString() : "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p>{contract?.contract_start_date ? new Date(contract.contract_start_date).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p>{contract?.contract_end_date ? new Date(contract.contract_end_date).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Job Title</label>
                <p>{contract?.job_title || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Work Location</label>
                <p>{contract?.work_location || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p>{contract?.email || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Parties */}
          <Card>
            <CardHeader>
              <CardTitle>Parties Involved</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Employer</label>
                <p>{contract?.employer?.name_en || contract?.first_party_name_en || "N/A"}</p>
                {(contract?.employer?.name_ar || contract?.first_party_name_ar) && (
                  <p className="text-sm text-gray-600" dir="rtl">{contract?.employer?.name_ar || contract?.first_party_name_ar}</p>
                )}
                {contract?.employer?.crn && (
                  <p className="text-xs text-gray-500">CRN: {contract.employer.crn}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Client</label>
                <p>{contract?.client?.name_en || contract?.second_party_name_en || "N/A"}</p>
                {(contract?.client?.name_ar || contract?.second_party_name_ar) && (
                  <p className="text-sm text-gray-600" dir="rtl">{contract?.client?.name_ar || contract?.second_party_name_ar}</p>
                )}
                {contract?.client?.crn && (
                  <p className="text-xs text-gray-500">CRN: {contract.client.crn}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Promoter</label>
                {contract?.promoters && contract.promoters.length > 0 ? (
                  <div>
                    <p>{contract.promoters[0].name_en || "N/A"}</p>
                    {contract.promoters[0].name_ar && (
                      <p className="text-sm text-gray-600" dir="rtl">{contract.promoters[0].name_ar}</p>
                    )}
                    {contract.promoters[0].id_card_number && (
                      <p className="text-xs text-gray-500">ID: {contract.promoters[0].id_card_number}</p>
                    )}
                  </div>
                ) : contract?.promoter_name_en ? (
                  <div>
                    <p>{contract.promoter_name_en}</p>
                    {contract.promoter_name_ar && (
                      <p className="text-sm text-gray-600" dir="rtl">{contract.promoter_name_ar}</p>
                    )}
                  </div>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Document and Links */}
          <Card>
            <CardHeader>
              <CardTitle>Documents & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contract?.google_doc_url && (
                <div>
                  <Button asChild className="w-full">
                    <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                      View Google Document
                    </a>
                  </Button>
                </div>
              )}
              {contract?.pdf_url && (
                <div>
                  <Button asChild variant="outline" className="w-full">
                    <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer">
                      View PDF Document
                    </a>
                  </Button>
                </div>
              )}
              {!contract?.google_doc_url && !contract?.pdf_url && (
                <p className="text-gray-500 text-center">No documents available</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contract?.contract_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract Number</label>
                  <p>{contract.contract_number}</p>
                </div>
              )}
              {contract?.id_card_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">ID Card Number</label>
                  <p>{contract.id_card_number}</p>
                </div>
              )}
              {contract?.employer_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Employer ID</label>
                  <p className="font-mono text-sm">{contract.employer_id}</p>
                </div>
              )}
              {contract?.client_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Client ID</label>
                  <p className="font-mono text-sm">{contract.client_id}</p>
                </div>
              )}
              {contract?.promoter_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Promoter ID</label>
                  <p className="font-mono text-sm">{contract.promoter_id}</p>
                </div>
              )}
              {contract?.error_details && (
                <div>
                  <label className="text-sm font-medium text-red-500">Error Details</label>
                  <p className="text-red-600 text-sm">{contract.error_details}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debug Information */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <details>
                <summary className="cursor-pointer font-medium">Raw Data</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </details>
              <details>
                <summary className="cursor-pointer font-medium mt-2">Enhanced Data</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(contract, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
