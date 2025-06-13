import type React from "react"
import { supabase } from "@/lib/supabase"
import type { ContractRecord } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowLeftIcon,
  EditIcon,
  FileTextIcon,
  ExternalLinkIcon,
  Building2,
  UserCircle2,
  AlertTriangleIcon,
  CalendarDays,
  LinkIcon,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import LifecycleStatusIndicator from "@/components/lifecycle-status-indicator"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

async function getContractDetails(id: string): Promise<ContractRecord | null> {
  const { data, error } = await supabase
    .from("contracts")
    .select(
      `
    *,
    first_party:parties!contracts_first_party_id_fkey (name_en, name_ar, crn),
    second_party:parties!contracts_second_party_id_fkey (name_en, name_ar, crn),
    promoter:promoters!contracts_promoter_id_fkey (name_en, name_ar, id_card_number, id_card_url, passport_url)
  `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching contract details:", error)
    return null
  }
  return data as unknown as ContractRecord & {
    first_party: { name_en: string; name_ar: string; crn: string }
    second_party: { name_en: string; name_ar: string; crn: string }
    promoter: {
      name_en: string
      name_ar: string
      id_card_number: string
      id_card_url?: string | null
      passport_url?: string | null
    }
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

function SectionCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  const contract = await getContractDetails(params.id)

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Contract Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/80">
              The contract with ID <span className="font-mono text-primary">{params.id}</span> could not be found.
            </p>
            <Link href="/contracts" passHref className="mt-6 inline-block">
              <Button variant="outline">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Contracts List
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const firstParty = contract.first_party as any
  const secondParty = contract.second_party as any
  const promoter = contract.promoter as any

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 sm:py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link href="/contracts" passHref>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Contracts
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">Contract Overview</h1>
            <p className="text-muted-foreground">
              Reference ID:{" "}
              <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
                {contract.id}
              </span>
            </p>
          </div>
          <Link href={`/contracts/${contract.id}/edit`} passHref>
            <Button>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Contract
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <SectionCard title="Parties Involved" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-3 p-4 border rounded-md bg-background/50">
                  <h4 className="font-medium text-card-foreground">First Party</h4>
                  <DetailItem label="Name (EN)" value={firstParty?.name_en} />
                  <DetailItem label="Name (AR)" value={firstParty?.name_ar} isRtl />
                  <DetailItem label="CRN" value={firstParty?.crn} />
                </div>
                <div className="space-y-3 p-4 border rounded-md bg-background/50">
                  <h4 className="font-medium text-card-foreground">Second Party</h4>
                  <DetailItem label="Name (EN)" value={secondParty?.name_en} />
                  <DetailItem label="Name (AR)" value={secondParty?.name_ar} isRtl />
                  <DetailItem label="CRN" value={secondParty?.crn} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Promoter Details" icon={UserCircle2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="Name (EN)" value={promoter?.name_en} />
                <DetailItem label="Name (AR)" value={promoter?.name_ar} isRtl />
                <DetailItem label="ID Card Number" value={promoter?.id_card_number} />
                <DetailItem
                  label="ID Card Document"
                  value={
                    promoter?.id_card_url ? (
                      <a
                        href={promoter.id_card_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        View Document <ExternalLinkIcon className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not provided</span>
                    )
                  }
                />
                <DetailItem
                  label="Passport Document"
                  value={
                    promoter?.passport_url ? (
                      <a
                        href={promoter.passport_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        View Document <ExternalLinkIcon className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not provided</span>
                    )
                  }
                />
              </div>
            </SectionCard>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <SectionCard title="Contract Status & Dates" icon={CalendarDays}>
              <div className="space-y-4">
                <DetailItem
                  label="Lifecycle Status"
                  value={
                    contract.contract_start_date && contract.contract_end_date ? (
                      <LifecycleStatusIndicator
                        startDate={contract.contract_start_date}
                        endDate={contract.contract_end_date}
                      />
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Dates Missing
                      </Badge>
                    )
                  }
                />
                <DetailItem
                  label="Generation Status"
                  value={
                    <Badge
                      variant={contract.status === "GENERATION_ERROR" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {contract.status?.replace(/_/g, " ") || "N/A"}
                    </Badge>
                  }
                />
                <Separator />
                <DetailItem
                  label="Start Date"
                  value={
                    contract.contract_start_date
                      ? format(parseISO(contract.contract_start_date), "MMMM d, yyyy")
                      : "Not set"
                  }
                />
                <DetailItem
                  label="End Date"
                  value={
                    contract.contract_end_date
                      ? format(parseISO(contract.contract_end_date), "MMMM d, yyyy")
                      : "Not set"
                  }
                />
                <DetailItem
                  label="Created At"
                  value={
                    contract.created_at ? format(parseISO(contract.created_at), "MMMM d, yyyy 'at' h:mm a") : "Not set"
                  }
                />
              </div>
            </SectionCard>

            {contract.status === "GENERATION_ERROR" && contract.error_details && (
              <SectionCard
                title="Error Information"
                icon={AlertTriangleIcon}
                className="bg-destructive/10 border-destructive/30"
              >
                <DetailItem
                  label="Details"
                  value={contract.error_details}
                  labelClassName="text-sm text-destructive/80"
                  valueClassName="text-sm font-mono text-destructive whitespace-pre-wrap"
                />
              </SectionCard>
            )}

            {contract.google_doc_url && (
              <SectionCard title="Generated Document" icon={LinkIcon}>
                <a href={contract.google_doc_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    View Google Document
                  </Button>
                </a>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
