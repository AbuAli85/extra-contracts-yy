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
  // Corrected named export
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Promoter name is required.").trim(),
  name_en: z.string().min(1, "Name (English) is required.").trim(),
  name_ar: z.string().min(1, "Name (Arabic) is required.").trim(),
  id_card_number: z.string().min(1, "ID card number is required.").trim(),
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
  email: z.string().email("Invalid email address.").min(1, "Email is required.").trim().or(z.literal("")),
  phone: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e))
    .or(z.literal("")),
  company_name: z.string().min(1, "Company name is required.").trim(),
  company_address: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e))
    .or(z.literal("")),
  city: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e))
    .or(z.literal("")),
  state: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e))
    .or(z.literal("")),
  zip_code: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e))
    .or(z.literal("")),
  country: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e))
    .or(z.literal("")),
  bio: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e))
    .or(z.literal("")),
  website: z
    .string()
    .url("Invalid URL format.")
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  logo_url: z
    .string()
    .url("Invalid URL format.")
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
  profile_picture_url: z
    .union([z.string().url("Invalid URL format."), z.instanceof(File)])
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e))
    .or(z.literal("")),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export type PromoterProfileFormData = z.infer<typeof promoterProfileSchema>
