import { z } from "zod"
// Utility provides browser-aware validation helpers
import { createOptionalFileSchema } from "./utils"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const fileSchema = createOptionalFileSchema(
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  "Max file size is 5MB.",
  ".jpg, .jpeg, .png and .webp files are accepted.",
)

const dateOptionalNullableSchema = z
  .date({
    coerce: true, // Automatically try to convert string to Date
  })
  .optional()
  .nullable()

export const promoterProfileSchema = z.object({
  name: z.string().min(1, "Promoter name is required."),
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
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  phone: z.string().min(1, "Phone number is required."),
  company_name: z.string().min(1, "Company name is required."),
  company_address: z.string().min(1, "Company address is required."),
  contact_person: z
    .string()
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
  contact_email: z
    .string()
    .email("Invalid email address.")
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
  contact_phone: z
    .string()
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
  website: z
    .string()
    .url("Invalid URL format.")
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
  notes: z
    .string()
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
  logo_url: z
    .string()
    .url("Invalid URL format.")
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
})

export type PromoterProfileFormData = z.infer<typeof promoterProfileSchema>
