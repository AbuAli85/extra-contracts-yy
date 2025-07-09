"use client";

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ComboboxField } from "./combobox-field"
import { DatePickerWithManualInput } from "./date-picker-with-manual-input"
import { useParties } from "@/hooks/use-parties"
import { usePromoters } from "@/hooks/use-promoters"
import { createContract, updateContract } from "@/app/actions/contracts"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { type GenerateContractFormValues, generateContractFormSchema } from "@/lib/generate-contract-form-schema"
import type { Party, Promoter } from "@/lib/types"

interface ContractGeneratorFormProps {
  contract?: {
    id: string;
    contract_type?: string;
    party_a_id?: string;
    party_b_id?: string;
    promoter_id?: string;
    effective_date?: string;
    termination_date?: string;
    contract_value?: number;
    payment_terms?: string;
    content_english?: string;
    content_spanish?: string;
    contract_name?: string;
    // add other fields as needed
  }
}

export function ContractGeneratorForm({ contract }: ContractGeneratorFormProps) {
  const t = useTranslations("ContractGeneratorForm")
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionState, setActionState] = useState<{
    success: boolean
    message: string
    errors?: Record<string, string[]>
  }>({ success: false, message: "" })

  const form = useForm<GenerateContractFormValues>({
    resolver: zodResolver(generateContractFormSchema),
    defaultValues: {
      contractName: contract?.contract_name || "",
      contractType: contract?.contract_type || "",
      partyA: contract?.party_a_id || "",
      partyB: contract?.party_b_id || "",
      promoter: contract?.promoter_id || "",
      effectiveDate: contract?.effective_date ? new Date(contract.effective_date) : undefined,
      terminationDate: contract?.termination_date ? new Date(contract.termination_date) : undefined,
      contractValue: contract?.contract_value || undefined,
      paymentTerms: contract?.payment_terms || "",
      contentEnglish: contract?.content_english || "",
      contentSpanish: contract?.content_spanish || "",
    },
  })

  const { data: partiesData = [] } = useParties()
  const { data: promotersData = [] } = usePromoters()

  const partyOptions = (Array.isArray(partiesData) ? partiesData : []).map((party: Party) => ({
    value: party.id,
    label: party.name_en || party.name_ar || party.id,
  }))

  const promoterOptions = (Array.isArray(promotersData) ? promotersData : []).map((promoter: Promoter) => ({
    value: promoter.id,
    label: promoter.name_en || promoter.name_ar || promoter.id,
  }))

  useEffect(() => {
    if (actionState.message) {
      toast({
        title: actionState.success ? t("successMessage") : t("errorMessage"),
        description: actionState.message,
        variant: actionState.success ? "default" : "destructive",
      })
      if (actionState.success) {
        // Redirect to contracts list or detail page after successful submission/update
        router.push("/contracts")
      }
    }
    if (actionState.errors) {
      for (const field in actionState.errors) {
        form.setError(field as keyof GenerateContractFormValues, {
          type: "server",
          message: actionState.errors[field]?.[0],
        })
      }
    }
  }, [actionState, toast, t, router, form])

  const onSubmit = (data: GenerateContractFormValues) => {
    // Map form values to backend fields
    const mapped = {
      contract_name: data.contractName,
      contract_type: data.contractType,
      first_party_id: data.partyA,
      second_party_id: data.partyB,
      promoter_id: data.promoter,
      effective_date: data.effectiveDate ? data.effectiveDate.toISOString() : null,
      termination_date: data.terminationDate ? data.terminationDate.toISOString() : null,
      contract_value: data.contractValue,
      payment_terms: data.paymentTerms,
      content_english: data.contentEnglish,
      content_spanish: data.contentSpanish,
    }
    startTransition(async () => {
      try {
        let result
        if (contract) {
          result = await updateContract(contract.id, mapped)
        } else {
          result = await createContract(mapped)
        }
        setActionState(result as any)
      } catch (error) {
        setActionState({
          success: false,
          message: error instanceof Error ? error.message : "An unknown error occurred",
        })
      }
    })
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("loadingParties")}</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contractName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contractNameLabel")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contractType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contractTypeLabel")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partyA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client (Party A)</FormLabel>
              <FormControl>
                <ComboboxField
                  field={field}
                  options={partyOptions}
                  placeholder={t("selectParty")}
                  searchPlaceholder={t("searchParties")}
                  emptyStateMessage={t("noPartiesFound")}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partyB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employer (Party B)</FormLabel>
              <FormControl>
                <ComboboxField
                  field={field}
                  options={partyOptions}
                  placeholder={t("selectParty")}
                  searchPlaceholder={t("searchParties")}
                  emptyStateMessage={t("noPartiesFound")}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="promoter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("promoterLabel")}</FormLabel>
              <FormControl>
                <ComboboxField
                  field={field}
                  options={promoterOptions}
                  placeholder={t("selectPromoter")}
                  searchPlaceholder={t("searchPromoters")}
                  emptyStateMessage={t("noPromotersFound")}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="effectiveDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("effectiveDateLabel")}</FormLabel>
              <FormControl>
                <DatePickerWithManualInput
                  date={field.value}
                  setDate={field.onChange}
                  placeholder={t("datePickerPlaceholder")}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terminationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("terminationDateLabel")}</FormLabel>
              <FormControl>
                <DatePickerWithManualInput
                  date={field.value}
                  setDate={field.onChange}
                  placeholder={t("datePickerPlaceholder")}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contractValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contractValueLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value === undefined ? "" : field.value}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number.parseFloat(e.target.value))
                  }
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("paymentTermsLabel")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contentEnglish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contentEnglishLabel")}</FormLabel>
              <FormControl>
                <Textarea rows={10} {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contentSpanish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contentSpanishLabel")}</FormLabel>
              <FormControl>
                <Textarea rows={10} {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {contract ? t("updateButton") : t("submitButton")}
        </Button>
      </form>
    </Form>
  )
}

export default ContractGeneratorForm
