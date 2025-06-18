import { z } from "zod"

const isBrowser = typeof window !== "undefined"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const fileSchema = z
  .any()
  .refine(
    (file) =>
      !file ||
      (isBrowser ? file instanceof File && file.size <= MAX_FILE_SIZE : file.size <= MAX_FILE_SIZE),
    `Max file size is 5MB.`,
  )
  .refine(
    (file) =>
      !file ||
      (isBrowser
        ? file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)
        : ACCEPTED_IMAGE_TYPES.includes(file.type)),
    ".jpg, .jpeg, .png and .webp files are accepted.",
  )
  .optional()
  .nullable()

const dateOptionalNullableSchema = z
  .date({
    coerce: true, // Automatically try to convert string to Date
  })
  .optional()
  .nullable()

export const promoterProfileSchema = z.object({
  name_en: z.string().min(1, "Name (English) is required."),
  name_ar: z.string().min(1, "Name (Arabic) is required."),
  id_card_number: z.string().min(1, "ID card number is required."),
  employer_id: z.string().optional().nullable(),
  outsourced_to_id: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  work_location: z.string().optional().nullable(),
  status: z.enum(["active", "inactive", "suspended"], { required_error: "Status is required." }),
  contract_valid_until: dateOptionalNullableSchema,
  id_card_image: fileSchema,
  passport_image: fileSchema,
  existing_id_card_url: z.string().optional().nullable(),
  existing_passport_url: z.string().optional().nullable(),
  id_card_expiry_date: dateOptionalNullableSchema,
  passport_expiry_date: dateOptionalNullableSchema,
  notes: z.string().optional().nullable(),
})

export type PromoterProfileFormData = z.infer<typeof promoterProfileSchema>

// Sample data for dropdowns
export const sampleEmployers = [
  { value: "agency_alpha", label: "Agency Alpha Solutions" },
  { value: "beta_workforce", label: "Beta Workforce Inc." },
  { value: "gamma_talents", label: "Gamma Talents Co." },
]

export const sampleClients = [
  { value: "client_mega_corp", label: "MegaCorp International" },
  { value: "client_tech_innovators", label: "Tech Innovators Ltd." },
  { value: "client_global_retail", label: "Global Retail Group" },
]

export const promoterStatuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
]
