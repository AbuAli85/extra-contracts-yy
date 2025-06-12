import { z } from "zod"
import type { Database } from "./supabase" // Import from generated types

// Re-export main types for convenience
export type Party = Database["public"]["Tables"]["parties"]["Row"]
export type Promoter = Database["public"]["Tables"]["promoters"]["Row"]
export type Contract = Database["public"]["Tables"]["contracts"]["Row"]

// Example Zod schema for a form (can be moved to a lib/validations folder)
export const promoterFormSchema = z.object({
  name_en: z.string().min(2, "English name is required."),
  name_ar: z.string().min(2, "Arabic name is required."),
  id_card_number: z.string().min(5, "ID card number is required."),
  // Add other promoter fields as necessary, e.g., status, employer_id, etc.
  // For example:
  // status: z.enum(["active", "inactive", "pending_review"]),
  // employer_id: z.string().uuid().nullable(),
  id_card_url: z.string().url().optional().nullable(),
  passport_url: z.string().url().optional().nullable(),
  // ... any other fields from your PromoterFormData
})

export type PromoterFormData = z.infer<typeof promoterFormSchema>

export const promoterStatusesList = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending_review", label: "Pending Review" },
  // Add other statuses if needed
]

// Zod schema for the Contract Generator Form
// This should align with the fields in ContractGeneratorForm and the API payload
export const contractGeneratorSchema = z
  .object({
    first_party_id: z.string().uuid("Please select Party A."),
    second_party_id: z.string().uuid("Please select Party B."),
    promoter_id: z.string().uuid("Please select a Promoter."),
    contract_start_date: z.date({ required_error: "Contract start date is required." }),
    contract_end_date: z.date({ required_error: "Contract end date is required." }),
    email: z.string().email("Please enter a valid email address for notifications."),
    job_title: z.string().optional().nullable(), // Example optional field
    work_location: z.string().optional().nullable(), // Example optional field
    // Add other fields as necessary
  })
  .refine((data) => data.contract_end_date > data.contract_start_date, {
    message: "End date must be after start date.",
    path: ["contract_end_date"], // Path of error
  })

export type ContractGeneratorFormData = z.infer<typeof contractGeneratorSchema>
