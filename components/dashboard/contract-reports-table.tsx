"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Loader2, ArrowUpDown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { devLog } from "@/lib/dev-log"
import type { Contract } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { LifecycleStatusIndicator } from "@/components/lifecycle-status-indicator"
import { useTranslations } from "next-intl"

type ContractSortKey =
  | keyof Contract
  | "contract_id"
  | "first_party_name_en"
  | "promoter_name_en"
  | "status"
  | "created_at"
  | null

interface ContractReportsTableProps {
  initialContracts?: Contract[]
}

export default function ContractReportsTable({ initialContracts = [] }: ContractReportsTableProps) {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<ContractSortKey>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()
  const t = useTranslations("DashboardContractReportsTable")

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select(
          "id, contract_id, first_party_name_en, second_party_name_en, promoter_name_en, contract_type, status, created_at, updated_at, start_date, end_date",
        )
        .order(sortKey || "created_at", { ascending: sortDirection === "asc" })
        .limit(100)

      if (error) throw error
      setContracts(data as Contract[])
    } catch (error: any) {
      console.error("Error fetching contracts:", error)
      toast({ title: "Error Fetching Contracts", description: error.message, variant: "destructive" })
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialContracts.length === 0) {
      fetchContracts()
    } else {
      setLoading(false) // If initial data is provided, no need to load
    }
  }, [sortKey, sortDirection, initialContracts])

  useEffect(() => {
    const channel = supabase
      .channel("public:contracts:feed") // Unique channel name
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, (payload) => {
        devLog("Contract change received:", payload)
        toast({
          title: "Contract Updated",
          description: `Contract ${payload.new?.contract_id || payload.old?.contract_id} has been updated.`,
        })
        fetchContracts() // Re-fetch all contracts to ensure consistency
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredContracts = useMemo(() => {
    if (!contracts) return []
    return contracts.filter(
      (contract) =>
        contract.contract_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.first_party_name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.second_party_name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.promoter_name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contract_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [contracts, searchTerm])

  const handleSort = (key: ContractSortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const SortableHeader = ({ tKey, label }: { tKey: ContractSortKey; label: string }) => (
    <TableHead onClick={() => handleSort(tKey)} className="cursor-pointer hover:bg-muted/50">
      <div className="flex items-center">
        {label}
        {sortKey === tKey && <ArrowUpDown className="ml-2 h-4 w-4" />}
      </div>
    </TableHead>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contractReportsTitle")}</CardTitle>
        <CardDescription>{t("contractReportsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchContracts")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <ScrollArea className="h-[400px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader tKey="contract_id" label={t("contractId")} />
                <SortableHeader tKey="first_party_name_en" label={t("firstParty")} />
                <SortableHeader tKey="second_party_name_en" label={t("secondParty")} />
                <SortableHeader tKey="promoter_name_en" label={t("promoter")} />
                <SortableHeader tKey="contract_type" label={t("contractType")} />
                <SortableHeader tKey="status" label={t("status")} />
                <SortableHeader tKey="created_at" label={t("createdAt")} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredContracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {t("noContractsFound")}
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.contract_id}</TableCell>
                    <TableCell>{contract.first_party_name_en}</TableCell>
                    <TableCell>{contract.second_party_name_en}</TableCell>
                    <TableCell>{contract.promoter_name_en}</TableCell>
                    <TableCell>{contract.contract_type}</TableCell>
                    <TableCell>
                      <LifecycleStatusIndicator status={contract.status} />
                    </TableCell>
                    <TableCell>{format(new Date(contract.created_at), "PPP")}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
