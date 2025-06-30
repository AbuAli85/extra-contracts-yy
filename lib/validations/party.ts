import { z } from "zod"

const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,15}$/

export const partyBaseSchema = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().min(1, "English name is required").trim(),
  name_ar: z.string().min(1, "Arabic name is required").trim(),
  email: z.string().email("Invalid email address").min(1, "Email is required").trim(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Invalid phone number format",
    })
    .transform((e) => (e === "" ? undefined : e)),
  address_en: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  address_ar: z
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  type: z.enum(["individual", "company"], {
    required_error: "Party type is required",
  }),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const partyCreateSchema = partyBaseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const partyUpdateSchema = partyBaseSchema.partial().extend({
  id: z.string().uuid(),
})

export const companyPartySchema = partyBaseSchema.extend({
  type: z.literal("company"),
  company_registration: z.string().min(1, "Company registration is required").trim(),
  tax_id: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  legal_representative: z.string().min(1, "Legal representative is required").trim(),
})

export const individualPartySchema = partyBaseSchema.extend({
  type: z.literal("individual"),
  id_card_number: z.string().min(1, "ID card number is required").trim(),
  passport_number: z.string().optional().transform((e) => (e === "" ? undefined : e)),
  nationality: z.string().min(1, "Nationality is required").trim(),
  date_of_birth: z.coerce.date().optional(),
})

export const partyFormSchema = z.discriminatedUnion("type", [
  companyPartySchema,
  individualPartySchema,
])

export const partiesBulkActionSchema = z.object({
  action: z.enum(["delete", "activate", "deactivate", "suspend"]),
  partyIds: z.array(z.string().uuid()).min(1, "At least one party must be selected"),
})

export const partySearchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(["individual", "company"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  sortBy: z.enum(["name_en", "name_ar", "created_at", "updated_at"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type PartyFormData = z.infer<typeof partyFormSchema>
export type CompanyPartyData = z.infer<typeof companyPartySchema>
export type IndividualPartyData = z.infer<typeof individualPartySchema>
export type PartyCreateData = z.infer<typeof partyCreateSchema>
export type PartyUpdateData = z.infer<typeof partyUpdateSchema>
export type PartiesBulkActionData = z.infer<typeof partiesBulkActionSchema>
export type PartySearchData = z.infer<typeof partySearchSchema>

// Type guards
export function isCompanyParty(party: PartyFormData): party is CompanyPartyData {
  return party.type === "company"
}

export function isIndividualParty(party: PartyFormData): party is IndividualPartyData {
  return party.type === "individual"
}