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

type ContractDetail = ContractRecord<{
  employer: { name_en: string; name_ar: string; crn: string }
  client: { name_en: string; name_ar: string; crn: string }
  promoters: {
    name_en: string
    name_ar: string
    id_card_number: string
    id_card_url?: string | null
    passport_url?: string | null
  }[]
}>

async function getContractDetails(id: string): Promise<ContractDetail | null> {
  const { data, error } = await supabase
    .from("contracts")
    .select(
      `
    *,
    employer:parties!contracts_employer_id_fkey (name_en, name_ar, crn),
    client:parties!contracts_client_id_fkey (name_en, name_ar, crn),
    promoters(id,name_en,name_ar,id_card_number,id_card_url,passport_url)
  `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching contract details:", error)
    return null
  }
  return data as unknown as ContractDetail
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
    <Card className={`shadow-sm transition-shadow duration-300 hover:shadow-md ${className}`}>
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

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contract = await getContractDetails(id)

  if (!contract) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
        <Card className="w-full max-w-lg bg-card text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Contract Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/80">
              The contract with ID <span className="font-mono text-primary">{id}</span> could
              not be found.
            </p>
            <Button asChild variant="outline" className="mt-6 inline-block">
              <Link href="/contracts">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Contracts List
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const employerParty = contract.employer
  const clientParty = contract.client
  const promoter = contract.promoters && contract.promoters.length > 0 ? contract.promoters[0] : null

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 dark:bg-slate-950 sm:py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/contracts">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Contracts
              </Link>
            </Button>
            <h1 className="mt-2 text-3xl font-bold">Contract Overview</h1>
            <p className="text-muted-foreground">
              Reference ID:{" "}
              <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
                {contract.id}
              </span>
            </p>
          </div>
          <Button asChild>
            <Link href={`/edit-contract/${contract.id}`}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Contract
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content Column */}
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            <SectionCard title="Parties Involved" icon={Building2}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <div className="space-y-3 rounded-md border bg-background/50 p-4">
                  <h4 className="font-medium text-card-foreground">Employer</h4>
                  <DetailItem label="Name (EN)" value={employerParty?.name_en} />
                  <DetailItem label="Name (AR)" value={employerParty?.name_ar} isRtl />
                  <DetailItem label="CRN" value={employerParty?.crn} />
                </div>
                <div className="space-y-3 rounded-md border bg-background/50 p-4">
                  <h4 className="font-medium text-card-foreground">Client</h4>
                  <DetailItem label="Name (EN)" value={clientParty?.name_en} />
                  <DetailItem label="Name (AR)" value={clientParty?.name_ar} isRtl />
                  <DetailItem label="CRN" value={clientParty?.crn} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Promoter Details" icon={UserCircle2}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
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
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
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
          <div className="space-y-6 lg:col-span-1 lg:space-y-8">
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
                      ? format(parseISO(contract.contract_start_date), "dd-MM-yyyy")
                      : "Not set"
                  }
                />
                <DetailItem
                  label="End Date"
                  value={
                    contract.contract_end_date
                      ? format(parseISO(contract.contract_end_date), "dd-MM-yyyy")
                      : "Not set"
                  }
                />
                <DetailItem
                  label="Created At"
                  value={
                    contract.created_at
                      ? format(parseISO(contract.created_at), "MMMM d, yyyy 'at' h:mm a")
                      : "Not set"
                  }
                />
              </div>
            </SectionCard>

            {contract.status === "GENERATION_ERROR" && contract.error_details && (
              <SectionCard
                title="Error Information"
                icon={AlertTriangleIcon}
                className="border-destructive/30 bg-destructive/10"
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
