"use client"

import { useEffect } from "react"
import { useContractsStore } from "./stores/contractsStore"
import SupabaseListener from "./supabase-listener"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, RefreshCw, Plus } from "lucide-react"

export default function HomePage() {
  const { contracts, loading, error, fetchContracts, generateContract } = useContractsStore()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleGenerate = async (contractNumber: string) => {
    await generateContract(contractNumber)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      queued: "outline",
      processing: "default",
      completed: "default",
      failed: "destructive",
    } as const

    const colors = {
      pending: "bg-gray-100 text-gray-800",
      queued: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || "secondary"}
        className={colors[status as keyof typeof colors]}
      >
        {status === "processing" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading && contracts.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <SupabaseListener />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading contracts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <SupabaseListener />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contract Management</h1>
        <Button onClick={() => fetchContracts()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No contracts found</p>
              <Button onClick={() => handleGenerate(`CONTRACT-${Date.now()}`)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Contract
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Contract Number</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Actions</th>
                    <th className="text-left p-2">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono">{contract.contract_number}</td>
                      <td className="p-2">{getStatusBadge(contract.status)}</td>
                      <td className="p-2">{new Date(contract.created_at).toLocaleDateString()}</td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          disabled={contract.status === "processing" || contract.status === "queued"}
                          onClick={() => handleGenerate(contract.contract_number)}
                        >
                          {contract.status === "processing" || contract.status === "queued" ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              {contract.status === "processing" ? "Processing" : "Queued"}
                            </>
                          ) : contract.status === "failed" ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
                            </>
                          ) : (
                            "Generate"
                          )}
                        </Button>
                      </td>
                      <td className="p-2">
                        {contract.pdf_url ? (
                          <Button size="sm" variant="outline" asChild>
                            <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">Not available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
