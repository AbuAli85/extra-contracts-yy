"use client"

import type React from "react"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ContractStatusIndicator } from "@/components/contract-status-indicator"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { Download, Plus, RotateCcw } from "lucide-react"
import { toast } from "sonner"

export function ContractsList() {
  const t = useTranslations("contracts")
  const { contracts, isLoading, generateContract, retryContract, downloadContract } = useContractsStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    party_a: "",
    party_b: "",
    contract_type: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await generateContract(formData)
      setFormData({ party_a: "", party_b: "", contract_type: "", description: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error generating contract:", error)
    }
  }

  const handleRetry = async (contractId: string) => {
    try {
      await retryContract(contractId)
      toast.success("Contract retry initiated!")
    } catch (error) {
      console.error("Error retrying contract:", error)
    }
  }

  const handleDownload = async (contract: any) => {
    try {
      await downloadContract(contract)
    } catch (error) {
      console.error("Error downloading contract:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("title")}</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("generateNew")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("generateNew")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="party_a">{t("partyA")}</Label>
                <Input
                  id="party_a"
                  value={formData.party_a}
                  onChange={(e) => setFormData({ ...formData, party_a: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="party_b">{t("partyB")}</Label>
                <Input
                  id="party_b"
                  value={formData.party_b}
                  onChange={(e) => setFormData({ ...formData, party_b: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contract_type">{t("contractType")}</Label>
                <Input
                  id="contract_type"
                  value={formData.contract_type}
                  onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Generating..." : t("generate")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No contracts found. Generate your first contract to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("number")}</TableHead>
                <TableHead>{t("partyA")}</TableHead>
                <TableHead>{t("partyB")}</TableHead>
                <TableHead>{t("contractType")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
                <TableHead>{t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>{contract.party_a}</TableCell>
                  <TableCell>{contract.party_b}</TableCell>
                  <TableCell>{contract.contract_type}</TableCell>
                  <TableCell>
                    <ContractStatusIndicator status={contract.status} />
                  </TableCell>
                  <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {contract.status === "completed" && contract.pdf_url && (
                        <Button variant="outline" size="sm" onClick={() => handleDownload(contract)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {contract.status === "failed" && (
                        <Button variant="outline" size="sm" onClick={() => handleRetry(contract.id)}>
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
