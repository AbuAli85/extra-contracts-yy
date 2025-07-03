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
import LifecycleStatusIndicator from "@/components/lifecycle-status-indicator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PromoterDetails extends Promoter {
  contracts: ContractRecord<{ first_party?: Party; second_party?: Party }>[]
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
            <div className="flex items-center gap-4 mb-2">
              <Avatar className="h-16 w-16">
                {promoterDetails.profile_image_url ? (
                  <AvatarImage src={promoterDetails.profile_image_url} alt={promoterDetails.name_en} />
                ) : (
                  <AvatarFallback aria-label="Promoter initials">
                    {promoterDetails.name_en
                      ? promoterDetails.name_en.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                      : "P"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100" aria-label="Promoter name">
                  {promoterDetails.name_en}
                </h1>
                <p className="text-muted-foreground" dir="rtl" aria-label="Promoter Arabic name">
                  {promoterDetails.name_ar}
                </p>
              </div>
            </div>
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
          {/* Promoter Info & Documents Column */}
          <div className="space-y-6 lg:col-span-1 lg:space-y-8">
            <Card className="bg-card shadow-sm">
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
                  value={
                    promoterDetails.created_at
                      ? format(parseISO(promoterDetails.created_at), "PPP")
                      : "N/A"
                  }
                />
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileTextIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Identification Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-1 text-sm font-medium">ID Card</h4>
                  <div className="flex items-center gap-2">
                    <idCardStatus.Icon className={`h-4 w-4 ${idCardStatus.colorClass}`} />
                    <span className={`text-xs ${idCardStatus.colorClass}`}>
                      {idCardStatus.text}
                    </span>
                  </div>
                  {idCardStatus.tooltip && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{idCardStatus.tooltip}</p>
                  )}
                  {promoterDetails.id_card_url && (
                    <a
                      href={promoterDetails.id_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View Document <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <Separator />
                <div>
                  <h4 className="mb-1 text-sm font-medium">Passport</h4>
                  <div className="flex items-center gap-2">
                    <passportStatus.Icon className={`h-4 w-4 ${passportStatus.colorClass}`} />
                    <span className={`text-xs ${passportStatus.colorClass}`}>
                      {passportStatus.text}
                    </span>
                  </div>
                  {passportStatus.tooltip && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{passportStatus.tooltip}</p>
                  )}
                  {promoterDetails.passport_url && (
                    <a
                      href={promoterDetails.passport_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View Document <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contracts Column */}
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            <Card className="bg-card shadow-sm">
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
                                <span className="font-medium">
                                  {contract.first_party && typeof contract.first_party === 'object' && 'name_en' in contract.first_party
                                    ? contract.first_party.name_en || "N/A"
                                    : "N/A"}
                                </span>
                                <span className="text-muted-foreground"> vs </span>
                                <span className="font-medium">
                                  {contract.second_party && typeof contract.second_party === 'object' && 'name_en' in contract.second_party
                                    ? contract.second_party.name_en || "N/A"
                                    : "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              {contract.contract_start_date && contract.contract_end_date
                                ? `${format(parseISO(contract.contract_start_date), "dd-MM-yyyy")} - ${format(parseISO(contract.contract_end_date), "dd-MM-yyyy")}`
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              {contract.google_doc_url ? (
                                <a
                                  href={contract.google_doc_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
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
                  <p className="py-4 text-center text-sm text-muted-foreground">
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
