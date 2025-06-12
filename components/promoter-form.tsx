"use client"
import { useState, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  promoterFormSchema,
  type PromoterFormData, // Assuming PromoterFormData is also in types/custom.ts or derived from promoterFormSchema
  promoterStatusesList,
} from "@/types/custom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel as ShadcnFormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Edit3Icon, LockIcon, FileWarningIcon as WarningIcon } from "lucide-react"
import type { Promoter } from "@/lib/types"
import { format, parseISO, differenceInDays, isPast, isValid } from "date-fns"
import ImageUploadField from "@/components/image-upload-field"
import DatePickerWithPresetsField from "@/components/date-picker-with-presets-field"
import ComboboxField from "@/components/combobox-field" // New import
import { cn } from "@/lib/utils"

const BUCKET_NAME = "promoter-documents"

interface PromoterFormProps {
  promoterToEdit?: Promoter | null
  onFormSubmit: () => void
}

// Helper for expiry alerts
const getExpiryAlert = (
  dateString: string | Date | null | undefined,
  alertDays: number | null | undefined,
  itemName: string,
): { message: string; className: string } | null => {
  if (!dateString || !alertDays || alertDays <= 0) return null

  const date = dateString instanceof Date ? dateString : parseISO(dateString as string)
  if (!isValid(date)) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize today to start of day for consistent comparison

  const daysToExpiry = differenceInDays(date, today)

  if (isPast(date)) {
    return {
      message: `🚫 ${itemName} expired on ${format(date, "MMM d, yyyy")}`,
      className: "text-red-600 dark:text-red-500",
    }
  }
  if (daysToExpiry <= alertDays) {
    return {
      message: `⚠️ ${itemName} expires in ${daysToExpiry} day${daysToExpiry === 1 ? "" : "s"} (on ${format(date, "MMM d, yyyy")})`,
      className: "text-amber-600 dark:text-amber-500",
    }
  }
  return null
}

