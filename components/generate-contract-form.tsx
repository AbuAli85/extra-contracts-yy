// components/generate-contract-form.tsx
"use client"

import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parseISO } from "date-fns"
import { motion } from "framer-motion"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { DatePickerWithManualInput } from "./date-picker-with-manual-input"
import ComboboxField from "@/components/combobox-field"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"
import {
  contractGeneratorSchema,
  type ContractGeneratorFormData,
} from "@/lib/schema-generator"
import { useParties, type Party as PartyType } from "@/hooks/use-parties"
import { usePromoters } from "@/hooks/use-promoters"
import type { Promoter } from "@/types/custom"

interface ContractGeneratorFormProps {
  /** Existing contract when editing; new contract if undefined. */
  contract?: Database["public"]["Tables"]["contracts"]["Row"] | null
  /** Callback when the form is successfully saved. */
  onFormSubmit?: () => void
}

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

export default function ContractGeneratorForm({
  contract,
  onFormSubmit,
}: ContractGeneratorFormProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Load parties & promoters
  const {
    data: employerParties,
    isLoading: isLoadingEmployerParties,
    error: employerPartiesError,
  } = useParties("Employer")
  const {
    data: clientParties,
    isLoading: isLoadingClientParties,
    error: clientPartiesError,
  } = useParties("Client")
  const {
    data: promoters,
    isLoading: isLoadingPromoters,
    error: promotersError,
  } = usePromoters()

  const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null)
  const [promoterOptions, setPromoterOptions] = useState<
    { value: string; label: string }[]
  >([])

  const { reset, ...form } = useForm<ContractGeneratorFormData>({
    resolver: zodResolver(contractGeneratorSchema),
    mode: "onTouched",
    defaultValues: {
      first_party_id: undefined,
      second_party_id: undefined,
      promoter_id: undefined,
      contract_start_date: undefined,
      contract_end_date: undefined,
      email: "",
      job_title: "",
      work_location: "",
    },
  })

  // Build combobox options
  useEffect(() => {
    if (promoters) {
      setPromoterOptions(
        promoters.map((p) => ({
          value: p.id,
          label: `${p.name_en} / ${p.name_ar} (ID: ${p.id_card_number ?? "N/A"})`,
        }))
      )
    }
  }, [promoters])

  // Prefill when editing
  useEffect(() => {
    if (contract) {
      reset({
        first_party_id: contract.first_party_id ?? undefined,
        second_party_id: contract.second_party_id ?? undefined,
        promoter_id: contract.promoter_id ?? undefined,
        contract_start_date: contract.contract_start_date
          ? parseISO(contract.contract_start_date)
          : undefined,
        contract_end_date: contract.contract_end_date
          ? parseISO(contract.contract_end_date)
          : undefined,
        email: contract.email ?? "",
        job_title: contract.job_title ?? "",
        work_location: contract.work_location ?? "",
      })
    }
  }, [contract, reset])

  // Watch promoter id → show preview
  const watchedPromoterId = useWatch({
    control: form.control,
    name: "promoter_id",
  })
  useEffect(() => {
    if (watchedPromoterId && promoters) {
      const sel = promoters.find((p) => p.id === watchedPromoterId) || null
      setSelectedPromoter(sel)
    } else {
      setSelectedPromoter(null)
    }
  }, [watchedPromoterId, promoters])

  // Surface load errors
  useEffect(() => {
    if (employerPartiesError)
      toast({
        title: "Error loading Employer parties",
        description: employerPartiesError.message,
        variant: "destructive",
      })
    if (clientPartiesError)
      toast({
        title: "Error loading Client parties",
        description: clientPartiesError.message,
        variant: "destructive",
      })
    if (promotersError)
      toast({
        title: "Error loading promoters",
        description: promotersError.message,
        variant: "destructive",
      })
  }, [employerPartiesError, clientPartiesError, promotersError, toast])

  // Mutation: call your API routes instead of supabase.from(...)
  const { mutate: saveContract, isLoading: isSubmitting } = useMutation({
    mutationFn: async (values: ContractGeneratorFormData) => {
      const payload = {
        first_party_id: values.first_party_id,
        second_party_id: values.second_party_id,
        promoter_id: values.promoter_id,
        contract_start_date: format(values.contract_start_date!, "yyyy-MM-dd"),
        contract_end_date: format(values.contract_end_date!, "yyyy-MM-dd"),
        email: values.email,
        job_title: values.job_title,
        work_location: values.work_location,
      }

      // UPDATE
      if (contract?.id) {
        const res = await fetch(`/api/contracts/${contract.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || err.message || res.statusText)
        }
        const { contract: updated } = await res.json()
        return updated
      }

      // CREATE
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || err.message || res.statusText)
      }
      const { contract: created } = await res.json()
      return created
    },
    onSuccess: async (data) => {
      toast({
        title: contract?.id ? "Contract Updated!" : "Contract Created!",
        description: data.pdf_url
          ? `PDF: ${data.pdf_url}`
          : "PDF generation pending.",
      })
      reset()
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
      onFormSubmit?.()

      // trigger webhook if needed
      const hookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
      if (hookUrl) {
        try {
          await fetch("/api/trigger-webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contract_id: data.id }),
          })
        } catch (err) {
          console.error("Make webhook error:", err)
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message ?? "Unexpected error",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (values: ContractGeneratorFormData) => {
    saveContract(values)
  }

  const isLoadingInitialData =
    isLoadingEmployerParties || isLoadingClientParties || isLoadingPromoters

  // show spinner until selects are loaded
  if (
    isLoadingInitialData &&
    !form.formState.isDirty &&
    !employerParties &&
    !clientParties &&
    !promoters
  ) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-lg text-muted-foreground">
          Loading form data...
        </p>
      </div>
    )
  }

  // validation ring classes
  const getInputStateClasses = (fieldName: keyof ContractGeneratorFormData) => {
    const fieldState = form.getFieldState(fieldName)
    if (fieldState.error) return "ring-destructive ring-2"
    if (fieldState.isDirty && !fieldState.error && fieldState.isTouched)
      return "ring-success ring-2"
    return ""
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Contracting Parties */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h3 className="mb-6 border-b-2 border-primary pb-2 font-heading text-xl font-semibold">
            Contracting Parties
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="first_party_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party A (Employer)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    disabled={isSubmitting || isLoadingEmployerParties}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={getInputStateClasses("first_party_id")}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingEmployerParties
                              ? "Loading Employers..."
                              : "Select Employer"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingEmployerParties && (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      )}
                      {!isLoadingEmployerParties &&
                        employerParties?.length === 0 && (
                          <SelectItem value="no-data" disabled>
                            No employers found
                          </SelectItem>
                        )}
                      {!isLoadingEmployerParties &&
                        employerParties?.map((party: PartyType) => (
                          <SelectItem key={party.id} value={party.id}>
                            {party.name_en} / {party.name_ar}{" "}
                            {party.crn && `(CRN: ${party.crn})`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="second_party_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party B (Client)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    disabled={isSubmitting || isLoadingClientParties}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={getInputStateClasses("second_party_id")}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingClientParties
                              ? "Loading Clients..."
                              : "Select Client"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingClientParties && (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      )}
                      {!isLoadingClientParties &&
                        clientParties?.length === 0 && (
                          <SelectItem value="no-data" disabled>
                            No clients found
                          </SelectItem>
                        )}
                      {!isLoadingClientParties &&
                        clientParties?.map((party: PartyType) => (
                          <SelectItem key={party.id} value={party.id}>
                            {party.name_en} / {party.name_ar}{" "}
                            {party.crn && `(CRN: ${party.crn})`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        {/* Promoter Information */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h3 className="mb-6 border-b-2 border-primary pb-2 font-heading text-xl font-semibold">
            Promoter Information
          </h3>
          <FormField
            control={form.control}
            name="promoter_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promoter</FormLabel>
                <ComboboxField
                  field={field}
                  options={promoterOptions}
                  placeholder={
                    isLoadingPromoters
                      ? "Loading Promoters..."
                      : "Select a promoter"
                  }
                  searchPlaceholder="Search promoters..."
                  emptyStateMessage="No promoter found."
                  disabled={isSubmitting || isLoadingPromoters}
                  inputClassName={getInputStateClasses("promoter_id")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedPromoter ? (
            <div className="space-y-1 rounded-md border bg-muted/50 p-3 text-sm">
              <p>
                <span className="font-medium">Name (EN):</span>{" "}
                {selectedPromoter.name_en}
              </p>
              <p dir="rtl">
                <span className="font-medium">Name (AR):</span>{" "}
                {selectedPromoter.name_ar}
              </p>
              <p>
                <span className="font-medium">ID Card:</span>{" "}
                {selectedPromoter.id_card_number}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a promoter to view details.
            </p>
          )}
        </motion.div>

        {/* Contract Period */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h3 className="mb-6 border-b-2 border-primary pb-2 font-heading text-xl font-semibold">
            Contract Period
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contract_start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Contract Start Date</FormLabel>
                  <DatePickerWithManualInput
                    date={field.value}
                    setDate={field.onChange}
                    dateFormat="dd-MM-yyyy"
                    placeholder="dd-MM-yyyy"
                    disabled={isSubmitting}
                    inputClassName={getInputStateClasses(
                      "contract_start_date"
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contract_end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Contract End Date</FormLabel>
                  <DatePickerWithManualInput
                    date={field.value}
                    setDate={field.onChange}
                    dateFormat="dd-MM-yyyy"
                    placeholder="dd-MM-yyyy"
                    disabled={
                      (form.getValues("contract_start_date")
                        ? field.value! <=
                          form.getValues("contract_start_date")!
                        : false) || isSubmitting
                    }
                    inputClassName={getInputStateClasses(
                      "contract_end_date"
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        {/* Additional Details */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h3 className="mb-6 border-b-2 border-primary pb-2 font-heading text-xl font-semibold">
            Additional Details
          </h3>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="contact@example.com"
                    {...field}
                    disabled={isSubmitting}
                    className={getInputStateClasses("email")}
                  />
                </FormControl>
                <FormDescription>
                  Email address for contract-related notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Marketing Specialist"
                    {...field}
                    disabled={isSubmitting}
                    className={getInputStateClasses("job_title")}
                  />
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
                <FormLabel>Work Location (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Main Office, Remote"
                    {...field}
                    disabled={isSubmitting}
                    className={getInputStateClasses("work_location")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold"
            disabled={isSubmitting || isLoadingInitialData}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="me-2 h-5 w-5 animate-spin" /> Submitting…
              </>
            ) : contract?.id ? (
              "Update Contract"
            ) : (
              "Generate & Save Contract"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
