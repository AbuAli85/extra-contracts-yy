"use client"

import type React from "react"

import { useState } from "react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContractStatusIndicator } from "./contract-status-indicator"
import { Download, Plus, RefreshCw, FileText } from "lucide-react"
import { toast } from "sonner"

export function ContractsList() {
  const { contracts, loading, generateContract, retryContract, downloadContract } = useContractsStore()
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    contract_number: "",
    party1_id: "",
    party2_id: "",
    contract_type: "service_agreement",
  })

  // Set up real-time subscriptions
  useRealtimeContracts()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.contract_number.trim()) {
      toast.error("Contract number is required")
      return
    }

    try {
      await generateContract(formData)
      setIsGenerateDialogOpen(false)
      setFormData({
        contract_number: "",
        party1_id: "",
        party2_id: "",
        contract_type: "service_agreement",
      })
    } catch (error) {
      console.error("Error generating contract:", error)
    }
  }

  const handleRetry = async (contract_number: string) => {
    try {
      await retryContract(contract_number)
    } catch (error) {
      console.error("Error retrying contract:", error)
    }
  }

  const handleDownload = (pdf_url: string, contract_number: string) => {
    downloadContract(pdf_url, contract_number)
  }

  if (loading && contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading contracts...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contracts
        </CardTitle>
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
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <Label htmlFor="contract_number">Contract Number *</Label>
                <Input
                  id="contract_number"
                  value={formData.contract_number}
                  onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                  placeholder="Enter contract number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contract_type">Contract Type</Label>
                <Select
                  value={formData.contract_type}
                  onValueChange={(value) => setFormData({ ...formData, contract_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service_agreement">Service Agreement</SelectItem>
                    <SelectItem value="employment_contract">Employment Contract</SelectItem>
                    <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                    <SelectItem value="partnership">Partnership Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="party1_id">Party 1 ID (Optional)</Label>
                <Input
                  id="party1_id"
                  value={formData.party1_id}
                  onChange={(e) => setFormData({ ...formData, party1_id: e.target.value })}
                  placeholder="Enter party 1 ID"
                />
              </div>
              <div>
                <Label htmlFor="party2_id">Party 2 ID (Optional)</Label>
                <Input
                  id="party2_id"
                  value={formData.party2_id}
                  onChange={(e) => setFormData({ ...formData, party2_id: e.target.value })}
                  placeholder="Enter party 2 ID"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Generate</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No contracts found</p>
            <p className="text-sm text-muted-foreground">Generate your first contract to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>
                    {contract.contract_type?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}
                  </TableCell>
                  <TableCell>
                    <ContractStatusIndicator status={contract.status} />
                  </TableCell>
                  <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {contract.status === "completed" && contract.pdf_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(contract.pdf_url!, contract.contract_number)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {contract.status === "failed" && (
                        <Button size="sm" variant="outline" onClick={() => handleRetry(contract.contract_number)}>
                          <RefreshCw className="h-4 w-4" />
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
