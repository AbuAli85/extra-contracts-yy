"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import type { Contract } from "@/lib/types"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { LifecycleStatusIndicator } from "@/components/lifecycle-status-indicator"

interface ContractReportsTableProps {
  contracts: Contract[]
}

export function ContractReportsTable({ contracts }: ContractReportsTableProps) {
  const t = useTranslations("ContractReportsTable")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <p className="text-muted-foreground">{t("noContracts")}</p>
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
                  <TableHead>{t("value")}</TableHead>
                  <TableHead>{t("createdAt")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
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
                      {contract.contract_value ? `$${contract.contract_value.toLocaleString()}` : "N/A"}
                    </TableCell>
                    <TableCell>{contract.created_at ? format(new Date(contract.created_at), "PPP") : "N/A"}</TableCell>
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
