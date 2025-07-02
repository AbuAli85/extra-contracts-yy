import { z } from "zod"

export const partyFormSchema = z.object({
  name_en: z.string().min(1, "Party name (English) is required"),
  name_ar: z.string().min(1, "Party name (Arabic) is required"),
  crn: z.string().min(1, "Commercial Registration Number (CRN) is required"),
  type: z.enum(["Employer", "Client", "Both"]).default("Employer"),
  role: z.string().min(1, "Role is required"),
  cr_expiry_date: z.date().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email("Invalid email format").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  address_en: z.string().optional(),
  address_ar: z.string().optional(),
  tax_number: z.string().optional(),
  license_number: z.string().optional(),
  license_expiry_date: z.date().optional(),
  status: z.enum(["Active", "Inactive", "Suspended"]).default("Active"),
  notes: z.string().optional(),
})

export type PartyFormData = z.infer<typeof partyFormSchema>
