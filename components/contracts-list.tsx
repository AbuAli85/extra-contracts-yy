"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Play, RotateCcw, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { ContractStatusIndicator } from "./contract-status-indicator"
import { toast } from "sonner"

export function ContractsList() {
  const { contracts, loading, error, fetchContracts, generateContract, retryContract } = useContractsStore()

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

  const handleRetry = async (contractNumber: string) => {
    try {
      await retryContract(contractNumber)
      toast.success("Contract generation retried!")
    } catch (error) {
      toast.error("Failed to retry contract generation")
    }
  }

  const handleDownload = (pdfUrl: string, contractNumber: string) => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `contract-${contractNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Download started!")
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
          <XCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Contracts ({contracts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No contracts found. Create your first contract to get started.
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-mono">{contract.contract_number}</TableCell>
                    <TableCell>{contract.title || "Untitled Contract"}</TableCell>
                    <TableCell>
                      <ContractStatusIndicator status={contract.status} />
                    </TableCell>
                    <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                            onClick={() => handleRetry(contract.contract_number)}
                            className="flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" />
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

                        {(contract.status === "queued" || contract.status === "processing") && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {contract.status === "queued" ? "Queued" : "Processing"}
                          </Badge>
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
