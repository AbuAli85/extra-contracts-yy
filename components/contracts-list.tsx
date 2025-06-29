"use client"

import { useState } from "react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, RefreshCw, Plus, FileText } from "lucide-react"
import { toast } from "sonner"

export function ContractsList() {
  const { contracts, loading, generateContract, retryContract, downloadContract } = useContractsStore()
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [contractNumber, setContractNumber] = useState("")

  const handleGenerate = async () => {
    if (!contractNumber.trim()) {
      toast.error("Please enter a contract number")
      return
    }

    await generateContract({ contract_number: contractNumber.trim() })
    setContractNumber("")
    setIsGenerateDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      queued: "outline",
      processing: "default",
      completed: "default",
      failed: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status === "processing" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Contracts
        </CardTitle>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
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
                  placeholder="e.g., CONTRACT-2024-001"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No contracts found</p>
            <Button onClick={() => setIsGenerateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Your First Contract
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
                  <TableCell className="font-mono">{contract.contract_number}</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {(contract.status === "pending" || contract.status === "failed") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryContract(contract.contract_number)}
                          disabled={loading}
                        >
                          {contract.status === "failed" ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
                            </>
                          ) : (
                            "Generate"
                          )}
                        </Button>
                      )}
                      {contract.pdf_url && (
                        <Button size="sm" variant="outline" onClick={() => downloadContract(contract)}>
                          <Download className="w-3 h-3 mr-1" />
                          Download
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
