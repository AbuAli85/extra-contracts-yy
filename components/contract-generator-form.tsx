"use client"

import { FormDescription } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { format } from "date-fns"

import { contractGeneratorSchema, type ContractGeneratorFormData } from "@/types/custom"
import { useParties, type Party as PartyType } from "@/hooks/use-parties" // Import Party type if needed
import { usePromoters } from "@/hooks/use-promoters"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { DatePickerWithManualInput } from "./date-picker-with-manual-input"
import ComboboxField from "@/components/combobox-field"
import { motion } from "framer-motion"

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

export default function ContractGeneratorForm() {
  const queryClient = useQueryClient()

  // Fetch parties using the React Query hook
  const {
    data: employerParties, // Renamed for clarity
    isLoading: isLoadingEmployerParties,
    error: employerPartiesError,
  } = useParties("Employer")

  const {
    data: clientParties, // Renamed for clarity
    isLoading: isLoadingClientParties,
    error: clientPartiesError,
  } = useParties("Client")

  const { data: promoters, isLoading: isLoadingPromoters } = usePromoters()

  // Console log for debugging
  useEffect(() => {
    console.log("Employer Parties Data:", employerParties)
    console.log("Client Parties Data:", clientParties)
  }, [employerParties, clientParties])

  useEffect(() => {
    if (employerPartiesError) {
      toast.error("Error loading Employer parties", { description: employerPartiesError.message })
    }
    if (clientPartiesError) {
      toast.error("Error loading Client parties", { description: clientPartiesError.message })
    }
  }, [employerPartiesError, clientPartiesError])

  const [promoterOptions, setPromoterOptions] = useState<{ value: string; label: string }[]>([])

  const form = useForm<ContractGeneratorFormData>({
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

  useEffect(() => {
    if (promoters) {
      setPromoterOptions(
        promoters.map((p) => ({
          value: p.id,
          label: `${p.name_en} / ${p.name_ar} (ID: ${p.id_card_number || "N/A"})`,
        })),
      )
    }
  }, [promoters])

  const { mutate: createContract, isLoading: isSubmitting } = useMutation({
    mutationFn: async (data: ContractGeneratorFormData) => {
      const apiPayload = {
        ...data,
        contract_start_date: format(data.contract_start_date, "yyyy-MM-dd"),
        contract_end_date: format(data.contract_end_date, "yyyy-MM-dd"),
      }
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create contract.")
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast.success("Contract Created!", {
        description: `PDF: ${data.contract.pdf_url || "Pending generation."}`,
      })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
    onError: (error: any) => {
      toast.error("Creation Failed", {
        description: error.message || "An unexpected error occurred.",
      })
    },
  })

  const onSubmit = (data: ContractGeneratorFormData) => {
    createContract(data)
  }

  const isLoadingInitialData = isLoadingEmployerParties || isLoadingClientParties || isLoadingPromoters

  // Show main loader only if no data has been fetched yet for parties/promoters
  // and the form hasn't been interacted with.
  if (isLoadingInitialData && !form.formState.isDirty && !employerParties && !clientParties && !promoters) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-lg text-muted-foreground">Loading form data...</p>
      </div>
    )
  }

  const getInputStateClasses = (fieldName: keyof ContractGeneratorFormData) => {
    const fieldState = form.getFieldState(fieldName)
    if (fieldState.error) return "ring-destructive ring-2"
    if (fieldState.isDirty && !fieldState.error && fieldState.isTouched) return "ring-success ring-2"
    return ""
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
          <h3 className="text-xl font-semibold font-heading border-b-2 border-primary pb-2 mb-6">
            Contracting Parties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="first_party_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party A (Employer)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""} // Ensure value is controlled
                    disabled={isSubmitting || isLoadingEmployerParties}
                  >
                    <FormControl>
                      <SelectTrigger className={getInputStateClasses("first_party_id")}>
                        <SelectValue
                          placeholder={isLoadingEmployerParties ? "Loading Employers..." : "Select Employer"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingEmployerParties && (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      )}
                      {!isLoadingEmployerParties && employerParties?.length === 0 && (
                        <SelectItem value="no-data" disabled>
                          No employers found
                        </SelectItem>
                      )}
                      {!isLoadingEmployerParties &&
                        employerParties?.map(
                          (
                            party: PartyType, // Added PartyType for clarity
                          ) => (
                            <SelectItem key={party.id} value={party.id}>
                              {party.name_en} / {party.name_ar} {party.crn && `(CRN: ${party.crn})`}
                            </SelectItem>
                          ),
                        )}
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
                    value={field.value || ""} // Ensure value is controlled
                    disabled={isSubmitting || isLoadingClientParties}
                  >
                    <FormControl>
                      <SelectTrigger className={getInputStateClasses("second_party_id")}>
                        <SelectValue placeholder={isLoadingClientParties ? "Loading Clients..." : "Select Client"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingClientParties && (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      )}
                      {!isLoadingClientParties && clientParties?.length === 0 && (
                        <SelectItem value="no-data" disabled>
                          No clients found
                        </SelectItem>
                      )}
                      {!isLoadingClientParties &&
                        clientParties?.map(
                          (
                            party: PartyType, // Added PartyType for clarity
                          ) => (
                            <SelectItem key={party.id} value={party.id}>
                              {party.name_en} / {party.name_ar} {party.crn && `(CRN: ${party.crn})`}
                            </SelectItem>
                          ),
                        )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        {/* Promoter Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
          <h3 className="text-xl font-semibold font-heading border-b-2 border-primary pb-2 mb-6">
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
                  placeholder={isLoadingPromoters ? "Loading Promoters..." : "Select a promoter"}
                  searchPlaceholder="Search promoters..."
                  emptyStateMessage="No promoter found."
                  disabled={isSubmitting || isLoadingPromoters}
                  inputClassName={getInputStateClasses("promoter_id")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Contract Period Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
          <h3 className="text-xl font-semibold font-heading border-b-2 border-primary pb-2 mb-6">Contract Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    inputClassName={getInputStateClasses("contract_start_date")}
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
                    disabled={(date) =>
                      (form.getValues("contract_start_date")
                        ? date <= form.getValues("contract_start_date")!
                        : false) || isSubmitting
                    }
                    inputClassName={getInputStateClasses("contract_end_date")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        {/* Additional Details Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
          <h3 className="text-xl font-semibold font-heading border-b-2 border-primary pb-2 mb-6">Additional Details</h3>
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
                <FormDescription>Email address for contract-related notifications.</FormDescription>
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

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={isSubmitting || isLoadingInitialData}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin me-2 h-5 w-5" /> Submitting...
              </>
            ) : (
              "Generate & Save Contract"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
