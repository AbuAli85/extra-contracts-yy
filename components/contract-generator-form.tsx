"use client"

import React from "react"
import { useActionState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import type { z } from "zod"
import { useRouter } from "next/navigation"

import { createContract, updateContract } from "@/app/actions/contracts"
import { ComboboxField } from "@/components/combobox-field"
import { DatePickerWithPresetsField } from "@/components/date-picker-with-presets-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { contractSchema } from "@/lib/validations/contract"
import type { Party, Promoter, Contract } from "@/lib/types"

interface ContractGeneratorFormProps {
  parties: Party[]
  promoters: Promoter[]
  initialData?: Contract
}

export function ContractGeneratorForm({ parties, promoters, initialData }: ContractGeneratorFormProps) {
  const t = useTranslations("ContractGeneratorForm")
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      contract_name: initialData?.contract_name || "",
      contract_type: initialData?.contract_type || "",
      status: initialData?.status || "Draft",
      party_a_id: initialData?.party_a_id || "",
      party_b_id: initialData?.party_b_id || "",
      promoter_id: initialData?.promoter_id || "",
      effective_date: initialData?.effective_date ? new Date(initialData.effective_date) : undefined,
      termination_date: initialData?.termination_date ? new Date(initialData.termination_date) : undefined,
      contract_value: initialData?.contract_value || undefined,
      payment_terms: initialData?.payment_terms || "",
      content_english: initialData?.content_english || "",
      content_spanish: initialData?.content_spanish || "",
      is_template: initialData?.is_template || false,
      is_archived: initialData?.is_archived || false,
    },
  })

  const [state, formAction] = useActionState(
    initialData ? updateContract.bind(null, initialData.id) : createContract,
    null,
  )

  React.useEffect(() => {
    if (state) {
      if (state.success) {
        toast({
          title: t("success"),
          description: state.message,
        })
        if (!initialData) {
          form.reset()
        }
        router.push(initialData ? `/contracts/${initialData.id}` : "/contracts")
        router.refresh()
      } else {
        toast({
          title: t("error"),
          description: state.message || t("somethingWentWrong"),
          variant: "destructive",
        })
        if (state.errors) {
          for (const [field, messages] of Object.entries(state.errors)) {
            form.setError(field as keyof typeof contractSchema, {
              type: "server",
              message: messages?.join(", "),
            })
          }
        }
      }
    }
  }, [state, toast, form, initialData, router, t])

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="contract_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contractName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("contractNamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contract_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contractType")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectContractType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Service">{t("service")}</SelectItem>
                    <SelectItem value="Sales">{t("sales")}</SelectItem>
                    <SelectItem value="Partnership">{t("partnership")}</SelectItem>
                    <SelectItem value="NDA">{t("nda")}</SelectItem>
                    <SelectItem value="Other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">{t("draft")}</SelectItem>
                    <SelectItem value="Pending Review">{t("pendingReview")}</SelectItem>
                    <SelectItem value="Approved">{t("approved")}</SelectItem>
                    <SelectItem value="Active">{t("active")}</SelectItem>
                    <SelectItem value="Completed">{t("completed")}</SelectItem>
                    <SelectItem value="Archived">{t("archived")}</SelectItem>
                    <SelectItem value="Terminated">{t("terminated")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="party_a_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("partyA")}</FormLabel>
                <ComboboxField
                  options={parties}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectPartyA")}
                  noResultsText={t("noPartyFound")}
                  searchPlaceholder={t("searchParty")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="party_b_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("partyB")}</FormLabel>
                <ComboboxField
                  options={parties}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectPartyB")}
                  noResultsText={t("noPartyFound")}
                  searchPlaceholder={t("searchParty")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promoter_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("promoter")}</FormLabel>
                <ComboboxField
                  options={promoters}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectPromoter")}
                  noResultsText={t("noPromoterFound")}
                  searchPlaceholder={t("searchPromoter")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="effective_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-1">{t("effectiveDate")}</FormLabel>
                <DatePickerWithPresetsField
                  date={field.value}
                  setDate={(date) => field.onChange(date)}
                  placeholder={t("pickEffectiveDate")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="termination_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-1">{t("terminationDate")}</FormLabel>
                <DatePickerWithPresetsField
                  date={field.value}
                  setDate={(date) => field.onChange(date)}
                  placeholder={t("pickTerminationDate")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contract_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contractValue")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("contractValuePlaceholder")}
                    {...field}
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? undefined : Number.parseFloat(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment_terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("paymentTerms")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("paymentTermsPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content_english"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contentEnglish")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("contentEnglishPlaceholder")} {...field} rows={8} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content_spanish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contentSpanish")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("contentSpanishPlaceholder")} {...field} rows={8} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="is_template"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("isTemplate")}</FormLabel>
                  <p className="text-sm text-muted-foreground">{t("isTemplateDescription")}</p>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_archived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("isArchived")}</FormLabel>
                  <p className="text-sm text-muted-foreground">{t("isArchivedDescription")}</p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? initialData
              ? t("updating")
              : t("creating")
            : initialData
              ? t("updateContract")
              : t("createContract")}
        </Button>
      </form>
    </Form>
  )
}
