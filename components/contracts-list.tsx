"use client"

import { useEffect } from "react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { ContractStatusIndicator } from "./contract-status-indicator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, FileText, Calendar, Users } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

export function ContractsList() {
  const { contracts, loading, error, fetchContracts, retryContract, downloadContract } = useContractsStore()

  // Enable real-time updates
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleRetry = async (contractId: string) => {
    try {
      await retryContract(contractId)
      toast.success("Contract generation restarted")
    } catch (error) {
      toast.error("Failed to retry contract generation")
    }
  }

  const handleDownload = async (contractId: string) => {
    try {
      await downloadContract(contractId)
      toast.success("Contract downloaded")
    } catch (error) {
      toast.error("Failed to download contract")
    }
  }

  if (loading && contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading contracts...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading contracts</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchContracts} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts yet</h3>
            <p className="text-gray-500">Generate your first contract to get started.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Contracts ({contracts.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Parties</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="font-medium">{contract.contract_type}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{contract.parties.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contract.language === "both" ? "Bilingual" : contract.language.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ContractStatusIndicator status={contract.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(contract.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {contract.status === "completed" && contract.pdf_url && (
                        <Button size="sm" variant="outline" onClick={() => handleDownload(contract.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {contract.status === "failed" && (
                        <Button size="sm" variant="outline" onClick={() => handleRetry(contract.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                      {contract.status === "processing" && (
                        <div className="flex items-center space-x-1 text-sm text-blue-600">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
