"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Play, AlertCircle } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { ContractStatusIndicator } from "./contract-status-indicator"
import { toast } from "sonner"

export function ContractsList() {
  const { contracts, loading, error, fetchContracts, generateContract } = useContractsStore()

  // Enable real-time subscriptions
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
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Download started!")
  }

  if (loading && contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading contracts...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          Error: {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Contracts
          <Badge variant="secondary">{contracts.length} total</Badge>
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
                    <TableCell className="font-medium">{contract.contract_number}</TableCell>
                    <TableCell>{contract.title || "Untitled Contract"}</TableCell>
                    <TableCell>
                      <ContractStatusIndicator status={contract.status} />
                    </TableCell>
                    <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {contract.status === "pending" && (
                          <Button size="sm" onClick={() => handleGenerate(contract.contract_number)} disabled={loading}>
                            <Play className="h-4 w-4 mr-1" />
                            Generate
                          </Button>
                        )}

                        {contract.status === "failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerate(contract.contract_number)}
                            disabled={loading}
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
