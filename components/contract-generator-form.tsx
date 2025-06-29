"use client"

import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ComboboxField } from "@/components/combobox-field"
import { DatePickerWithPresetsField } from "@/components/date-picker-with-presets-field"
import { contractFormSchema } from "@/lib/generate-contract-form-schema"
import { createContract, updateContract } from "@/app/actions/contracts"
import { useEffect, useState } from "react"
import { getParties, getPromoters } from "@/lib/data"
import type { Party, Promoter } from "@/lib/types"
import { useTranslations } from "next-intl"

interface ContractGeneratorFormProps {
  initialData?: z.infer<typeof contractFormSchema>
  contractId?: string
}

export function ContractGeneratorForm({ initialData, contractId }: ContractGeneratorFormProps) {
  const t = useTranslations("ContractForm")
  const [parties, setParties] = useState<Party[]>([])
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [partiesData, promotersData] = await Promise.all([getParties(), getPromoters()])
        setParties(partiesData)
        setPromoters(promotersData)
      } catch (error) {
        console.error("Failed to fetch parties or promoters:", error)
        toast({
          title: t("fetchErrorTitle"),
          description: t("fetchErrorDescription"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [t])

  const form = useForm<z.infer<typeof contractFormSchema>>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: initialData || {
      firstPartyNameEn: "",
      firstPartyNameAr: "",
      secondPartyNameEn: "",
      secondPartyNameAr: "",
      promoterNameEn: "",
      promoterNameAr: "",
      contractType: "",
      startDate: undefined,
      endDate: undefined,
      contentEn: "",
      contentAr: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof contractFormSchema>) => {
    try {
      if (contractId) {
        await updateContract(contractId, values)
        toast({
          title: t("updateSuccessTitle"),
          description: t("updateSuccessDescription"),
        })
      } else {
        await createContract(values)
        toast({
          title: t("successTitle"),
          description: t("successDescription"),
        })
      }
    } catch (error: any) {
      toast({
        title: t("errorTitle"),
        description: error.message || t("errorDescription"),
        variant: "destructive",
      })
    }
  }

  const partyOptions = parties.map((party) => ({
    value: party.name_en, // Using English name as value for simplicity
    label: `${party.name_en} (${party.name_ar})`,
  }))

  const promoterOptions = promoters.map((promoter) => ({
    value: promoter.name_en, // Using English name as value for simplicity
    label: `${promoter.name_en} (${promoter.name_ar})`,
  }))

  const contractTypeOptions = [
    { value: "Service Agreement", label: t("contractTypeServiceAgreement") },
    { value: "Partnership Agreement", label: t("contractTypePartnershipAgreement") },
    { value: "NDA", label: t("contractTypeNDA") },
    { value: "Lease Agreement", label: t("contractTypeLeaseAgreement") },
    { value: "Employment Contract", label: t("contractTypeEmploymentContract") },
    { value: "Other", label: t("contractTypeOther") },
  ]

  if (loading) {
    return <div className="text-center py-8">{t("loadingData")}</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstPartyNameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstPartyNameEn")}</FormLabel>
                <ComboboxField
                  options={partyOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectFirstParty")}
                  searchPlaceholder={t("searchParty")}
                  emptyMessage={t("noPartyFound")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstPartyNameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstPartyNameAr")}</FormLabel>
                <Input {...field} dir="rtl" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondPartyNameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("secondPartyNameEn")}</FormLabel>
                <ComboboxField
                  options={partyOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectSecondParty")}
                  searchPlaceholder={t("searchParty")}
                  emptyMessage={t("noPartyFound")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondPartyNameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("secondPartyNameAr")}</FormLabel>
                <Input {...field} dir="rtl" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promoterNameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("promoterNameEn")}</FormLabel>
                <ComboboxField
                  options={promoterOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectPromoter")}
                  searchPlaceholder={t("searchPromoter")}
                  emptyMessage={t("noPromoterFound")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promoterNameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("promoterNameAr")}</FormLabel>
                <Input {...field} dir="rtl" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contractType")}</FormLabel>
                <ComboboxField
                  options={contractTypeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectContractType")}
                  searchPlaceholder={t("searchContractType")}
                  emptyMessage={t("noContractTypeFound")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("startDate")}</FormLabel>
                <FormControl>
                  <DatePickerWithPresetsField date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("endDate")}</FormLabel>
                <FormControl>
                  <DatePickerWithPresetsField date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contentEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contentEn")}</FormLabel>
              <Textarea rows={10} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contentAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contentAr")}</FormLabel>
              <Textarea rows={10} {...field} dir="rtl" />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? contractId
              ? t("updatingContract")
              : t("generatingContract")
            : contractId
              ? t("updateContract")
              : t("generateContract")}
        </Button>
      </form>
    </Form>
  )
}
