"use client"

import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  promoterProfileSchema,
  type PromoterProfileFormData,
  sampleEmployers,
  sampleClients,
  promoterStatuses,
} from "@/lib/promoter-profile-schema"
import type { PromoterProfile } from "@/lib/types" // Assuming PromoterProfile is defined in lib/types.ts
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { devLog } from "@/lib/dev-log"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUploadField from "@/components/image-upload-field"
import DatePickerWithPresetsField from "@/components/date-picker-with-presets-field"
import { Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"

interface PromoterProfileFormProps {
  promoterToEdit?: PromoterProfile | null
  onFormSubmitSuccess?: (data: PromoterProfileFormData) => void // Callback for successful submission
}

export default function PromoterProfileForm({ promoterToEdit, onFormSubmitSuccess }: PromoterProfileFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!promoterToEdit
  const [isEditable, setIsEditable] = useState(!isEditMode) // Editable by default in add mode

  const form = useForm<PromoterProfileFormData>({
    resolver: zodResolver(promoterProfileSchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      id_card_number: "",
      employer_id: null,
      outsourced_to_id: null,
      job_title: "",
      work_location: "",
      status: "active",
      contract_valid_until: null,
      id_card_image: null,
      passport_image: null,
      existing_id_card_url: null,
      existing_passport_url: null,
      id_card_expiry_date: null,
      passport_expiry_date: null,
      notes: "",
    },
  })

  useEffect(() => {
    if (isEditMode && promoterToEdit) {
      form.reset({
        name_en: promoterToEdit.name_en || "",
        name_ar: promoterToEdit.name_ar || "",
        id_card_number: promoterToEdit.id_card_number || "",
        employer_id: promoterToEdit.employer_id || null,
        outsourced_to_id: promoterToEdit.outsourced_to_id || null,
        job_title: promoterToEdit.job_title || "",
        work_location: promoterToEdit.work_location || "",
        status: promoterToEdit.status || "active",
        contract_valid_until: promoterToEdit.contract_valid_until
          ? parseISO(promoterToEdit.contract_valid_until)
          : null,
        id_card_image: null, // File objects are not set in reset
        passport_image: null,
        existing_id_card_url: promoterToEdit.id_card_url || null,
        existing_passport_url: promoterToEdit.passport_url || null,
        id_card_expiry_date: promoterToEdit.id_card_expiry_date ? parseISO(promoterToEdit.id_card_expiry_date) : null,
        passport_expiry_date: promoterToEdit.passport_expiry_date
          ? parseISO(promoterToEdit.passport_expiry_date)
          : null,
        notes: promoterToEdit.notes || "",
      })
    }
  }, [isEditMode, promoterToEdit, form])

  async function onSubmit(values: PromoterProfileFormData) {
    setIsSubmitting(true)
    devLog("Form values:", values)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // In a real app, you would handle file uploads here and then send data to your backend.
      // For example, upload `values.id_card_image` and `values.passport_image` if they are File objects.
      // Then, replace them with the returned URLs before saving to the database.

      const submissionData = {
        ...values,
        // This part is more about preparing data for a simulated API call.
        // The actual URL determination (upload new, use existing, or null)
        // would happen with your `uploadFile` function and Supabase logic.
        // For now, we assume `values.existing_id_card_url` is correctly nulled if removed.
        id_card_url:
          values.id_card_image instanceof File
            ? "new_file_placeholder_url_id_card.jpg" // Placeholder for new upload
            : values.existing_id_card_url,
        passport_url:
          values.passport_image instanceof File
            ? "new_file_placeholder_url_passport.jpg" // Placeholder for new upload
            : values.existing_passport_url,
        contract_valid_until: values.contract_valid_until
          ? format(new Date(values.contract_valid_until), "yyyy-MM-dd")
          : null,
        id_card_expiry_date: values.id_card_expiry_date
          ? format(new Date(values.id_card_expiry_date), "yyyy-MM-dd")
          : null,
        passport_expiry_date: values.passport_expiry_date
          ? format(new Date(values.passport_expiry_date), "yyyy-MM-dd")
          : null,
      }
      // Remove file objects if you're not sending them directly
      delete (submissionData as any).id_card_image
      delete (submissionData as any).passport_image

      if (isEditMode) {
        // await api.updatePromoter(promoterToEdit.id, submissionData);
        toast({ title: "Success!", description: "Promoter profile updated successfully." })
      } else {
        // await api.createPromoter(submissionData);
        toast({ title: "Success!", description: "New promoter added successfully." })
        form.reset() // Reset form after successful addition
      }
      onFormSubmitSuccess?.(values)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formDisabled = !isEditable || isSubmitting

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">
              {isEditMode ? "Edit Promoter Profile" : "Add New Promoter"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? `Updating profile for ${promoterToEdit?.name_en}`
                : "Fill in the details for the new promoter."}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 pt-2 sm:pt-0">
            <Switch
              id="editable-mode"
              checked={isEditable}
              onCheckedChange={setIsEditable}
              aria-label="Toggle editable mode"
            />
            <Label htmlFor="editable-mode" className="text-sm font-medium">
              Editable Mode
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Column 1 */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={formDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم (عربي)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="جون دو"
                          {...field}
                          dir="rtl"
                          className="text-right"
                          disabled={formDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_card_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Card Number / رقم البطاقة الشخصية</FormLabel>
                      <FormControl>
                        <Input placeholder="1012345678" {...field} disabled={formDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Agency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} disabled={formDisabled}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employer agency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sampleEmployers.map((emp) => (
                            <SelectItem key={emp.value} value={emp.value}>
                              {emp.label}
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
                  name="outsourced_to_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currently Outsourced To (Client)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} disabled={formDisabled}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sampleClients.map((client) => (
                            <SelectItem key={client.value} value={client.value}>
                              {client.label}
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
                  name="id_card_image"
                  render={({ field: fileField }) => (
                    <FormItem>
                      <ImageUploadField
                        field={fileField}
                        initialImageUrl={form.watch("existing_id_card_url")}
                        label="ID Card Image"
                        disabled={formDisabled}
                        onImageRemove={() => {
                          form.setValue("existing_id_card_url", null)
                          // Ensure the file field itself is also cleared if it's not already by RHF
                          form.setValue("id_card_image", null)
                        }}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_card_expiry_date"
                  render={({ field }) => (
                    <DatePickerWithPresetsField
                      field={field}
                      label="ID Card Expiry Date"
                      placeholder="Select ID card expiry"
                      disabled={formDisabled}
                    />
                  )}
                />
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title / Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Sales Promoter" {...field} disabled={formDisabled} />
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
                        <Input placeholder="e.g., City Mall, Main Branch" {...field} disabled={formDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={formDisabled}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {promoterStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
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
                  name="contract_valid_until"
                  render={({ field }) => (
                    <DatePickerWithPresetsField
                      field={field}
                      label="Contract Valid Until"
                      placeholder="Select contract end date"
                      disabled={formDisabled}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="passport_image"
                  render={({ field: fileField }) => (
                    <FormItem>
                      <ImageUploadField
                        field={fileField}
                        initialImageUrl={form.watch("existing_passport_url")}
                        label="Passport Image"
                        disabled={formDisabled}
                        onImageRemove={() => {
                          form.setValue("existing_passport_url", null)
                          form.setValue("passport_image", null)
                        }}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passport_expiry_date"
                  render={({ field }) => (
                    <DatePickerWithPresetsField
                      field={field}
                      label="Passport Expiry Date"
                      placeholder="Select passport expiry"
                      disabled={formDisabled}
                    />
                  )}
                />
              </div>
            </div>

            {/* Full-width field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any internal notes about this promoter..."
                      className="min-h-[100px] resize-y"
                      {...field}
                      disabled={formDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={formDisabled || isSubmitting} className="min-w-[150px]">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isEditMode ? (
                  "Update Profile"
                ) : (
                  "Add Promoter"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
