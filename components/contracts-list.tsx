"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, RefreshCw, FileText, AlertCircle } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { useToast } from "@/hooks/use-toast"

const statusConfig = {
  pending: { color: "bg-gray-500", label: "Pending", icon: FileText },
  queued: { color: "bg-blue-500", label: "Queued", icon: Loader2 },
  processing: { color: "bg-yellow-500", label: "Processing", icon: RefreshCw },
  completed: { color: "bg-green-500", label: "Completed", icon: FileText },
  failed: { color: "bg-red-500", label: "Failed", icon: AlertCircle },
}

export function ContractsList() {
  const { contracts, loading, error, fetchContracts, generateContract } = useContractsStore()
  const { toast } = useToast()

  // Set up real-time subscriptions
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleGenerate = async (contractNumber: string) => {
    try {
      await generateContract(contractNumber)
      toast({
        title: "Contract Generation Started",
        description: `Contract ${contractNumber} has been queued for generation.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate contract",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (pdfUrl: string, contractNumber: string) => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `contract-${contractNumber}.pdf`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading contracts...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contracts ({contracts.length})</span>
            <Button variant="outline" size="sm" onClick={fetchContracts} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No contracts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Contract Number</th>
                    <th className="text-left py-2 px-4">Title</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Created</th>
                    <th className="text-right py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => {
                    const statusInfo = statusConfig[contract.status]
                    const StatusIcon = statusInfo.icon

                    return (
                      <tr key={contract.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{contract.contract_number}</td>
                        <td className="py-3 px-4">{contract.title || "Untitled Contract"}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className={`${statusInfo.color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(contract.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {contract.status === "pending" && (
                              <Button size="sm" onClick={() => handleGenerate(contract.contract_number)}>
                                Generate
                              </Button>
                            )}
                            {contract.status === "failed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGenerate(contract.contract_number)}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Retry
                              </Button>
                            )}
                            {contract.status === "completed" && contract.pdf_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(contract.pdf_url!, contract.contract_number)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
