import { z } from "zod"

export const partyFormSchema = z.object({
<<<<<<< HEAD
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
=======
  name_en: z.string().min(2, { message: "English name must be at least 2 characters." }),
  name_ar: z.string().optional(),
  crn: z.string().optional(),
  type: z.enum(["Employer", "Client"]),
  role: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Suspended"]),
  cr_expiry_date: z.date().optional(),
  tax_number: z.string().optional(),
  license_number: z.string().optional(),
  license_expiry_date: z.date().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z
  .string()
  .email({ message: "Invalid email address." })
  .optional()
  .or(z.literal("")),
  address_en: z.string().optional(),
  address_ar: z.string().optional(),
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
  notes: z.string().optional(),
})

export type PartyFormData = z.infer<typeof partyFormSchema>
