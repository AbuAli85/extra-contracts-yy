"use client" // Using client component for potential future interactions and hooks

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Promoter, ContractRecord, Party } from "@/lib/types"
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
  ShieldCheckIcon,
  ShieldAlertIcon,
  AlertTriangleIcon,
  EditIcon,
} from "lucide-react"
import { format, parseISO, differenceInDays, isPast } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import LifecycleStatusIndicator from "@/components/lifecycle-status-indicator"

interface PromoterDetails extends Promoter {
  contracts: ContractRecord<{ first_party?: Party; second_party?: Party }>[]
}

// Re-using helper from manage-promoters page
const getDocumentStatus = (
  expiryDate: string | null | undefined,
): {
  text: string
  Icon: React.ElementType
  colorClass: string
  tooltip?: string
} => {
  if (!expiryDate) {
    return { text: "No Date", Icon: AlertTriangleIcon, colorClass: "text-slate-500", tooltip: "Expiry date not set" }
  }
  const date = parseISO(expiryDate)
  const today = new Date()
  const daysUntilExpiry = differenceInDays(date, today)

  if (isPast(date)) {
    return {
      text: "Expired",
      Icon: ShieldAlertIcon,
      colorClass: "text-red-500",
      tooltip: `Expired on ${format(date, "MMM d, yyyy")}`,
    }
  }
  if (daysUntilExpiry <= 30) {
    return {
      text: "Expires Soon",
      Icon: ShieldAlertIcon,
      colorClass: "text-orange-500",
      tooltip: `Expires in ${daysUntilExpiry} day(s) on ${format(date, "MMM d, yyyy")}`,
    }
  }
  return {
    text: "Valid",
    Icon: ShieldCheckIcon,
    colorClass: "text-green-500",
    tooltip: `Valid until ${format(date, "MMM d, yyyy")}`,
  }
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
  const promoterId = params.id as string

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
        contracts:
          (contractsData as ContractRecord<{
            first_party?: Party
            second_party?: Party
          }>[]) || [],
      })
      setIsLoading(false)
    }

    fetchPromoterDetails()
  }, [promoterId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg text-slate-700 dark:text-slate-300">Loading promoter details...</p>
      </div>
    )
  }

  if (error || !promoterDetails) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/80">{error || "Could not load promoter details."}</p>
            <Button variant="outline" onClick={() => router.push("/manage-promoters")} className="mt-6">
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 sm:py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <h1 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{promoterDetails.name_en}</h1>
            <p className="text-muted-foreground" dir="rtl">
              {promoterDetails.name_ar}
            </p>
          </div>
          <Button asChild>
            <Link href={`/manage-promoters/${promoterId}/edit`}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Promoter
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Promoter Info & Documents Column */}
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <Card className="shadow-sm bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <UserCircle2Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <DetailItem label="ID Card Number" value={promoterDetails.id_card_number} />
                <DetailItem
                  label="Created At"
                  value={promoterDetails.created_at ? format(parseISO(promoterDetails.created_at), "PPP") : "N/A"}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileTextIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Identification Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">ID Card</h4>
                  <div className="flex items-center gap-2">
                    <idCardStatus.Icon className={`h-4 w-4 ${idCardStatus.colorClass}`} />
                    <span className={`text-xs ${idCardStatus.colorClass}`}>{idCardStatus.text}</span>
                  </div>
                  {idCardStatus.tooltip && (
                    <p className="text-xs text-muted-foreground mt-0.5">{idCardStatus.tooltip}</p>
                  )}
                  {promoterDetails.id_card_url && (
                    <a
                      href={promoterDetails.id_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-xs mt-1"
                    >
                      View Document <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Passport</h4>
                  <div className="flex items-center gap-2">
                    <passportStatus.Icon className={`h-4 w-4 ${passportStatus.colorClass}`} />
                    <span className={`text-xs ${passportStatus.colorClass}`}>{passportStatus.text}</span>
                  </div>
                  {passportStatus.tooltip && (
                    <p className="text-xs text-muted-foreground mt-0.5">{passportStatus.tooltip}</p>
                  )}
                  {promoterDetails.passport_url && (
                    <a
                      href={promoterDetails.passport_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-xs mt-1"
                    >
                      View Document <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contracts Column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <Card className="shadow-sm bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BriefcaseIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Associated Contracts</CardTitle>
                </div>
                <CardDescription>
                  Total Contracts: {promoterDetails.contracts.length}
                  <span className="mx-1">|</span>
                  Active:{" "}
                  {
                    promoterDetails.contracts.filter(
                      (c) => c.contract_end_date && !isPast(parseISO(c.contract_end_date)),
                    ).length
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {promoterDetails.contracts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lifecycle</TableHead>
                          <TableHead>Parties</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead className="text-right">Document</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {promoterDetails.contracts.map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell>
                              <LifecycleStatusIndicator
                                startDate={contract.contract_start_date}
                                endDate={contract.contract_end_date}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <span className="font-medium">{contract.first_party?.name_en || "N/A"}</span>
                                <span className="text-muted-foreground"> vs </span>
                                <span className="font-medium">{contract.second_party?.name_en || "N/A"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              {format(parseISO(contract.contract_start_date), "dd MMM yy")} -{" "}
                              {format(parseISO(contract.contract_end_date), "dd MMM yy")}
                            </TableCell>
                            <TableCell className="text-right">
                              {contract.google_doc_url ? (
                                <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <ExternalLinkIcon className="h-4 w-4 text-primary" />
                                  </Button>
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No contracts associated with this promoter.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