export default function PromoterForm({ promoterToEdit, onFormSubmit }: PromoterFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditScreen = !!promoterToEdit
  const [isEditable, setIsEditable] = useState(!isEditScreen)

  const form = useForm<PromoterFormData>({
    resolver: zodResolver(promoterFormSchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      id_card_number: "",
      id_card_image: null,
      passport_image: null,
      existing_id_card_url: null,
      existing_passport_url: null,
      id_card_expiry_date: null,
      passport_expiry_date: null,
      employer_id: null,
      outsourced_to_id: null,
      job_title: "",
      work_location: "",
      status: "active",
      contract_valid_until: null,
      notify_before_id_expiry_days: 30,
      notify_before_passport_expiry_days: 90,
      notify_before_contract_expiry_days: 30,
      notes: "",
    },
  })

  // Watch relevant fields for expiry alerts
  const idCardExpiryDate = useWatch({ control: form.control, name: "id_card_expiry_date" })
  const notifyIdDays = useWatch({ control: form.control, name: "notify_before_id_expiry_days" })
  const passportExpiryDate = useWatch({ control: form.control, name: "passport_expiry_date" })
  const notifyPassportDays = useWatch({ control: form.control, name: "notify_before_passport_expiry_days" })
  const contractValidUntil = useWatch({ control: form.control, name: "contract_valid_until" })
  const notifyContractDays = useWatch({ control: form.control, name: "notify_before_contract_expiry_days" })

  const idCardAlert = getExpiryAlert(idCardExpiryDate, notifyIdDays, "ID Card")
  const passportAlert = getExpiryAlert(passportExpiryDate, notifyPassportDays, "Passport")
  const contractAlert = getExpiryAlert(contractValidUntil, notifyContractDays, "Contract")

  useEffect(() => {
    if (promoterToEdit) {
      form.reset({
        name_en: promoterToEdit.name_en || "",
        name_ar: promoterToEdit.name_ar || "",
        id_card_number: promoterToEdit.id_card_number || "",
        id_card_image: null,
        passport_image: null,
        existing_id_card_url: promoterToEdit.id_card_url || null,
        existing_passport_url: promoterToEdit.passport_url || null,
        id_card_expiry_date: promoterToEdit.id_card_expiry_date ? parseISO(promoterToEdit.id_card_expiry_date) : null,
        passport_expiry_date: promoterToEdit.passport_expiry_date
          ? parseISO(promoterToEdit.passport_expiry_date)
          : null,
        employer_id: promoterToEdit.employer_id || null,
        outsourced_to_id: promoterToEdit.outsourced_to_id || null,
        job_title: promoterToEdit.job_title || "",
        work_location: promoterToEdit.work_location || "",
        status: promoterToEdit.status || "active",
        contract_valid_until: promoterToEdit.contract_valid_until
          ? parseISO(promoterToEdit.contract_valid_until)
          : null,
        notify_before_id_expiry_days: promoterToEdit.notify_before_id_expiry_days ?? 30,
        notify_before_passport_expiry_days: promoterToEdit.notify_before_passport_expiry_days ?? 90,
        notify_before_contract_expiry_days: promoterToEdit.notify_before_contract_expiry_days ?? 30,
        notes: promoterToEdit.notes || "",
      })
    } else {
      form.reset({
        ...form.formState.defaultValues,
        status: "active",
        notify_before_id_expiry_days: 30,
        notify_before_passport_expiry_days: 90,
        notify_before_contract_expiry_days: 30,
      })
    }
  }, [promoterToEdit, form])

  const uploadFile = async (
    file: File | null | undefined,
    currentUrl?: string | null | undefined,
  ): Promise<string | null | undefined> => {
    if (file) {
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`
      const filePath = `${fileName}`

      if (currentUrl) {
        try {
          const oldFileName = currentUrl.substring(currentUrl.lastIndexOf("/") + 1)
          await supabase.storage.from(BUCKET_NAME).remove([oldFileName])
        } catch (e) {
          console.warn("Could not remove old file from storage:", e)
        }
      }

      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)
      if (error) throw new Error(`Failed to upload ${file.name}: ${error.message}`)
      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)
      return urlData.publicUrl
    }
    return currentUrl
  }

  async function onSubmit(values: PromoterFormData) {
    if (!isEditable) {
      toast({ title: "Form Locked", description: "Enable 'Editable Mode' to make changes.", variant: "default" })
      return
    }
    setIsSubmitting(true)
    try {
      let idCardUrlResult = values.existing_id_card_url
      if (values.id_card_image instanceof File) {
        idCardUrlResult = await uploadFile(values.id_card_image, values.existing_id_card_url)
      } else if (!values.existing_id_card_url) {
        idCardUrlResult = null
      }

      let passportUrlResult = values.existing_passport_url
      if (values.passport_image instanceof File) {
        passportUrlResult = await uploadFile(values.passport_image, values.existing_passport_url)
      } else if (!values.existing_passport_url) {
        passportUrlResult = null
      }

      const promoterData: Partial<Promoter> = {
        name_en: values.name_en,
        name_ar: values.name_ar,
        id_card_number: values.id_card_number,
        id_card_url: idCardUrlResult,
        passport_url: passportUrlResult,
        id_card_expiry_date: values.id_card_expiry_date ? format(values.id_card_expiry_date, "yyyy-MM-dd") : null,
        passport_expiry_date: values.passport_expiry_date ? format(values.passport_expiry_date, "yyyy-MM-dd") : null,
        employer_id: values.employer_id,
        outsourced_to_id: values.outsourced_to_id,
        job_title: values.job_title,
        work_location: values.work_location,
        status: values.status,
        contract_valid_until: values.contract_valid_until ? format(values.contract_valid_until, "yyyy-MM-dd") : null,
        notify_before_id_expiry_days: values.notify_before_id_expiry_days,
        notify_before_passport_expiry_days: values.notify_before_passport_expiry_days,
        notify_before_contract_expiry_days: values.notify_before_contract_expiry_days,
        notes: values.notes,
      }

      if (promoterToEdit?.id) {
        const { error } = await supabase.from("promoters").update(promoterData).eq("id", promoterToEdit.id).select()
        if (error) throw error
        toast({ title: "Success!", description: "Promoter updated successfully." })
      } else {
        const { error } = await supabase.from("promoters").insert(promoterData).select()
        if (error) throw error
        toast({ title: "Success!", description: "Promoter added successfully." })
      }
      onFormSubmit()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formActuallyDisabled = !isEditable || isSubmitting

  const sectionClasses = "space-y-6 p-5 border rounded-lg shadow-sm bg-card-foreground/5 dark:bg-card-foreground/5"
  const sectionHeaderClasses = "text-xl font-semibold text-foreground border-b border-border pb-3 mb-6"

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-card text-card-foreground shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {promoterToEdit ? "Edit Promoter / تعديل المروج" : "Add New Promoter / إضافة مروج جديد"}
        </h1>
        <div className="flex items-center space-x-3">
          {isEditable ? (
            <Edit3Icon className="h-5 w-5 text-primary" />
          ) : (
            <LockIcon className="h-5 w-5 text-muted-foreground" />
          )}
          <Switch
            id="editable-mode"
            checked={isEditable}
            onCheckedChange={setIsEditable}
            aria-label="Toggle editable mode"
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30"
          />
          <Label htmlFor="editable-mode" className="text-sm font-medium select-none cursor-pointer">
            {isEditable ? "Editable Mode / وضع التعديل" : "Locked / مقفل"}
          </Label>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Personal Information Section */}
          <div className={sectionClasses}>
            <h2 className={sectionHeaderClasses}>Personal Information / المعلومات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>Name (English)</ShadcnFormLabel>
                    <FormControl>
                      <Input placeholder="Promoter Name (EN)" {...field} disabled={formActuallyDisabled} />
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
                    <ShadcnFormLabel>الاسم (عربي)</ShadcnFormLabel>
                    <FormControl>
                      <Input
                        placeholder="اسم المروج (AR)"
                        {...field}
                        dir="rtl"
                        className="text-right"
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="id_card_number"
              render={({ field }) => (
                <FormItem>
                  <ShadcnFormLabel>ID Card Number / رقم البطاقة الشخصية</ShadcnFormLabel>
                  <FormControl>
                    <Input placeholder="1029384756" {...field} disabled={formActuallyDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Employment Details Section */}
          <div className={sectionClasses}>
            <h2 className={sectionHeaderClasses}>Employment Details / تفاصيل التوظيف</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={form.control}
                name="employer_id"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>Employer / جهة العمل</ShadcnFormLabel>
                    <FormControl>
                      <ComboboxField
                        field={field}
                        options={[]}
                        placeholder="Select employer agency"
                        searchPlaceholder="Search employers..."
                        emptyStateMessage="No employer found."
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outsourced_to_id"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>Outsourced To (Client) / العميل الحالي</ShadcnFormLabel>
                    <FormControl>
                      <ComboboxField
                        field={field}
                        options={[]}
                        placeholder="Select client company"
                        searchPlaceholder="Search clients..."
                        emptyStateMessage="No client found."
                        disabled={formActuallyDisabled}
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
                    <ShadcnFormLabel>Job Title / المسمى الوظيفي</ShadcnFormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales Promoter" {...field} disabled={formActuallyDisabled} />
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
                    <ShadcnFormLabel>Work Location / موقع العمل</ShadcnFormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Main Branch, Riyadh" {...field} disabled={formActuallyDisabled} />
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
                    <ShadcnFormLabel>Status / الحالة</ShadcnFormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={formActuallyDisabled}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {promoterStatusesList.map((status) => (
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
                  <FormItem>
                    <ShadcnFormLabel>Contract Valid Until / صلاحية العقد حتى</ShadcnFormLabel>
                    <FormControl>
                      <DatePickerWithPresetsField
                        field={field}
                        placeholder="Select contract end date"
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    {contractAlert && !form.formState.errors.contract_valid_until && (
                      <p className={cn("text-xs font-medium mt-1.5 flex items-center", contractAlert.className)}>
                        <WarningIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" /> {contractAlert.message}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className={sectionClasses}>
            <h2 className={sectionHeaderClasses}>Documents / المستندات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <FormField
                control={form.control}
                name="id_card_image"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel htmlFor={field.name}>ID Card Image / صورة البطاقة</ShadcnFormLabel>
                    <FormControl>
                      <ImageUploadField
                        id={field.name}
                        field={field}
                        initialImageUrl={form.watch("existing_id_card_url")}
                        disabled={formActuallyDisabled}
                        onImageRemove={() => {
                          form.setValue("existing_id_card_url", null)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_card_expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>ID Card Expiry Date / تاريخ انتهاء البطاقة</ShadcnFormLabel>
                    <FormControl>
                      <DatePickerWithPresetsField
                        field={field}
                        placeholder="Select ID expiry"
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    {idCardAlert && !form.formState.errors.id_card_expiry_date && (
                      <p className={cn("text-xs font-medium mt-1.5 flex items-center", idCardAlert.className)}>
                        <WarningIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" /> {idCardAlert.message}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passport_image"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel htmlFor={field.name}>Passport Image / صورة الجواز</ShadcnFormLabel>
                    <FormControl>
                      <ImageUploadField
                        id={field.name}
                        field={field}
                        initialImageUrl={form.watch("existing_passport_url")}
                        disabled={formActuallyDisabled}
                        onImageRemove={() => {
                          form.setValue("existing_passport_url", null)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passport_expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>Passport Expiry Date / تاريخ انتهاء الجواز</ShadcnFormLabel>
                    <FormControl>
                      <DatePickerWithPresetsField
                        field={field}
                        placeholder="Select passport expiry"
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    {passportAlert && !form.formState.errors.passport_expiry_date && (
                      <p className={cn("text-xs font-medium mt-1.5 flex items-center", passportAlert.className)}>
                        <WarningIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" /> {passportAlert.message}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notification Settings Section */}
          <div className={sectionClasses}>
            <h2 className={sectionHeaderClasses}>Notification Settings / إعدادات الإشعارات</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
              <FormField
                control={form.control}
                name="notify_before_id_expiry_days"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>ID Expiry Alert (Days) / تنبيه انتهاء البطاقة (أيام)</ShadcnFormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 30"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? null : Number.parseInt(e.target.value, 10))
                        }
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notify_before_passport_expiry_days"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>Passport Expiry Alert (Days) / تنبيه انتهاء الجواز (أيام)</ShadcnFormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 90"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? null : Number.parseInt(e.target.value, 10))
                        }
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notify_before_contract_expiry_days"
                render={({ field }) => (
                  <FormItem>
                    <ShadcnFormLabel>Contract Expiry Alert (Days) / تنبيه انتهاء العقد (أيام)</ShadcnFormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 30"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? null : Number.parseInt(e.target.value, 10))
                        }
                        disabled={formActuallyDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className={sectionClasses}>
            <h2 className={sectionHeaderClasses}>Notes / ملاحظات</h2>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <ShadcnFormLabel>Internal Notes / ملاحظات داخلية</ShadcnFormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any internal notes about this promoter..."
                      className="min-h-[120px] resize-y"
                      {...field}
                      disabled={formActuallyDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={formActuallyDisabled || isSubmitting}
              className="min-w-[200px] py-3 text-base font-semibold"
              size="lg"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : promoterToEdit ? (
                "Update Promoter / تحديث المروج"
              ) : (
                "Add Promoter / إضافة مروج"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
