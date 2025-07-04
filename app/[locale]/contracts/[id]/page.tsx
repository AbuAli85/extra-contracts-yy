"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  ArrowLeftIcon, 
  DownloadIcon, 
  EditIcon, 
  EyeIcon, 
  SendIcon,
  CopyIcon,
  FileTextIcon
} from "lucide-react"

// Import our refactored components
import { useContract } from "@/hooks/useContract"
import { StatusBadge } from "@/components/StatusBadge"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorCard } from "@/components/ErrorCard"
import { OverviewTab } from "@/components/contract-tabs/OverviewTab"
import { formatDate, calculateDuration, copyToClipboard } from "@/utils/format"

export default function ContractDetailPage() {
  const params = useParams()
  const contractId = params.id as string
  const { contract, loading, error, refetch } = useContract(contractId)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorCard message={error} onRetry={refetch} />
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <FileTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contract Not Found</h3>
              <p className="text-gray-600 mb-6">The contract you're looking for doesn't exist or has been removed.</p>
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-8xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
                  <h1 className="text-3xl font-bold text-gray-900">Contract Details</h1>
                  <StatusBadge status={contract?.status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-500">Contract ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{contractId}</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(contractId)}>
                        <CopyIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Created</label>
                    <p className="mt-1">{formatDate(contract.created_at)}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Duration</label>
                    <p className="mt-1">{calculateDuration(contract.contract_start_date, contract.contract_end_date)}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Type</label>
                    <p className="mt-1">{contract.contract_type || 'Standard'}</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2 ml-8">
                {contract?.google_doc_url && (
                  <Button asChild size="sm" variant="outline" className="gap-2">
                    <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                      <EyeIcon className="h-4 w-4" />
                      View
                    </a>
                  </Button>
                )}
                
                <Button asChild size="sm" variant="outline" className="gap-2">
                  <Link href={`/edit-contract/${contractId}`}>
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                
                {contract?.pdf_url && (
                  <Button asChild size="sm" variant="outline" className="gap-2">
                    <a href={contract.pdf_url} download>
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                )}
                
                <Button size="sm" className="gap-2">
                  <SendIcon className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <TabsList className="grid w-full grid-cols-6 bg-transparent">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="parties" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Parties</TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Documents</TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Timeline</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">History</TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Actions</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <OverviewTab contract={contract} />
          </TabsContent>

          {/* Placeholder tabs - to be refactored next */}
          <TabsContent value="parties" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Parties tab - Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Documents tab - Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Timeline tab - Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">History tab - Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Actions tab - Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 text-sm font-medium">Contract Status</p>
                      <p className="text-2xl font-bold text-blue-900 capitalize">{contract?.status || 'Unknown'}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                      {getStatusIcon(contract?.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-700 text-sm font-medium">Duration</p>
                      <p className="text-2xl font-bold text-green-900">{calculateDuration(contract?.contract_start_date, contract?.contract_end_date)}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-700 text-sm font-medium">Salary</p>
                      <p className="text-2xl font-bold text-purple-900">{formatCurrency(contract?.salary, contract?.currency)}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                      <TagIcon className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-700 text-sm font-medium">Documents</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {(contract?.google_doc_url ? 1 : 0) + (contract?.pdf_url ? 1 : 0)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                      <FileTextIcon className="h-6 w-6 text-orange-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contract Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <FileTextIcon className="h-5 w-5" />
                    Contract Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Job Title</label>
                        <p className="font-semibold text-gray-900 mt-1">{contract?.job_title || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="font-semibold text-gray-900 mt-1">{contract?.department || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Start Date</label>
                        <p className="font-semibold text-gray-900 mt-1">
                          {contract?.contract_start_date ? new Date(contract.contract_start_date).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">End Date</label>
                        <p className="font-semibold text-gray-900 mt-1">
                          {contract?.contract_end_date ? new Date(contract.contract_end_date).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Work Location</label>
                      <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-gray-500" />
                        {contract?.work_location || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-gray-500" />
                        {contract?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Number</label>
                      <p className="font-semibold text-gray-900 mt-1">{contract?.contract_number || "Not assigned"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <AlertCircleIcon className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract ID</label>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">{contract?.id}</code>
                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(contract?.id || '')}>
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employer ID</label>
                        <p className="font-mono text-sm text-gray-700 mt-1">{contract?.employer_id || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Client ID</label>
                        <p className="font-mono text-sm text-gray-700 mt-1">{contract?.client_id || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Promoter ID</label>
                        <p className="font-mono text-sm text-gray-700 mt-1">{contract?.promoter_id || "N/A"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created At</label>
                        <p className="text-sm text-gray-700 mt-1">
                          {contract?.created_at ? new Date(contract.created_at).toLocaleString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Updated At</label>
                        <p className="text-sm text-gray-700 mt-1">
                          {contract?.updated_at ? new Date(contract.updated_at).toLocaleString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    {contract?.error_details && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <label className="text-sm font-medium text-red-700">Error Details</label>
                        <p className="text-red-600 text-sm mt-1">{contract.error_details}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Parties Tab */}
          <TabsContent value="parties" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employer Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <BuildingIcon className="h-5 w-5" />
                    Employer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name (English)</label>
                      <p className="font-semibold text-gray-900 mt-1">{contract?.employer?.name_en || contract?.first_party_name_en || "Not specified"}</p>
                    </div>
                    {(contract?.employer?.name_ar || contract?.first_party_name_ar) && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company Name (Arabic)</label>
                        <p className="font-semibold text-gray-900 mt-1" dir="rtl">{contract?.employer?.name_ar || contract?.first_party_name_ar}</p>
                      </div>
                    )}
                    {contract?.employer?.crn && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Commercial Registration</label>
                        <p className="font-mono text-sm text-gray-700 mt-1">{contract.employer.crn}</p>
                      </div>
                    )}
                    {contract?.employer?.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-gray-500" />
                          {contract.employer.email}
                        </p>
                      </div>
                    )}
                    {contract?.employer?.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-gray-500" />
                          {contract.employer.phone}
                        </p>
                      </div>
                    )}
                    {contract?.employer?.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-sm text-gray-700 mt-1 flex items-start gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                          {contract.employer.address}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/manage-parties`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <UserIcon className="h-5 w-5" />
                    Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name (English)</label>
                      <p className="font-semibold text-gray-900 mt-1">{contract?.client?.name_en || contract?.second_party_name_en || "Not specified"}</p>
                    </div>
                    {(contract?.client?.name_ar || contract?.second_party_name_ar) && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name (Arabic)</label>
                        <p className="font-semibold text-gray-900 mt-1" dir="rtl">{contract?.client?.name_ar || contract?.second_party_name_ar}</p>
                      </div>
                    )}
                    {contract?.client?.crn && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Commercial Registration</label>
                        <p className="font-mono text-sm text-gray-700 mt-1">{contract.client.crn}</p>
                      </div>
                    )}
                    {contract?.client?.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-gray-500" />
                          {contract.client.email}
                        </p>
                      </div>
                    )}
                    {contract?.client?.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-gray-500" />
                          {contract.client.phone}
                        </p>
                      </div>
                    )}
                    {contract?.client?.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-sm text-gray-700 mt-1 flex items-start gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                          {contract.client.address}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/manage-parties`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promoter Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <UserIcon className="h-5 w-5" />
                    Promoter
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {contract?.promoters && contract.promoters.length > 0 ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name (English)</label>
                          <p className="font-semibold text-gray-900 mt-1">{contract.promoters[0].name_en}</p>
                        </div>
                        {contract.promoters[0].name_ar && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Name (Arabic)</label>
                            <p className="font-semibold text-gray-900 mt-1" dir="rtl">{contract.promoters[0].name_ar}</p>
                          </div>
                        )}
                        {contract.promoters[0].id_card_number && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">ID Card Number</label>
                            <p className="font-mono text-sm text-gray-700 mt-1">{contract.promoters[0].id_card_number}</p>
                          </div>
                        )}
                        {contract.promoters[0].email && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                              <MailIcon className="h-4 w-4 text-gray-500" />
                              {contract.promoters[0].email}
                            </p>
                          </div>
                        )}
                        {contract.promoters[0].phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                              <PhoneIcon className="h-4 w-4 text-gray-500" />
                              {contract.promoters[0].phone}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No promoter assigned</p>
                        <p className="text-gray-400 text-sm">This contract doesn't have an assigned promoter.</p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/promoters`}>
                          {contract?.promoters && contract.promoters.length > 0 ? 'View Details' : 'Assign Promoter'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5" />
                    Generated Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {contract?.google_doc_url ? (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileTextIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Google Document</p>
                            <p className="text-sm text-gray-600">Editable contract document</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLinkIcon className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FileTextIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-400">Google Document</p>
                            <p className="text-sm text-gray-400">Not yet generated</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" disabled>
                          <EyeIcon className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                    )}

                    {contract?.pdf_url ? (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileTextIcon className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">PDF Document</p>
                            <p className="text-sm text-gray-600">Downloadable contract PDF</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer">
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </Button>
                          <Button asChild size="sm">
                            <a href={contract.pdf_url} download>
                              <DownloadIcon className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FileTextIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-400">PDF Document</p>
                            <p className="text-sm text-gray-400">Not yet generated</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" disabled>
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    )}

                    {!contract?.google_doc_url && !contract?.pdf_url && (
                      <div className="text-center py-12">
                        <FileTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Generated</h3>
                        <p className="text-gray-500 mb-6">Generate documents to get started with this contract.</p>
                        <Button>
                          <FileTextIcon className="mr-2 h-4 w-4" />
                          Generate Documents
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MoreHorizontalIcon className="h-5 w-5" />
                    Document Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <FileTextIcon className="h-4 w-4" />
                      Generate New Version
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <SendIcon className="h-4 w-4" />
                      Send via Email
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <ShareIcon className="h-4 w-4" />
                      Share Link
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <PrinterIcon className="h-4 w-4" />
                      Print Document
                    </Button>
                    
                    <Separator className="my-4" />
                    
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <DownloadIcon className="h-4 w-4" />
                      Download All
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <CopyIcon className="h-4 w-4" />
                      Duplicate Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Contract Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-8">
                    <div className="relative flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                        <FileTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-gray-900">Contract Created</h4>
                        <p className="text-gray-600 text-sm mt-1">Initial contract generation and setup</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {contract?.created_at ? new Date(contract.created_at).toLocaleString() : 'Date not available'}
                        </p>
                      </div>
                    </div>

                    {contract?.contract_start_date && (
                      <div className="relative flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                          <CalendarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm">
                          <h4 className="font-semibold text-gray-900">Contract Start Date</h4>
                          <p className="text-gray-600 text-sm mt-1">Contract becomes effective and active</p>
                          <p className="text-gray-500 text-xs mt-2">
                            {new Date(contract.contract_start_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {contract?.google_doc_url && (
                      <div className="relative flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                          <FileTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm">
                          <h4 className="font-semibold text-gray-900">Document Generated</h4>
                          <p className="text-gray-600 text-sm mt-1">Google document was created and is available for viewing</p>
                          <p className="text-gray-500 text-xs mt-2">
                            Document available
                          </p>
                        </div>
                      </div>
                    )}

                    {contract?.contract_end_date && (
                      <div className="relative flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                          <CalendarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm">
                          <h4 className="font-semibold text-gray-900">Contract End Date</h4>
                          <p className="text-gray-600 text-sm mt-1">Contract expiration and completion</p>
                          <p className="text-gray-500 text-xs mt-2">
                            {new Date(contract.contract_end_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="relative flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                        <ClockIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-gray-900">Last Updated</h4>
                        <p className="text-gray-600 text-sm mt-1">Most recent modification to the contract</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {contract?.updated_at ? new Date(contract.updated_at).toLocaleString() : 'No updates recorded'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <HistoryIcon className="h-5 w-5" />
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activityLogs.map((log, index) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {log.action === 'created' && <FileTextIcon className="h-5 w-5 text-blue-600" />}
                          {log.action === 'generated' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                          {log.action === 'reviewed' && <EyeIcon className="h-5 w-5 text-purple-600" />}
                          {log.action === 'sent' && <SendIcon className="h-5 w-5 text-orange-600" />}
                          {log.action === 'downloaded' && <DownloadIcon className="h-5 w-5 text-gray-600" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 capitalize">{log.action}</p>
                        <p className="text-gray-600 text-sm mt-1">{log.description}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="text-blue-900">Document Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {contract?.google_doc_url && (
                      <Button asChild className="w-full justify-start gap-2">
                        <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                          <EyeIcon className="h-4 w-4" />
                          View Document
                        </a>
                      </Button>
                    )}
                    {contract?.pdf_url && (
                      <Button asChild className="w-full justify-start gap-2" variant="outline">
                        <a href={contract.pdf_url} download>
                          <DownloadIcon className="h-4 w-4" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <PrinterIcon className="h-4 w-4" />
                      Print Document
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <FileTextIcon className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle className="text-green-900">Communication</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button className="w-full justify-start gap-2">
                      <SendIcon className="h-4 w-4" />
                      Send via Email
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <ShareIcon className="h-4 w-4" />
                      Share Link
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <MailIcon className="h-4 w-4" />
                      Send Reminder
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <MoreHorizontalIcon className="h-4 w-4" />
                      More Options
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-purple-50 border-b">
                  <CardTitle className="text-purple-900">Management</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button asChild className="w-full justify-start gap-2">
                      <Link href={`/edit-contract/${contractId}`}>
                        <EditIcon className="h-4 w-4" />
                        Edit Contract
                      </Link>
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <CopyIcon className="h-4 w-4" />
                      Duplicate Contract
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <HistoryIcon className="h-4 w-4" />
                      View History
                    </Button>
                    
                    <Separator className="my-3" />
                    
                    <Button className="w-full justify-start gap-2" variant="destructive">
                      <AlertCircleIcon className="h-4 w-4" />
                      Cancel Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
