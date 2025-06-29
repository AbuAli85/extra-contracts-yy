"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCw, Play, AlertCircle, Loader2 } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { ContractStatusIndicator } from "./contract-status-indicator"
import { toast } from "sonner"

export function ContractsList() {
  const { contracts, loading, error, fetchContracts, generateContract } = useContractsStore()

  // Set up real-time subscriptions
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleGenerate = async (contractNumber: string) => {
    try {
      await generateContract(contractNumber)
      toast.success("Contract generation started!")
    } catch (error) {
      toast.error("Failed to start contract generation")
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
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading contracts...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>Error: {error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contracts</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{contracts.length} total</Badge>
            <Button variant="outline" size="sm" onClick={fetchContracts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-4">No contracts found.</div>
            <div className="text-sm">Create your first contract to get started.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-mono text-sm">{contract.contract_number}</TableCell>
                    <TableCell>{contract.title || contract.contract_name || "Untitled Contract"}</TableCell>
                    <TableCell>
                      <ContractStatusIndicator status={contract.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {contract.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleGenerate(contract.contract_number)}
                            className="flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" />
                            Generate
                          </Button>
                        )}

                        {contract.status === "failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerate(contract.contract_number)}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Retry
                          </Button>
                        )}

                        {contract.status === "completed" && contract.pdf_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(contract.pdf_url!, contract.contract_number)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
