"use client";

<<<<<<< HEAD
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
import type { Contract } from "@/lib/types"

interface ContractGeneratorFormProps {
  contract?: Contract // Optional prop for editing existing contracts
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

  const { data: partiesData, isLoading: isLoadingParties, isError: isErrorParties, error: partiesError } = useParties()
  const {
    data: promotersData,
    isLoading: isLoadingPromoters,
    isError: isErrorPromoters,
    error: promotersError,
  } = usePromoters()

  const partyOptions =
    partiesData?.data?.map((party) => ({
      value: party.id,
      label: party.name,
    })) || []

  const promoterOptions =
    promotersData?.data?.map((promoter) => ({
      value: promoter.id,
      label: promoter.name,
    })) || []

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
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString())
        } else if (typeof value === "number") {
          formData.append(key, value.toString())
        } else {
          formData.append(key, value)
        }
      }
    })

    startTransition(async () => {
      try {
        let result
    if (contract) {
          result = await updateContract(contract.id, formData)
    } else {
          result = await createContract(formData)
    }
        setActionState(result)
      } catch (error) {
        setActionState({
          success: false,
          message: error instanceof Error ? error.message : "An unknown error occurred",
        })
      }
    })
  }

  if (isLoadingParties || isLoadingPromoters) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("loadingParties")}</span>
      </div>
    )
  }

  if (isErrorParties || isErrorPromoters) {
    return (
      <div className="p-8 text-red-500">
        {t("errorMessage")}: {partiesError?.message || promotersError?.message || t("unknownError")}
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
                  options={partyOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectParty")}
                  searchPlaceholder={t("searchParties")}
                  emptyMessage={t("noPartiesFound")}
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
                  options={partyOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("selectParty")}
                  searchPlaceholder={t("searchParties")}
                  emptyMessage={t("noPartiesFound")}
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
                  options={promoterOptions}
                  value={field.value || ""} // Ensure it's a string for combobox
                  onValueChange={field.onChange}
                  placeholder={t("selectPromoter")}
                  searchPlaceholder={t("searchPromoters")}
                  emptyMessage={t("noPromotersFound")}
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
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  placeholder={t("datePickerPlaceholder")}
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
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  placeholder={t("datePickerPlaceholder")}
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
=======
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContractDetail, Party, Promoter } from "@/lib/types";
import { useParties } from "@/hooks/use-parties";
import { usePromoters } from "@/hooks/use-promoters";
import { ComboboxField } from "./combobox-field";
import { DatePickerWithManualInput } from "./date-picker-with-manual-input";
import { createContract, updateContract, ContractInsert } from "@/app/actions/contracts";

const contractFormSchema = z.object({
  first_party_id: z.string().min(1, "First party is required."),
  second_party_id: z.string().min(1, "Second party is required."),
  promoter_id: z.string().min(1, "Promoter is required."),
  contract_start_date: z.date({ required_error: "Start date is required." }),
  contract_end_date: z.date({ required_error: "End date is required." }),
  contract_value: z.coerce.number().min(0, "Contract value must be a positive number.").optional(),
  job_title: z.string().optional(),
  work_location: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

interface ContractGeneratorFormProps {
  contract?: ContractDetail;
}

export function ContractGeneratorForm({ contract }: ContractGeneratorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: parties, isLoading: partiesLoading } = useParties();
  const { data: promoters, isLoading: promotersLoading } = usePromoters();
  const [error, setError] = useState<string | null>(null);

  const defaultValues: Partial<ContractFormValues> = contract
    ? {
        first_party_id: contract.first_party_id,
        second_party_id: contract.second_party_id,
        promoter_id: contract.promoter_id,
        contract_start_date: contract.contract_start_date ? new Date(contract.contract_start_date) : undefined,
        contract_end_date: contract.contract_end_date ? new Date(contract.contract_end_date) : undefined,
        contract_value: contract.contract_value ?? undefined,
        job_title: contract.job_title ?? undefined,
        work_location: contract.work_location ?? undefined,
      }
    : {};

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues,
  });

  const onSubmit = (data: ContractFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const payload: Partial<ContractInsert> = {
          ...data,
          contract_start_date: data.contract_start_date.toISOString(),
          contract_end_date: data.contract_end_date.toISOString(),
        };

        if (contract) {
          await updateContract(contract.id, payload);
          toast.success("Contract updated successfully!");
        } else {
          await createContract(payload as ContractInsert);
          toast.success("Contract created successfully!");
        }
        router.push("/contracts");
        router.refresh();
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const partyOptions =
    parties?.map((party) => ({
      value: party.id.toString(),
      label: party.name_en,
    })) || [];

  const promoterOptions =
    promoters?.map((promoter) => ({
      value: promoter.id.toString(),
      label: `${promoter.name_en} (${promoter.name_ar})`,
    })) || [];

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">
        {contract ? "Edit Contract" : "Generate New Contract"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="first_party_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Party (e.g., Client)</FormLabel>
                <FormControl>
                  <ComboboxField
                    field={field}
                    options={partyOptions}
                    placeholder="Select a party"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="second_party_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Second Party (e.g., Employer)</FormLabel>
                <FormControl>
                  <ComboboxField
                    field={field}
                    options={partyOptions}
                    placeholder="Select a party"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promoter_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promoter</FormLabel>
                <FormControl>
                  <ComboboxField
                    field={field}
                    options={promoterOptions}
                    placeholder="Select a promoter"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contract_start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePickerWithManualInput
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contract_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePickerWithManualInput
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contract_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Value</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter contract value" 
                    {...field} 
                    onChange={event => field.onChange(event.target.value === '' ? null : +event.target.value)}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job title" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="work_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter work location" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? (contract ? "Updating..." : "Creating...") : (contract ? "Update Contract" : "Create Contract")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ContractGeneratorForm;
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
