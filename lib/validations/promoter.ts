import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,15}$/

const fileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp files are accepted"
  )

const urlOrFileSchema = z
  .union([
    z.string().url("Invalid URL format"),
    z.instanceof(File),
    z.literal(""),
  ])
  .optional()
  .transform((e) => (e === "" ? undefined : e))

export const promoterBaseSchema = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().min(1, "English name is required").trim(),
  name_ar: z.string().min(1, "Arabic name is required").trim(),
  id_card_number: z.string().min(1, "ID card number is required").trim(),
  email: z.string().email("Invalid email address").min(1, "Email is required").trim(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Invalid phone number format",
    })
    .transform((e) => (e === "" ? undefined : e)),
  job_title: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  work_location: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  status: z.enum(["active", "inactive", "suspended"], {
    required_error: "Status is required",
  }),
  employer_id: z.string().uuid().optional().nullable(),
  outsourced_to_id: z.string().uuid().optional().nullable(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const promoterDatesSchema = z.object({
  contract_valid_until: z.coerce.date().optional().nullable(),
  id_card_expiry_date: z.coerce.date().optional().nullable(),
  passport_expiry_date: z.coerce.date().optional().nullable(),
})

export const promoterDocumentsSchema = z.object({
  id_card_image: fileSchema,
  passport_image: fileSchema,
  profile_picture: urlOrFileSchema,
  existing_id_card_url: z.string().url().optional().nullable(),
  existing_passport_url: z.string().url().optional().nullable(),
  existing_profile_picture_url: z.string().url().optional().nullable(),
})

export const promoterContactSchema = z.object({
  website: z
    .string()
    .url("Invalid URL format")
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  bio: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  address: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  city: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  country: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  postal_code: z.string().optional().transform((e) => (e === "" ? undefined : e)),
})

export const promoterSchema = promoterBaseSchema
  .merge(promoterDatesSchema)
  .merge(promoterDocumentsSchema)
  .merge(promoterContactSchema)
  .superRefine((data, ctx) => {
    // Validate contract expiry is in the future
    if (data.contract_valid_until && data.contract_valid_until < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contract expiry date must be in the future",
        path: ["contract_valid_until"],
      })
    }

    // Validate ID card expiry is in the future
    if (data.id_card_expiry_date && data.id_card_expiry_date < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ID card expiry date must be in the future",
        path: ["id_card_expiry_date"],
      })
    }

    // Validate passport expiry is in the future
    if (data.passport_expiry_date && data.passport_expiry_date < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passport expiry date must be in the future",
        path: ["passport_expiry_date"],
      })
    }

    // Validate that at least one identification document is provided
    if (!data.id_card_image && !data.existing_id_card_url && !data.passport_image && !data.existing_passport_url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one identification document (ID card or passport) is required",
        path: ["id_card_image"],
      })
    }
  })

export const promoterCreateSchema = promoterSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  existing_id_card_url: true,
  existing_passport_url: true,
  existing_profile_picture_url: true,
})

export const promoterUpdateSchema = promoterSchema.partial().extend({
  id: z.string().uuid(),
})

export const promoterSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  employer_id: z.string().uuid().optional(),
  outsourced_to_id: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  sortBy: z.enum(["name_en", "name_ar", "created_at", "updated_at"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const promotersBulkActionSchema = z.object({
  action: z.enum(["delete", "activate", "deactivate", "suspend"]),
  promoterIds: z.array(z.string().uuid()).min(1, "At least one promoter must be selected"),
})

export const promoterAssignmentSchema = z.object({
  promoter_id: z.string().uuid(),
  employer_id: z.string().uuid().optional().nullable(),
  outsourced_to_id: z.string().uuid().optional().nullable(),
  contract_valid_until: z.coerce.date().optional().nullable(),
})

export type PromoterFormData = z.infer<typeof promoterSchema>
export type PromoterCreateData = z.infer<typeof promoterCreateSchema>
export type PromoterUpdateData = z.infer<typeof promoterUpdateSchema>
export type PromoterSearchData = z.infer<typeof promoterSearchSchema>
export type PromotersBulkActionData = z.infer<typeof promotersBulkActionSchema>
export type PromoterAssignmentData = z.infer<typeof promoterAssignmentSchema>

// Status options for form dropdowns
export const promoterStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
] as const

// Validation helpers
export function validatePromoterImages(data: PromoterFormData): string[] {
  const errors: string[] = []

  if (data.id_card_image && data.id_card_image.size > MAX_FILE_SIZE) {
    errors.push("ID card image must be less than 5MB")
  }

  if (data.passport_image && data.passport_image.size > MAX_FILE_SIZE) {
    errors.push("Passport image must be less than 5MB")
  }

  return errors
}

export function isPromoterActive(promoter: { status: string; contract_valid_until?: Date | null }): boolean {
  if (promoter.status !== "active") {
    return false
  }

  if (promoter.contract_valid_until && promoter.contract_valid_until < new Date()) {
    return false
  }

  return true
}