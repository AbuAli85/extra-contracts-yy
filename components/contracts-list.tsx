"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Play, RotateCcw, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"

export function ContractsList() {
  const { contracts, loading, error, fetchContracts, generateContract } = useContractsStore()

  // Enable real-time subscriptions
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleGenerate = async (contractNumber: string) => {
    await generateContract(contractNumber)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "queued":
        return <AlertCircle className="h-4 w-4" />
      case "processing":
        return <RotateCcw className="h-4 w-4 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "queued":
        return "outline"
      case "processing":
        return "default"
      case "completed":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (loading && contracts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RotateCcw className="h-6 w-6 animate-spin mr-2" />
            Loading contracts...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-600">
            <XCircle className="h-6 w-6 mr-2" />
            Error: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Contracts
          <Badge variant="outline">{contracts.length} total</Badge>
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
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(contract.status)}
                        <Badge variant={getStatusColor(contract.status) as any}>{contract.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
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
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}

                        {contract.status === "completed" && contract.pdf_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </a>
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
