"use client"

import { useState, useEffect } from "react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContractStatusIndicator } from "@/components/contract-status-indicator"
import { Plus, Download, RotateCcw, FileText } from "lucide-react"

export function ContractsList() {
  const { contracts, isLoading, error, fetchContracts, generateContract, retryContract, downloadContract } =
    useContractsStore()

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    party1_name: "",
    party1_email: "",
    party2_name: "",
    party2_email: "",
    contract_type: "service_agreement",
    terms: "",
  })

  // Set up real-time subscriptions
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleGenerateContract = async () => {
    try {
      await generateContract(formData)
      setIsGenerateDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        party1_name: "",
        party1_email: "",
        party2_name: "",
        party2_email: "",
        contract_type: "service_agreement",
        terms: "",
      })
    } catch (error) {
      // Error is handled in the store
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error loading contracts: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>Manage and track your contract generation</CardDescription>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate New Contract</DialogTitle>
                <DialogDescription>Fill in the details to generate a new contract</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Contract Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Service Agreement"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract_type">Contract Type</Label>
                    <select
                      id="contract_type"
                      value={formData.contract_type}
                      onChange={(e) => handleInputChange("contract_type", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="service_agreement">Service Agreement</option>
                      <option value="employment_contract">Employment Contract</option>
                      <option value="nda">Non-Disclosure Agreement</option>
                      <option value="partnership">Partnership Agreement</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the contract"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="party1_name">Party 1 Name</Label>
                    <Input
                      id="party1_name"
                      value={formData.party1_name}
                      onChange={(e) => handleInputChange("party1_name", e.target.value)}
                      placeholder="Company/Individual Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="party1_email">Party 1 Email</Label>
                    <Input
                      id="party1_email"
                      type="email"
                      value={formData.party1_email}
                      onChange={(e) => handleInputChange("party1_email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="party2_name">Party 2 Name</Label>
                    <Input
                      id="party2_name"
                      value={formData.party2_name}
                      onChange={(e) => handleInputChange("party2_name", e.target.value)}
                      placeholder="Company/Individual Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="party2_email">Party 2 Email</Label>
                    <Input
                      id="party2_email"
                      type="email"
                      value={formData.party2_email}
                      onChange={(e) => handleInputChange("party2_email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Special Terms</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => handleInputChange("terms", e.target.value)}
                    placeholder="Any special terms or conditions"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateContract}>Generate Contract</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No contracts found</p>
            <p className="text-sm">Generate your first contract to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.title || "Untitled Contract"}</TableCell>
                  <TableCell>
                    <ContractStatusIndicator status={contract.status} />
                  </TableCell>
                  <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {contract.status === "completed" && contract.pdf_url && (
                        <Button variant="outline" size="sm" onClick={() => downloadContract(contract.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {contract.status === "failed" && (
                        <Button variant="outline" size="sm" onClick={() => retryContract(contract.id)}>
                          <RotateCcw className="h-4 w-4" />
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
