"use client" // Using client component for potential future interactions and hooks

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Promoter, Contract, Party } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowLeftIcon,
  UserCircle2Icon,
  FileTextIcon,
  BriefcaseIcon,
  ExternalLinkIcon,
  Loader2,
  EditIcon,
} from "lucide-react"
import { format, parseISO, isPast } from "date-fns"
import { getDocumentStatus } from "@/lib/document-status"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DocumentStatusBadge } from "@/components/document-status-badge"

interface PromoterDetails extends Promoter {
  contracts: Contract[]
}

function DetailItem({
  label,
  value,
  isRtl = false,
  className = "",
  labelClassName = "text-sm text-muted-foreground",
  valueClassName = "text-sm font-medium",
}: {
  label: string
  value?: string | null | React.ReactNode
  isRtl?: boolean
  className?: string
  labelClassName?: string
  valueClassName?: string
}) {
  if (value === null || typeof value === "undefined" || value === "") {
    return null
  }
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <p className={labelClassName}>{label}</p>
      {typeof value === "string" ? (
        <p className={`${valueClassName} ${isRtl ? "text-right" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
          {value}
        </p>
      ) : (
        <div className={valueClassName}>{value}</div>
      )}
    </div>
  )
}

export default function PromoterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const promoterId = params?.id as string

  const [promoterDetails, setPromoterDetails] = useState<PromoterDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!promoterId) return

    async function fetchPromoterDetails() {
      setIsLoading(true)
      setError(null)

      const { data: promoterData, error: promoterError } = await supabase
        .from("promoters")
        .select("*")
        .eq("id", promoterId)
        .single()

      if (promoterError || !promoterData) {
        setError(promoterError?.message || "Promoter not found.")
        setIsLoading(false)
        return
      }

      const { data: contractsData, error: contractsError } = await supabase
        .from("contracts")
        .select(
          `
      *,
      first_party:parties!contracts_first_party_id_fkey(id, name_en, name_ar, crn),
      second_party:parties!contracts_second_party_id_fkey(id, name_en, name_ar, crn)
    `,
        )
        .eq("promoter_id", promoterId)
        .order("contract_start_date", { ascending: false })

      if (contractsError) {
        console.warn("Could not fetch contracts for promoter:", contractsError.message)
        // Continue with promoter data, contracts will be empty array
      }

      setPromoterDetails({
        ...promoterData,
        contracts: (contractsData as Contract[]) || [],
      })
      setIsLoading(false)
    }

    fetchPromoterDetails()
  }, [promoterId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg text-slate-700 dark:text-slate-300">
          Loading promoter details...
        </p>
      </div>
    )
  }

  if (error || !promoterDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
        <Card className="w-full max-w-md bg-card text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/80">{error || "Could not load promoter details."}</p>
            <Button
              variant="outline"
              onClick={() => router.push("/manage-promoters")}
              className="mt-6"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Promoter List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const idCardStatus = getDocumentStatus(promoterDetails.id_card_expiry_date)
  const passportStatus = getDocumentStatus(promoterDetails.passport_expiry_date)

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 dark:bg-slate-950 sm:py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/manage-promoters")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Promoter List
            </Button>
            <h1 className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
              {promoterDetails.name_en}
            </h1>
            <p className="text-muted-foreground" dir="rtl">
              {promoterDetails.name_ar}
            </p>
          </div>
          <Button 
            asChild
            disabled={!promoterId}
          >
            <Link href={promoterId ? `/manage-promoters/${promoterId}/edit` : "#"}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Promoter
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Promoter Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle2Icon className="h-5 w-5" />
                  Promoter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailItem label="Name (English)" value={promoterDetails.name_en} />
                  <DetailItem label="Name (Arabic)" value={promoterDetails.name_ar} isRtl />
                  <DetailItem label="Email" value={promoterDetails.email} />
                  <DetailItem label="Phone" value={promoterDetails.phone} />
                  <DetailItem label="National ID" value={promoterDetails.national_id} />
                  <DetailItem label="CRN" value={promoterDetails.crn} />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailItem
                    label="ID Card Expiry"
                    value={
                      promoterDetails.id_card_expiry_date
                        ? format(parseISO(promoterDetails.id_card_expiry_date), "PPP")
                        : null
                    }
                  />
                  <DetailItem
                    label="Passport Expiry"
                    value={
                      promoterDetails.passport_expiry_date
                        ? format(parseISO(promoterDetails.passport_expiry_date), "PPP")
                        : null
                    }
                  />
                </div>

                {(promoterDetails.id_card_expiry_date || promoterDetails.passport_expiry_date) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Document Status</h4>
                      <div className="flex flex-wrap gap-3">
                        {promoterDetails.id_card_expiry_date && (
                          <DocumentStatusBadge
                            status={idCardStatus.status}
                            label="ID Card"
                            expiryDate={promoterDetails.id_card_expiry_date}
                          />
                        )}
                        {promoterDetails.passport_expiry_date && (
                          <DocumentStatusBadge
                            status={passportStatus.status}
                            label="Passport"
                            expiryDate={promoterDetails.passport_expiry_date}
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {promoterDetails.address && (
                  <>
                    <Separator />
                    <DetailItem label="Address" value={promoterDetails.address} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contracts Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Contracts Summary
                </CardTitle>
                <CardDescription>
                  {promoterDetails.contracts.length} total contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Contracts</span>
                    <span className="text-sm font-medium">
                      {promoterDetails.contracts.filter((contract) =>
                        contract.contract_end_date
                          ? !isPast(parseISO(contract.contract_end_date))
                          : true,
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expired Contracts</span>
                    <span className="text-sm font-medium">
                      {promoterDetails.contracts.filter((contract) =>
                        contract.contract_end_date
                          ? isPast(parseISO(contract.contract_end_date))
                          : false,
                      ).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href={`/generate-contract?promoter=${promoterId}`}>
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Generate New Contract
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href={`/manage-promoters/${promoterId}/edit`}>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit Promoter
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contracts List */}
        {promoterDetails.contracts.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Contracts
                </CardTitle>
                <CardDescription>
                  All contracts associated with this promoter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract ID</TableHead>
                        <TableHead>First Party</TableHead>
                        <TableHead>Second Party</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promoterDetails.contracts.map((contract) => {
                        const isExpired = contract.contract_end_date
                          ? isPast(parseISO(contract.contract_end_date))
                          : false
                        return (
                          <TableRow key={contract.id}>
                            <TableCell className="font-mono text-sm">
                              {contract.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              {contract.first_party?.name_en || "N/A"}
                            </TableCell>
                            <TableCell>
                              {contract.second_party?.name_en || "N/A"}
                            </TableCell>
                            <TableCell>
                              {contract.contract_start_date
                                ? format(parseISO(contract.contract_start_date), "PP")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {contract.contract_end_date
                                ? format(parseISO(contract.contract_end_date), "PP")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  isExpired
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {isExpired ? "Expired" : "Active"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button asChild size="sm" variant="ghost">
                                <Link href={`/contracts/${contract.id}`}>
                                  <ExternalLinkIcon className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}