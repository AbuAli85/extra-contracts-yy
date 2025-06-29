"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useContracts } from "@/hooks/use-contracts"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { LifecycleStatusIndicator } from "@/components/lifecycle-status-indicator"
import { ContractStatusFilter } from "@/components/contract-status-filter"
import { Loader2, PlusCircle } from "lucide-react"
import type { Contract } from "@/lib/types"

export default function ContractsPage() {
  const t = useTranslations("ContractsPage")
  const { data: contracts, isLoading, isError, error } = useContracts()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredContracts = useMemo(() => {
    if (!contracts) return []

    let filtered = contracts.filter((contract) =>
      contract.contract_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (selectedStatus && selectedStatus !== "All") {
      filtered = filtered.filter((contract) => contract.status === selectedStatus)
    }

    return filtered
  }, [contracts, searchTerm, selectedStatus])

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t("loadingContracts")}</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-red-500">
        {t("errorLoading")}: {error?.message || t("unknownError")}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t("contracts")}</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("searchContracts")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <ContractStatusFilter onSelectStatus={setSelectedStatus} />
            <Button asChild>
              <Link href="/generate-contract">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("newContract")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <div className="py-8 text-center text-gray-500">{t("noContractsFound")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("contractName")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead>{t("partyA")}</TableHead>
                    <TableHead>{t("partyB")}</TableHead>
                    <TableHead>{t("promoter")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("effectiveDate")}</TableHead>
                    <TableHead>{t("createdAt")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract: Contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.contract_name}</TableCell>
                      <TableCell>{contract.contract_type}</TableCell>
                      <TableCell>{contract.parties_a?.name || "N/A"}</TableCell>
                      <TableCell>{contract.parties_b?.name || "N/A"}</TableCell>
                      <TableCell>{contract.promoters?.name || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LifecycleStatusIndicator status={contract.status} />
                          <Badge variant="secondary">{contract.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {contract.effective_date ? format(new Date(contract.effective_date), "PPP") : "N/A"}
                      </TableCell>
                      <TableCell>
                        {contract.created_at ? format(new Date(contract.created_at), "PPP") : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contracts/${contract.id}`}>{t("view")}</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
