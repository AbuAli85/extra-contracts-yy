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
import { ContractStatusIndicator } from "./contract-status-indicator"
import { useContractsStore } from "@/lib/stores/contracts-store"
import type { ContractFormData } from "@/lib/stores/contracts-store"
import { Download, Plus, RotateCcw } from "lucide-react"

export function ContractsList() {
  const t = useTranslations("contracts")
  const { contracts, isLoading, generateContract, retryContract, downloadContract } = useContractsStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ContractFormData>({
    party_a: "",
    party_b: "",
    contract_type: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generateContract(formData)
    setFormData({ party_a: "", party_b: "", contract_type: "", description: "" })
    setIsDialogOpen(false)
  }

  const handleInputChange = (field: keyof ContractFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
                  onChange={(e) => handleInputChange("party_a", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="party_b">{t("partyB")}</Label>
                <Input
                  id="party_b"
                  value={formData.party_b}
                  onChange={(e) => handleInputChange("party_b", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contract_type">{t("contractType")}</Label>
                <Input
                  id="contract_type"
                  value={formData.contract_type}
                  onChange={(e) => handleInputChange("contract_type", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
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
                  <div className="flex space-x-2">
                    {contract.status === "completed" && contract.pdf_url && (
                      <Button size="sm" variant="outline" onClick={() => downloadContract(contract)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {contract.status === "failed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryContract(contract.id)}
                        disabled={isLoading}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {contracts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No contracts found. Generate your first contract to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
