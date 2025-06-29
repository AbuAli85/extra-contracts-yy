"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { ContractStatusIndicator } from "./contract-status-indicator"
import { Download, Plus, RefreshCw, FileText } from "lucide-react"
import { toast } from "sonner"

export function ContractsList() {
  const { contracts, loading, fetchContracts, generateContract, retryContract, downloadContract } = useContractsStore()
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [contractNumber, setContractNumber] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Set up real-time subscriptions
  useRealtimeContracts()

  // Fetch contracts on component mount
  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleGenerateContract = async () => {
    if (!contractNumber.trim()) {
      toast.error("Please enter a contract number")
      return
    }

    setIsGenerating(true)
    try {
      await generateContract(contractNumber.trim())
      setContractNumber("")
      setIsGenerateDialogOpen(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetryContract = async (contractNum: string) => {
    await retryContract(contractNum)
  }

  const handleDownloadContract = (pdfUrl: string, contractNum: string) => {
    downloadContract(pdfUrl, contractNum)
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contracts
            </CardTitle>
            <CardDescription>Manage and track your contract generation</CardDescription>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Contract
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Contract</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contract-number">Contract Number</Label>
                  <Input
                    id="contract-number"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    placeholder="Enter contract number"
                    disabled={isGenerating}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)} disabled={isGenerating}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateContract} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
            <p className="text-muted-foreground mb-4">Get started by generating your first contract</p>
            <Button onClick={() => setIsGenerateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Contract
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>
                    <ContractStatusIndicator status={contract.status} />
                  </TableCell>
                  <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {contract.status === "failed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryContract(contract.contract_number)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                      {contract.status === "completed" && contract.pdf_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadContract(contract.pdf_url!, contract.contract_number)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {contract.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryContract(contract.contract_number)}
                        >
                          Generate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
